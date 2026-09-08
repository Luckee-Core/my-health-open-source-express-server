export type TherapyExerciseImportStatus = 'previewed' | 'committed';

export type TherapyExerciseImportDraftExercise = {
  name: string;
  instructions: string | null;
  tracking_kind: 'timed_attempts' | 'sets_reps';
  target_count: number;
  unit_size: number;
};

export type TherapyExerciseImportDraft = {
  exercises: TherapyExerciseImportDraftExercise[];
};

export type TherapyExerciseImport = {
  id: string;
  status: TherapyExerciseImportStatus;
  draft_json: TherapyExerciseImportDraft;
  exchange_id: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateTherapyExerciseImportInput = {
  status: TherapyExerciseImportStatus;
  draft_json: TherapyExerciseImportDraft;
};
