import type { Pool } from 'pg';
import {
  deleteMedicationDoseSchedule,
  upsertMedicationDoseSchedule,
} from '../../data/medication-dose-schedules';
import {
  formatDoseIntervalMinutes,
  parseDoseIntervalMinutes,
} from '../../utils/medications/parse-dose-interval-minutes';

/**
 * Creates, updates, or removes a dose schedule based on medication instructions.
 */
export const syncMedicationDoseScheduleFromInstructions = async (
  pool: Pool,
  medicationId: string,
  instructions: string | null | undefined,
  status: 'active' | 'stopped',
): Promise<void> => {
  if (status !== 'active') {
    await deleteMedicationDoseSchedule(pool, medicationId);
    return;
  }

  const intervalMinutes = parseDoseIntervalMinutes(instructions);
  if (intervalMinutes == null) {
    await deleteMedicationDoseSchedule(pool, medicationId);
    return;
  }

  console.log(
    `✅ Dose schedule for ${medicationId}: ${formatDoseIntervalMinutes(intervalMinutes)}`,
  );
  await upsertMedicationDoseSchedule(pool, medicationId, {
    interval_minutes: intervalMinutes,
    reminder_enabled: true,
  });
};

/**
 * Syncs dose schedules for all active medications from their instructions text.
 */
export const syncAllMedicationDoseSchedules = async (pool: Pool): Promise<void> => {
  const result = await pool.query<{
    id: string;
    instructions: string | null;
    status: 'active' | 'stopped';
  }>(`SELECT id, instructions, status FROM medications`);

  for (const row of result.rows) {
    await syncMedicationDoseScheduleFromInstructions(
      pool,
      row.id,
      row.instructions,
      row.status,
    );
  }
};
