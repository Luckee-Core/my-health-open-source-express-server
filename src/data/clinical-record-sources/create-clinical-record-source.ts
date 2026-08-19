import type { Pool, PoolClient } from 'pg';

type Queryable = Pool | PoolClient;

export type CreateClinicalRecordSourceInput = {
  entity_table: string;
  entity_id: string;
  upload_id?: string | null;
  source_instance_id?: string | null;
  source_entry_key?: string | null;
  is_primary?: boolean;
};

export type ClinicalRecordSource = {
  id: string;
  entity_table: string;
  entity_id: string;
  upload_id: string | null;
  source_instance_id: string | null;
  source_entry_key: string | null;
  is_primary: boolean;
  created_at: string;
};

/**
 * Links a clinical entity row to its provenance upload/source.
 */
export const createClinicalRecordSource = async (
  pool: Queryable,
  input: CreateClinicalRecordSourceInput,
): Promise<ClinicalRecordSource> => {
  console.log('💾 createClinicalRecordSource');
  const result = await pool.query<ClinicalRecordSource>(
    `INSERT INTO clinical_record_sources (
       entity_table, entity_id, upload_id, source_instance_id, source_entry_key, is_primary
     )
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      input.entity_table,
      input.entity_id,
      input.upload_id ?? null,
      input.source_instance_id ?? null,
      input.source_entry_key ?? null,
      input.is_primary ?? true,
    ],
  );
  return result.rows[0];
};
