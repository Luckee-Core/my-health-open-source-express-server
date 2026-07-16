import type { Request, Response } from 'express';
import {
  requirePgPool,
  sendClientError,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';
import { processPreviewHealthImport } from '../process-preview-health-import';

/**
 * Handles POST /api/data/health-imports/preview (multipart file).
 */
export const previewHealthImportHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  console.log('📥 POST /api/data/health-imports/preview');
  const pool = requirePgPool(res);
  if (!pool) return;

  const file = req.file;
  if (!file?.buffer?.length) {
    sendClientError(res, 'file is required');
    return;
  }

  try {
    const result = await processPreviewHealthImport(pool, {
      filename: file.originalname || 'health-summary.zip',
      buffer: file.buffer,
    });
    console.log('✅ POST /api/data/health-imports/preview');
    console.log('📤 POST /api/data/health-imports/preview');
    sendSuccess(res, result);
  } catch (error) {
    sendHandlerError(res, error, 'POST /api/data/health-imports/preview');
  }
};
