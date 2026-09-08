export type TherapyExerciseImportAiRequestStatus = 'pending' | 'completed' | 'failed';

export type TherapyExerciseImportAiRequest = {
  id: string;
  import_id: string | null;
  provider: string;
  model: string;
  mime_type: string | null;
  filename: string | null;
  system_prompt: string;
  status: TherapyExerciseImportAiRequestStatus;
  exchange_id: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateTherapyExerciseImportAiRequestInput = {
  model: string;
  mime_type?: string | null;
  filename?: string | null;
  system_prompt: string;
  provider?: string;
};

export type UpdateTherapyExerciseImportAiRequestInput = {
  status?: TherapyExerciseImportAiRequestStatus;
  exchange_id?: string | null;
  import_id?: string | null;
};
