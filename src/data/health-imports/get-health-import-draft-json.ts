import type { Pool, PoolClient } from 'pg';

type Queryable = Pool | PoolClient;

/**
 * Loads the full draft JSON for a health import.
 */
export const getHealthImportDraftJson = async (
  pool: Queryable,
  healthImportId: string,
): Promise<unknown | null> => {
  console.log('💾 getHealthImportDraftJson');
  try {
    const result = await pool.query<{ draft_json: unknown }>(
      'SELECT draft_json FROM health_import_drafts WHERE health_import_id = $1',
      [healthImportId],
    );
    return result.rows[0]?.draft_json ?? null;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to load health import draft: ${message}`);
  }
};
