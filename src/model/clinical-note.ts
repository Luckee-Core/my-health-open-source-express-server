export type ClinicalNote = {
  id: string;
  note_at: string;
  title: string;
  author_name: string | null;
  body: string;
  appointment_id: string | null;
  doctor_id: string | null;
  source_system: string | null;
  source_document_id: string | null;
  source_entry_key: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateClinicalNoteInput = {
  note_at: string;
  title: string;
  author_name?: string | null;
  body: string;
  appointment_id?: string | null;
  doctor_id?: string | null;
  source_system?: string | null;
  source_document_id?: string | null;
  source_entry_key?: string | null;
};

export type UpdateClinicalNoteInput = Partial<CreateClinicalNoteInput>;
