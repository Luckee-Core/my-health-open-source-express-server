import type { Request, Response } from 'express';
import {
  requirePgPool,
  sendClientError,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';
import { processCommitHealthImport } from '../process-commit-health-import';

type CommitBody = {
  previewId?: string;
};

/**
 * Handles POST /api/data/health-imports/commit.
 */
export const commitHealthImportHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  console.log('📥 POST /api/data/health-imports/commit');
  const pool = requirePgPool(res);
  if (!pool) return;

  const body = req.body as CommitBody;
  const previewId = typeof body?.previewId === 'string' ? body.previewId.trim() : '';
  if (!previewId) {
    sendClientError(res, 'previewId is required');
    return;
  }

  try {
    const result = await processCommitHealthImport(pool, previewId);
    console.log('✅ POST /api/data/health-imports/commit');
    console.log('📤 POST /api/data/health-imports/commit');
    sendSuccess(res, result);
  } catch (error) {
    sendHandlerError(res, error, 'POST /api/data/health-imports/commit');
  }
};
