import type { Pool, PoolClient } from 'pg';
import type { CreateDocumentUploadInput, DocumentUpload } from './types';

type Queryable = Pool | PoolClient;

/**
 * Inserts a document upload registry row.
 */
export const createDocumentUpload = async (
  pool: Queryable,
  input: CreateDocumentUploadInput,
): Promise<DocumentUpload> => {
  console.log('💾 createDocumentUpload');
  const result = await pool.query<DocumentUpload>(
    `INSERT INTO document_uploads (
       source_instance_id, ingest_kind, report_type, original_filename,
       content_sha256, report_date, provider_name, storage_path, status
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [
      input.source_instance_id ?? null,
      input.ingest_kind,
      input.report_type,
      input.original_filename ?? null,
      input.content_sha256,
      input.report_date ?? null,
      input.provider_name ?? null,
      input.storage_path ?? null,
      input.status ?? 'pending',
    ],
  );
  return result.rows[0];
};
