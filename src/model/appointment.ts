export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled';

export type Appointment = {
  id: string;
  doctor_id: string;
  scheduled_at: string;
  status: AppointmentStatus;
  appointment_type: string | null;
  reason: string | null;
  notes: string | null;
  completed_at: string | null;
  source_system: string | null;
  source_document_id: string | null;
  source_entry_key: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateAppointmentInput = {
  doctor_id: string;
  scheduled_at: string;
  status?: AppointmentStatus;
  appointment_type?: string | null;
  reason?: string | null;
  notes?: string | null;
  completed_at?: string | null;
  source_system?: string | null;
  source_document_id?: string | null;
  source_entry_key?: string | null;
};

export type UpdateAppointmentInput = Partial<CreateAppointmentInput>;
