import type { Request, Response } from 'express';
import { processPreviewTherapyExerciseImport } from '../process-preview-therapy-exercise-import';
import {
  requirePgPool,
  sendClientError,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles POST /api/data/therapy-exercise-imports/preview (multipart file).
 */
export const previewTherapyExerciseImportHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  console.log('📥 POST /api/data/therapy-exercise-imports/preview');
  const pool = requirePgPool(res);
  if (!pool) return;

  const file = req.file;
  if (!file?.buffer?.length) {
    sendClientError(res, 'file is required');
    return;
  }

  const mimeType = file.mimetype || 'application/octet-stream';

  try {
    const result = await processPreviewTherapyExerciseImport(pool, {
      buffer: file.buffer,
      mimeType,
    });
    console.log('✅ POST /api/data/therapy-exercise-imports/preview');
    sendSuccess(res, result);
  } catch (error) {
    sendHandlerError(res, error, 'POST /api/data/therapy-exercise-imports/preview');
  }
};
