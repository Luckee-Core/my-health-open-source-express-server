import type { Response } from 'express';
import type { Pool } from 'pg';
import { getManagedPgPool } from '../../services/postgres';
import { sendServerError } from './responses';

/**
 * Returns the managed Postgres pool or sends 500 when unavailable.
 */
export const requirePgPool = (res: Response): Pool | null => {
  const pool = getManagedPgPool();
  if (!pool) {
    console.error('❌ Postgres pool unavailable');
    sendServerError(res, 'Service unavailable');
    return null;
  }
  return pool;
};
