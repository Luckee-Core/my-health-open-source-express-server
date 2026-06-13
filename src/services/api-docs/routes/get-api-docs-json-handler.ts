import type { Request, Response } from 'express';
import { processGetApiDocsJson } from '../process-get-api-docs-json';
import { sendHandlerError, sendSuccess } from '../../../utils/http';

/**
 * Handles GET /api-docs.json — returns the API documentation catalog (metadata only).
 */
export const getApiDocsJsonHandler = async (_req: Request, res: Response): Promise<void> => {
  console.log('📥 GET /api-docs.json');

  try {
    const catalog = processGetApiDocsJson();
    console.log('✅ GET /api-docs.json');
    console.log('📤 GET /api-docs.json');
    sendSuccess(res, catalog);
  } catch (error) {
    sendHandlerError(res, error, 'GET /api-docs.json');
  }
};
