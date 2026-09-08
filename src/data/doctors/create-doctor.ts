import type { Pool, PoolClient } from 'pg';
import type { CreateDoctorInput, Doctor } from '../../model/doctor';

type Queryable = Pool | PoolClient;

/**
 * Creates a doctor record.
 */
export const createDoctor = async (
  pool: Queryable,
  input: CreateDoctorInput,
): Promise<Doctor> => {
  console.log('💾 createDoctor');
  try {
    const result = await pool.query<Doctor>(
      `INSERT INTO doctors (
         name, hospital_id, specialty_id, notes, npi, phone, fax,
         source_system, source_document_id, source_entry_key
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        input.name,
        input.hospital_id,
        input.specialty_id,
        input.notes ?? null,
        input.npi ?? null,
        input.phone ?? null,
        input.fax ?? null,
        input.source_system ?? null,
        input.source_document_id ?? null,
        input.source_entry_key ?? null,
      ],
    );
    return result.rows[0];
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to create doctor: ${message}`);
  }
};
