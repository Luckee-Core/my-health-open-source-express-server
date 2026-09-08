import type { Pool } from 'pg';
import {
  createTherapyExerciseImportAiExchange,
  updateTherapyExerciseImportAiExchange,
} from '../../data/therapy-exercise-import-ai-exchanges';
import type { TherapyExerciseImportAiExchange } from '../../model/therapy-exercise-import-ai-exchange';
import {
  createTherapyExerciseImportAiRequest,
  updateTherapyExerciseImportAiRequest,
} from '../../data/therapy-exercise-import-ai-requests';
import { createTherapyExerciseImportAiResponse } from '../../data/therapy-exercise-import-ai-responses';
import type { TherapyExerciseImportDraft } from '../../model/therapy-exercise-import';
import { getManagedAnthropicClient } from '../anthropic';
import {
  parseTherapyExerciseExtractionResponse,
  THERAPY_EXERCISE_IMPORT_SYSTEM_PROMPT,
  THERAPY_EXERCISE_IMPORT_VISION_MODEL,
  validateTherapyImportMimeType,
} from './parse-therapy-exercise-extraction';
import { prepareTherapyImportImage } from './prepare-therapy-import-image';

export type ExtractTherapyExercisesFromImageInput = {
  buffer: Buffer;
  mimeType: string;
  filename?: string;
};

export type ExtractTherapyExercisesFromImageResult = {
  draft: TherapyExerciseImportDraft;
  exchange: TherapyExerciseImportAiExchange;
  requestId: string;
};

/**
 * Calls Anthropic vision and persists the three-table AI audit trail.
 */
export const processExtractTherapyExercisesFromImage = async (
  pool: Pool,
  input: ExtractTherapyExercisesFromImageInput,
): Promise<ExtractTherapyExercisesFromImageResult> => {
  validateTherapyImportMimeType(input.mimeType);

  const client = getManagedAnthropicClient();
  if (!client) {
    throw new Error('Anthropic client unavailable');
  }

  const model = THERAPY_EXERCISE_IMPORT_VISION_MODEL;

  const requestRow = await createTherapyExerciseImportAiRequest(pool, {
    model,
    mime_type: input.mimeType,
    filename: input.filename ?? null,
    system_prompt: THERAPY_EXERCISE_IMPORT_SYSTEM_PROMPT,
  });

  const exchangeRow = await createTherapyExerciseImportAiExchange(pool, {
    request_id: requestRow.id,
    model_used: model,
  });

  await updateTherapyExerciseImportAiRequest(pool, requestRow.id, {
    exchange_id: exchangeRow.id,
  });

  try {
    console.log('🤖 extractTherapyExercisesFromImage');
    const prepared = await prepareTherapyImportImage(input.buffer);
    const base64 = prepared.buffer.toString('base64');

    const response = await client.messages.create({
      model,
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: prepared.mimeType,
                data: base64,
              },
            },
            {
              type: 'text',
              text: THERAPY_EXERCISE_IMPORT_SYSTEM_PROMPT,
            },
          ],
        },
      ],
    });

    const textBlock = response.content.find(
      (block: { type: string; text?: string }) => block.type === 'text',
    );
    if (!textBlock || textBlock.type !== 'text') {
      throw new Error('AI response did not contain text');
    }

    const draft = parseTherapyExerciseExtractionResponse(textBlock.text);
    const inputTokens = response.usage?.input_tokens ?? 0;
    const outputTokens = response.usage?.output_tokens ?? 0;

    const responseRow = await createTherapyExerciseImportAiResponse(pool, {
      request_id: requestRow.id,
      model,
      status: 'success',
      raw_response: textBlock.text,
      parsed_response_json: draft as unknown as Record<string, unknown>,
      usage_input_tokens: inputTokens,
      usage_output_tokens: outputTokens,
    });

    const completedExchange = await updateTherapyExerciseImportAiExchange(pool, exchangeRow.id, {
      response_id: responseRow.id,
      input_tokens: inputTokens,
      output_tokens: outputTokens,
      total_tokens: inputTokens + outputTokens,
      model_used: model,
      status: 'completed',
    });

    await updateTherapyExerciseImportAiRequest(pool, requestRow.id, {
      status: 'completed',
    });

    return {
      draft,
      exchange: completedExchange,
      requestId: requestRow.id,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    await createTherapyExerciseImportAiResponse(pool, {
      request_id: requestRow.id,
      model,
      status: 'error',
      error_message: message,
    }).catch(() => undefined);

    await updateTherapyExerciseImportAiExchange(pool, exchangeRow.id, {
      status: 'failed',
      error_message: message,
    }).catch(() => undefined);

    await updateTherapyExerciseImportAiRequest(pool, requestRow.id, {
      status: 'failed',
    }).catch(() => undefined);

    throw error;
  }
};
