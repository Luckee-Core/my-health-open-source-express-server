export type TherapyExerciseImportAiExchangeStatus = 'pending' | 'completed' | 'failed';

export type TherapyExerciseImportAiExchange = {
  id: string;
  request_id: string;
  response_id: string | null;
  import_id: string | null;
  input_tokens: number | null;
  output_tokens: number | null;
  total_tokens: number | null;
  model_used: string | null;
  status: TherapyExerciseImportAiExchangeStatus;
  error_message: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateTherapyExerciseImportAiExchangeInput = {
  request_id: string;
  model_used: string;
};

export type UpdateTherapyExerciseImportAiExchangeInput = {
  response_id?: string | null;
  import_id?: string | null;
  input_tokens?: number | null;
  output_tokens?: number | null;
  total_tokens?: number | null;
  model_used?: string | null;
  status?: TherapyExerciseImportAiExchangeStatus;
  error_message?: string | null;
};
