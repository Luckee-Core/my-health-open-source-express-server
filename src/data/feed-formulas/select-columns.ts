export const FEED_FORMULA_SELECT = `
  id,
  brand,
  name,
  calories_per_1000_ml::float8 AS calories_per_1000_ml,
  container_volume_ml::float8 AS container_volume_ml,
  volume_fl_oz::float8 AS volume_fl_oz,
  volume_qt::float8 AS volume_qt,
  volume_l::float8 AS volume_l,
  is_active,
  notes,
  created_at,
  updated_at
`;
