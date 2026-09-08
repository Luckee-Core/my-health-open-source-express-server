import type { Request, Response } from 'express';
import { processCreateVitalSign } from '../process-create-vital-sign';
import type { CreateVitalSignInput } from '../../../model/vital-sign';
import {
  requirePgPool,
  sendClientError,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles POST /api/data/vital-signs.
 */
export const postVitalSignHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 POST /api/data/vital-signs');
  const pool = requirePgPool(res);
  if (!pool) return;

  const body = req.body as CreateVitalSignInput;
  if (!body?.recorded_at || (typeof body.recorded_at === 'string' && !body.recorded_at.trim())) {
    sendClientError(res, 'recorded_at is required');
    return;
  }
  if (!body?.metric || (typeof body.metric === 'string' && !body.metric.trim())) {
    sendClientError(res, 'metric is required');
    return;
  }
  if (!body?.value_text || (typeof body.value_text === 'string' && !body.value_text.trim())) {
    sendClientError(res, 'value_text is required');
    return;
  }

  try {
    const created = await processCreateVitalSign(pool, body);
    console.log('✅ POST /api/data/vital-signs');
    console.log('📤 POST /api/data/vital-signs');
    sendSuccess(res, created);
  } catch (error) {
    sendHandlerError(res, error, 'POST /api/data/vital-signs');
  }
};
