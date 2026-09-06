export type TherapyExerciseLog = {
  id: string;
  exercise_id: string;
  log_date: string;
  completed_count: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type IncrementTherapyExerciseLogInput = {
  exercise_id: string;
  log_date: string;
  delta: number;
};
