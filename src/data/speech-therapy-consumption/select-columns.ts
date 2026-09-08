export const SPEECH_THERAPY_CONSUMPTION_SELECT = `
  id,
  consumption_type,
  to_char(log_date, 'YYYY-MM-DD') AS log_date,
  quantity,
  created_at,
  updated_at
`;
