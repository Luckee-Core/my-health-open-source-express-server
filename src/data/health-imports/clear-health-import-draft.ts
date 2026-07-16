import type { Pool, PoolClient } from 'pg';

type Queryable = Pool | PoolClient;

/**
 * Clears draft JSON after successful commit (keeps import metadata row).
 */
export const clearHealthImportDraft = async (
  pool: Queryable,
  healthImportId: string,
): Promise<void> => {
  console.log('💾 clearHealthImportDraft');
  try {
    await pool.query(
      'DELETE FROM health_import_drafts WHERE health_import_id = $1',
      [healthImportId],
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to clear health import draft: ${message}`);
  }
};
