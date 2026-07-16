import type { Pool, PoolClient } from 'pg';
import type { HealthImport, UpdateHealthImportInput } from './types';

type Queryable = Pool | PoolClient;

/**
 * Updates a health import by id.
 */
export const updateHealthImportById = async (
  pool: Queryable,
  id: string,
  input: UpdateHealthImportInput,
): Promise<HealthImport> => {
  console.log('💾 updateHealthImportById');
  const sets: string[] = ['updated_at = now()'];
  const values: (string | number | null)[] = [];
  let param = 1;

  if (input.status !== undefined) {
    sets.push(`status = $${param++}`);
    values.push(input.status);
  }
  if (input.document_count !== undefined) {
    sets.push(`document_count = $${param++}`);
    values.push(input.document_count);
  }
  if (input.summary_json !== undefined) {
    sets.push(`summary_json = $${param++}`);
    values.push(input.summary_json ? JSON.stringify(input.summary_json) : null);
  }
  if (input.error !== undefined) {
    sets.push(`error = $${param++}`);
    values.push(input.error);
  }

  values.push(id);

  try {
    const result = await pool.query<HealthImport>(
      `UPDATE health_imports SET ${sets.join(', ')} WHERE id = $${param} RETURNING *`,
      values,
    );
    if (result.rowCount === 0) {
      throw new Error('health import not found');
    }
    return result.rows[0];
  } catch (error) {
    if (error instanceof Error && error.message === 'health import not found') {
      throw error;
    }
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to update health import: ${message}`);
  }
};
