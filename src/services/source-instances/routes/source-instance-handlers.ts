import type { Request, Response } from 'express';
import { createSourceInstance, listSourceInstances } from '../../../data/source-instances';
import {
  requirePgPool,
  sendClientError,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles GET /api/data/source-instances.
 */
export const getSourceInstancesHandler = async (req: Request, res: Response): Promise<void> => {
  const pool = requirePgPool(res);
  if (!pool) return;
  try {
    sendSuccess(res, await listSourceInstances(pool));
  } catch (error) {
    sendHandlerError(res, error, 'GET /api/data/source-instances');
  }
};

/**
 * Handles POST /api/data/source-instances.
 */
export const postSourceInstanceHandler = async (req: Request, res: Response): Promise<void> => {
  const pool = requirePgPool(res);
  if (!pool) return;

  const body = req.body as {
    source_system_id?: string;
    hospital_id?: string | null;
    label?: string;
  };

  if (!body.source_system_id?.trim() || !body.label?.trim()) {
    sendClientError(res, 'source_system_id and label are required');
    return;
  }

  try {
    const created = await createSourceInstance(pool, {
      source_system_id: body.source_system_id.trim(),
      hospital_id: body.hospital_id ?? null,
      label: body.label,
    });
    sendSuccess(res, created);
  } catch (error) {
    sendHandlerError(res, error, 'POST /api/data/source-instances');
  }
};
