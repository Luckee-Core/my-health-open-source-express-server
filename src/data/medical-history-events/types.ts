export type MedicalHistoryCategory =
  | 'diagnosis'
  | 'surgery'
  | 'radiation'
  | 'imaging'
  | 'milestone'
  | 'other';

export type MedicalHistoryEvent = {
  id: string;
  event_date: string;
  title: string;
  category: MedicalHistoryCategory;
  description: string | null;
  doctor_id: string | null;
  appointment_id: string | null;
  focus_area_id: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateMedicalHistoryEventInput = {
  event_date: string;
  title: string;
  category?: MedicalHistoryCategory;
  description?: string | null;
  doctor_id?: string | null;
  appointment_id?: string | null;
  focus_area_id?: string | null;
};

export type UpdateMedicalHistoryEventInput = Partial<CreateMedicalHistoryEventInput>;
