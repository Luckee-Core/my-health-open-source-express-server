import type { Pool } from 'pg';
import { syncAllMedicationDoseSchedules } from '../../services/medications/sync-medication-dose-schedule';

export type MedicationDoseReminderStatus = 'due' | 'waiting';

export type MedicationDoseReminder = {
  medication_id: string;
  medication_name: string;
  interval_minutes: number;
  last_taken_at: string | null;
  next_dose_at: string | null;
  status: MedicationDoseReminderStatus;
  minutes_until_due: number;
};

type ReminderRow = {
  medication_id: string;
  medication_name: string;
  interval_minutes: number;
  last_taken_at: string | null;
};

/**
 * Lists active medications with dose schedules and computed due/waiting state.
 */
export const listMedicationDoseReminders = async (
  pool: Pool,
): Promise<MedicationDoseReminder[]> => {
  await syncAllMedicationDoseSchedules(pool);

  const result = await pool.query<ReminderRow>(
    `SELECT
       m.id AS medication_id,
       m.name AS medication_name,
       s.interval_minutes,
       latest.taken_at AS last_taken_at
     FROM medications m
     INNER JOIN medication_dose_schedules s ON s.medication_id = m.id
     LEFT JOIN LATERAL (
       SELECT taken_at
       FROM medication_dose_logs
       WHERE medication_id = m.id
       ORDER BY taken_at DESC
       LIMIT 1
     ) latest ON true
     WHERE m.status = 'active' AND s.reminder_enabled = true
     ORDER BY m.name ASC`,
  );

  const now = Date.now();

  return result.rows.map((row) => {
    const intervalMs = row.interval_minutes * 60_000;
    const lastTakenMs = row.last_taken_at ? new Date(row.last_taken_at).getTime() : null;
    const nextDoseMs = lastTakenMs == null ? now : lastTakenMs + intervalMs;
    const due = now >= nextDoseMs;
    const minutesUntilDue = due ? 0 : Math.ceil((nextDoseMs - now) / 60_000);

    return {
      medication_id: row.medication_id,
      medication_name: row.medication_name,
      interval_minutes: row.interval_minutes,
      last_taken_at: row.last_taken_at,
      next_dose_at: lastTakenMs == null ? null : new Date(nextDoseMs).toISOString(),
      status: due ? 'due' : 'waiting',
      minutes_until_due: minutesUntilDue,
    };
  });
};
