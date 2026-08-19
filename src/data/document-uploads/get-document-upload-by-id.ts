import type { Pool } from 'pg';
import type { DocumentUpload } from './types';

/**
 * Loads one document upload by id.
 */
export const getDocumentUploadById = async (
  pool: Pool,
  id: string,
): Promise<DocumentUpload | null> => {
  const result = await pool.query<DocumentUpload>(
    `SELECT * FROM document_uploads WHERE id = $1`,
    [id],
  );
  return result.rows[0] ?? null;
};
