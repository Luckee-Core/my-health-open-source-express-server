import type { Pool } from 'pg';
import type { DocumentUpload } from './types';

/**
 * Finds an existing upload by content hash (dedup).
 */
export const findDocumentUploadBySha256 = async (
  pool: Pool,
  contentSha256: string,
): Promise<DocumentUpload | null> => {
  const result = await pool.query<DocumentUpload>(
    `SELECT * FROM document_uploads WHERE content_sha256 = $1 LIMIT 1`,
    [contentSha256],
  );
  return result.rows[0] ?? null;
};
