import type { Pool, PoolClient } from 'pg';

type Queryable = Pool | PoolClient;

/**
 * Upserts the full import draft JSON for a health import id.
 */
export const upsertHealthImportDraft = async (
  pool: Queryable,
  healthImportId: string,
  draftJson: unknown,
): Promise<void> => {
  console.log('💾 upsertHealthImportDraft');
  try {
    await pool.query(
      `INSERT INTO health_import_drafts (health_import_id, draft_json)
       VALUES ($1, $2)
       ON CONFLICT (health_import_id)
       DO UPDATE SET draft_json = EXCLUDED.draft_json, updated_at = now()`,
      [healthImportId, JSON.stringify(draftJson)],
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to upsert health import draft: ${message}`);
  }
};
