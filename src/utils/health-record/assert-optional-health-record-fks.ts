import type { Pool } from 'pg';
import { assertAppointmentExists } from './assert-appointment-exists';
import { assertDoctorExists } from '../appointments/assert-doctor-exists';
import { assertFocusAreaExists } from '../daily-entries/assert-focus-area-exists';

type OptionalFkInput = {
  doctor_id?: string | null;
  appointment_id?: string | null;
  focus_area_id?: string | null;
};

/**
 * Validates optional foreign keys for health record entities.
 */
export const assertOptionalHealthRecordFks = async (
  pool: Pool,
  input: OptionalFkInput,
): Promise<void> => {
  const doctorId = input.doctor_id?.trim();
  if (doctorId) {
    await assertDoctorExists(pool, doctorId);
  }

  const appointmentId = input.appointment_id?.trim();
  if (appointmentId) {
    await assertAppointmentExists(pool, appointmentId);
  }

  const focusAreaId = input.focus_area_id?.trim();
  if (focusAreaId) {
    await assertFocusAreaExists(pool, focusAreaId);
  }
};
