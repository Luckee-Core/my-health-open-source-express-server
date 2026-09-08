import type { Pool, PoolClient } from 'pg';
import type { Appointment, CreateAppointmentInput } from '../../model/appointment';

type Queryable = Pool | PoolClient;

/**
 * Upserts an appointment by (source_system, source_entry_key).
 */
export const upsertAppointmentBySourceKey = async (
  pool: Queryable,
  input: CreateAppointmentInput,
): Promise<Appointment> => {
  console.log('💾 upsertAppointmentBySourceKey');
  if (!input.source_system || !input.source_entry_key) {
    throw new Error('source_system and source_entry_key are required for upsert');
  }
  try {
    const result = await pool.query<Appointment>(
      `INSERT INTO appointments (
         doctor_id, scheduled_at, status, appointment_type, reason, notes, completed_at,
         source_system, source_document_id, source_entry_key
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       ON CONFLICT (source_system, source_entry_key)
       DO UPDATE SET
         doctor_id = EXCLUDED.doctor_id,
         scheduled_at = EXCLUDED.scheduled_at,
         status = EXCLUDED.status,
         appointment_type = EXCLUDED.appointment_type,
         reason = EXCLUDED.reason,
         notes = EXCLUDED.notes,
         completed_at = EXCLUDED.completed_at,
         source_document_id = EXCLUDED.source_document_id,
         updated_at = now()
       RETURNING *`,
      [
        input.doctor_id,
        input.scheduled_at,
        input.status ?? 'scheduled',
        input.appointment_type ?? null,
        input.reason ?? null,
        input.notes ?? null,
        input.completed_at ?? null,
        input.source_system,
        input.source_document_id ?? null,
        input.source_entry_key,
      ],
    );
    return result.rows[0];
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to upsert Appointment: ${message}`);
  }
};
