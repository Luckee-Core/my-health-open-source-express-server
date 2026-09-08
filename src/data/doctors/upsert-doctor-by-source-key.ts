import type { Pool, PoolClient } from 'pg';
import type { CreateDoctorInput, Doctor } from '../../model/doctor';

type Queryable = Pool | PoolClient;

/**
 * Upserts a doctor by (source_system, source_entry_key).
 */
export const upsertDoctorBySourceKey = async (
  pool: Queryable,
  input: CreateDoctorInput,
): Promise<Doctor> => {
  console.log('💾 upsertDoctorBySourceKey');
  if (!input.source_system || !input.source_entry_key) {
    throw new Error('source_system and source_entry_key are required for upsert');
  }
  try {
    const result = await pool.query<Doctor>(
      `INSERT INTO doctors (
         name, hospital_id, specialty_id, notes, npi, phone, fax,
         source_system, source_document_id, source_entry_key
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       ON CONFLICT (source_system, source_entry_key)
       DO UPDATE SET
         name = EXCLUDED.name,
         hospital_id = EXCLUDED.hospital_id,
         specialty_id = EXCLUDED.specialty_id,
         notes = EXCLUDED.notes,
         npi = COALESCE(EXCLUDED.npi, doctors.npi),
         phone = COALESCE(EXCLUDED.phone, doctors.phone),
         fax = COALESCE(EXCLUDED.fax, doctors.fax),
         source_document_id = EXCLUDED.source_document_id,
         updated_at = now()
       RETURNING *`,
      [
        input.name,
        input.hospital_id,
        input.specialty_id,
        input.notes ?? null,
        input.npi ?? null,
        input.phone ?? null,
        input.fax ?? null,
        input.source_system,
        input.source_document_id ?? null,
        input.source_entry_key,
      ],
    );
    return result.rows[0];
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to upsert Doctor: ${message}`);
  }
};
