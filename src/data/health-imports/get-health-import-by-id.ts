import type { Pool, PoolClient } from 'pg';
import type { HealthImport } from './types';

type Queryable = Pool | PoolClient;

/**
 * Loads one health import by id.
 */
export const getHealthImportById = async (
  pool: Queryable,
  id: string,
): Promise<HealthImport | null> => {
  console.log('💾 getHealthImportById');
  try {
    const result = await pool.query<HealthImport>(
      'SELECT * FROM health_imports WHERE id = $1',
      [id],
    );
    return result.rows[0] ?? null;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to load health import: ${message}`);
  }
};
