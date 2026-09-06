import { getManagedAnthropicClient } from '../anthropic';
import type { TherapyExerciseImportDraftExercise } from '../../data/therapy-exercise-imports';

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
]);

const EXTRACTION_PROMPT = `You are analyzing a photo of speech therapy homework instructions.
Extract each exercise as structured JSON.

Return ONLY valid JSON with this shape:
{
  "exercises": [
    {
      "name": "short exercise name",
      "instructions": "full instructions text or null",
      "tracking_kind": "timed_attempts" or "sets_reps",
      "target_count": number,
      "unit_size": number
    }
  ]
}

Rules:
- timed_attempts: repeated timed holds/repetitions (e.g. 10 attempts at 5 seconds each → target_count=10, unit_size=5)
- sets_reps: sets and reps (e.g. 5 sets of 5 → target_count=5, unit_size=5)
- Use positive integers only
- If unclear, make a reasonable guess and note in instructions`;

type ExtractedDraft = {
  exercises: TherapyExerciseImportDraftExercise[];
};

const isValidExercise = (value: unknown): value is TherapyExerciseImportDraftExercise => {
  if (!value || typeof value !== 'object') return false;
  const row = value as TherapyExerciseImportDraftExercise;
  if (!row.name?.trim()) return false;
  if (row.tracking_kind !== 'timed_attempts' && row.tracking_kind !== 'sets_reps') return false;
  if (!Number.isFinite(row.target_count) || row.target_count < 1) return false;
  if (!Number.isFinite(row.unit_size) || row.unit_size < 1) return false;
  return true;
};

const parseExtractionResponse = (text: string): ExtractedDraft => {
  const trimmed = text.trim();
  const jsonStart = trimmed.indexOf('{');
  const jsonEnd = trimmed.lastIndexOf('}');
  if (jsonStart < 0 || jsonEnd < 0) {
    throw new Error('AI response did not contain JSON');
  }
  const parsed = JSON.parse(trimmed.slice(jsonStart, jsonEnd + 1)) as { exercises?: unknown[] };
  if (!Array.isArray(parsed.exercises)) {
    throw new Error('AI response missing exercises array');
  }
  const exercises = parsed.exercises.filter(isValidExercise).map((row) => ({
    name: row.name.trim(),
    instructions: row.instructions?.trim() ? row.instructions.trim() : null,
    tracking_kind: row.tracking_kind,
    target_count: Math.floor(row.target_count),
    unit_size: Math.floor(row.unit_size),
  }));
  if (exercises.length === 0) {
    throw new Error('No valid exercises extracted from photo');
  }
  return { exercises };
};

/**
 * Validates uploaded image mime type for therapy import.
 */
export const validateTherapyImportMimeType = (mimeType: string): void => {
  if (!ALLOWED_MIME_TYPES.has(mimeType)) {
    throw new Error('Unsupported image type. Use JPEG, PNG, or WebP (HEIC is not supported).');
  }
};

/**
 * Calls Anthropic vision to extract therapy exercises from an image buffer.
 */
export const extractTherapyExercisesFromImage = async (
  buffer: Buffer,
  mimeType: string,
): Promise<ExtractedDraft> => {
  const client = getManagedAnthropicClient();
  if (!client) {
    throw new Error('Anthropic client unavailable');
  }

  validateTherapyImportMimeType(mimeType);

  console.log('🤖 extractTherapyExercisesFromImage');
  const base64 = buffer.toString('base64');
  const mediaType = mimeType as 'image/jpeg' | 'image/png' | 'image/webp';

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: mediaType,
              data: base64,
            },
          },
          {
            type: 'text',
            text: EXTRACTION_PROMPT,
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

  return parseExtractionResponse(textBlock.text);
};
