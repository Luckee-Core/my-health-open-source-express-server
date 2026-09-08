import type { Pool, PoolClient } from 'pg';
import type { CreateHealthImportInput, HealthImport } from '../../model/health-import';

type Queryable = Pool | PoolClient;

/**
 * Inserts a health import batch row.
 */
export const createHealthImport = async (
  pool: Queryable,
  input: CreateHealthImportInput,
): Promise<HealthImport> => {
  console.log('💾 createHealthImport');
  try {
    const result = await pool.query<HealthImport>(
      `INSERT INTO health_imports (
         filename, content_sha256, status, document_count, summary_json, error
       ) VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        input.filename,
        input.content_sha256,
        input.status ?? 'previewed',
        input.document_count ?? 0,
        input.summary_json ? JSON.stringify(input.summary_json) : null,
        input.error ?? null,
      ],
    );
    return result.rows[0];
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to create health import: ${message}`);
  }
};
