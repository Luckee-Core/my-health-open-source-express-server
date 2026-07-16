import type { Pool } from 'pg';
import type { HealthImport } from './types';

/**
 * Lists health imports newest first.
 */
export const getAllHealthImports = async (pool: Pool): Promise<HealthImport[]> => {
  console.log('💾 getAllHealthImports');
  try {
    const result = await pool.query<HealthImport>(
      'SELECT * FROM health_imports ORDER BY created_at DESC',
    );
    return result.rows;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to load health imports: ${message}`);
  }
};
