export type TherapyExerciseTrackingKind = 'timed_attempts' | 'sets_reps';
export type TherapyExerciseDiscipline = 'speech';
export type TherapyExerciseSource = 'manual' | 'photo_import';
export type TherapyExerciseFrequency = 'daily' | 'session';

export type TherapyExercise = {
  id: string;
  discipline: TherapyExerciseDiscipline;
  name: string;
  instructions: string | null;
  tracking_kind: TherapyExerciseTrackingKind;
  target_count: number;
  unit_size: number;
  frequency: TherapyExerciseFrequency;
  is_active: boolean;
  sort_order: number;
  source: TherapyExerciseSource;
  import_id: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateTherapyExerciseInput = {
  discipline?: TherapyExerciseDiscipline;
  name: string;
  instructions?: string | null;
  tracking_kind: TherapyExerciseTrackingKind;
  target_count: number;
  unit_size?: number;
  frequency?: TherapyExerciseFrequency;
  is_active?: boolean;
  sort_order?: number;
  source?: TherapyExerciseSource;
  import_id?: string | null;
};

export type UpdateTherapyExerciseInput = Partial<CreateTherapyExerciseInput>;
