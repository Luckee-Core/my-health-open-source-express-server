export type TherapyExerciseLog = {
  id: string;
  exercise_id: string;
  log_date: string;
  completed_count: number;
  skipped: boolean;
  due: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type IncrementTherapyExerciseLogInput = {
  exercise_id: string;
  log_date: string;
  delta: number;
};

export type SkipTherapyExerciseLogInput = {
  exercise_id: string;
  log_date: string;
  skipped: boolean;
};

export type SetTherapyExerciseLogDueInput = {
  exercise_id: string;
  log_date: string;
  due: boolean;
};
