export const FEED_LOG_SELECT = `
  id,
  to_char(log_date, 'YYYY-MM-DD') AS log_date,
  formula_id,
  intermittent_rate_ml_per_hr::float8 AS intermittent_rate_ml_per_hr,
  feed_left_ml::float8 AS feed_left_ml,
  total_fed_ml::float8 AS total_fed_ml,
  pump_reset,
  is_start,
  calories_per_1000_ml::float8 AS calories_per_1000_ml,
  notes,
  created_at,
  updated_at
`;
