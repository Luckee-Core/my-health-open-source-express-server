import type { Request, Response } from 'express';
import { getAiExtractSessionWithProposals } from '../../../data/ai-extract-sessions';
import {
  DuplicateUploadError,
  processCommitExtractSession,
  processExtractPaste,
} from '../process-extract-paste';
import {
  requirePgPool,
  sendClientError,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles POST /api/ai/extract/medications.
 */
export const postExtractMedicationsHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  console.log('📥 POST /api/ai/extract/medications');
  const pool = requirePgPool(res);
  if (!pool) return;

  const body = req.body as {
    text?: string;
    source_instance_id?: string | null;
    original_filename?: string | null;
  };

  if (!body.text?.trim()) {
    sendClientError(res, 'text is required');
    return;
  }

  try {
    const result = await processExtractPaste(pool, {
      text: body.text,
      sourceInstanceId: body.source_instance_id ?? null,
      originalFilename: body.original_filename ?? null,
      reportType: 'medications_list',
      entityType: 'medications',
    });
    sendSuccess(res, {
      sessionId: result.session.id,
      uploadId: result.upload.id,
      medicationProposals: result.medicationProposals,
    });
  } catch (error) {
    if (error instanceof DuplicateUploadError) {
      res.status(409).json({
        success: false,
        error: error.message,
        data: { uploadId: error.uploadId },
      });
      return;
    }
    sendHandlerError(res, error, 'POST /api/ai/extract/medications');
  }
};

/**
 * Handles POST /api/ai/extract/conditions.
 */
export const postExtractConditionsHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  console.log('📥 POST /api/ai/extract/conditions');
  const pool = requirePgPool(res);
  if (!pool) return;

  const body = req.body as {
    text?: string;
    source_instance_id?: string | null;
    original_filename?: string | null;
  };

  if (!body.text?.trim()) {
    sendClientError(res, 'text is required');
    return;
  }

  try {
    const result = await processExtractPaste(pool, {
      text: body.text,
      sourceInstanceId: body.source_instance_id ?? null,
      originalFilename: body.original_filename ?? null,
      reportType: 'conditions_list',
      entityType: 'conditions',
    });
    sendSuccess(res, {
      sessionId: result.session.id,
      uploadId: result.upload.id,
      conditionProposals: result.conditionProposals,
    });
  } catch (error) {
    if (error instanceof DuplicateUploadError) {
      res.status(409).json({
        success: false,
        error: error.message,
        data: { uploadId: error.uploadId },
      });
      return;
    }
    sendHandlerError(res, error, 'POST /api/ai/extract/conditions');
  }
};

const readParamId = (value: string | string[]): string =>
  Array.isArray(value) ? value[0] : value;
export const getExtractSessionHandler = async (req: Request, res: Response): Promise<void> => {
  const pool = requirePgPool(res);
  if (!pool) return;

  try {
    const sessionId = readParamId(req.params.id);
    const bundle = await getAiExtractSessionWithProposals(pool, sessionId);
    if (!bundle) {
      sendClientError(res, 'session not found');
      return;
    }
    sendSuccess(res, bundle);
  } catch (error) {
    sendHandlerError(res, error, 'GET /api/ai/extract-sessions/:id');
  }
};

/**
 * Handles POST /api/ai/extract-sessions/:id/commit.
 */
export const postCommitExtractSessionHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const pool = requirePgPool(res);
  if (!pool) return;

  try {
    const sessionId = readParamId(req.params.id);
    const result = await processCommitExtractSession(pool, sessionId);
    sendSuccess(res, result);
  } catch (error) {
    sendHandlerError(res, error, 'POST /api/ai/extract-sessions/:id/commit');
  }
};
