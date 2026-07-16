import type { Pool, PoolClient } from 'pg';
import type { CreateMedicalHistoryEventInput, MedicalHistoryEvent } from './types';

type Queryable = Pool | PoolClient;

/**
 * Upserts a medical history event by (source_system, source_entry_key).
 */
export const upsertMedicalHistoryEventBySourceKey = async (
  pool: Queryable,
  input: CreateMedicalHistoryEventInput,
): Promise<MedicalHistoryEvent> => {
  console.log('💾 upsertMedicalHistoryEventBySourceKey');
  if (!input.source_system || !input.source_entry_key) {
    throw new Error('source_system and source_entry_key are required for upsert');
  }
  try {
    const result = await pool.query<MedicalHistoryEvent>(
      `INSERT INTO medical_history_events (
         event_date, title, category, description,
         doctor_id, appointment_id, focus_area_id,
         source_system, source_document_id, source_entry_key
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       ON CONFLICT (source_system, source_entry_key)
       DO UPDATE SET
         event_date = EXCLUDED.event_date,
         title = EXCLUDED.title,
         category = EXCLUDED.category,
         description = EXCLUDED.description,
         doctor_id = EXCLUDED.doctor_id,
         appointment_id = EXCLUDED.appointment_id,
         focus_area_id = EXCLUDED.focus_area_id,
         source_document_id = EXCLUDED.source_document_id,
         updated_at = now()
       RETURNING *`,
      [
        input.event_date,
        input.title,
        input.category ?? 'other',
        input.description ?? null,
        input.doctor_id ?? null,
        input.appointment_id ?? null,
        input.focus_area_id ?? null,
        input.source_system,
        input.source_document_id ?? null,
        input.source_entry_key,
      ],
    );
    return result.rows[0];
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to upsert MedicalHistoryEvent: ${message}`);
  }
};
