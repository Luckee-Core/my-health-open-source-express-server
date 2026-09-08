import type { Pool, PoolClient } from 'pg';
import type { HealthImport } from '../../model/health-import';

type Queryable = Pool | PoolClient;

/**
 * Marks a previewed import as committed. Returns null if not previewed (race).
 */
export const markHealthImportCommitted = async (
  pool: Queryable,
  id: string,
  summaryJson: Record<string, unknown>,
): Promise<HealthImport | null> => {
  console.log('💾 markHealthImportCommitted');
  try {
    const result = await pool.query<HealthImport>(
      `UPDATE health_imports
       SET status = 'committed',
           summary_json = $2,
           error = NULL,
           updated_at = now()
       WHERE id = $1 AND status = 'previewed'
       RETURNING *`,
      [id, JSON.stringify(summaryJson)],
    );
    return result.rows[0] ?? null;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to mark health import committed: ${message}`);
  }
};
