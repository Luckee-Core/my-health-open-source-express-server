export type FeedLog = {
  id: string;
  log_date: string;
  formula_id: string;
  intermittent_rate_ml_per_hr: number;
  feed_left_ml: number;
  total_fed_ml: number;
  pump_reset: boolean;
  is_start: boolean;
  calories_per_1000_ml: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type UpsertFeedLogInput = {
  log_date: string;
  formula_id: string;
  intermittent_rate_ml_per_hr?: number;
  feed_left_ml: number;
  total_fed_ml: number;
  pump_reset?: boolean;
  notes?: string | null;
};
