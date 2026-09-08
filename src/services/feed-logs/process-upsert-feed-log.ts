import type { Pool } from 'pg';
import { getStartFeedLog, upsertFeedLogByDate } from '../../data/feed-logs';
import type { FeedLog, UpsertFeedLogInput } from '../../model/feed-log';
import { requireFeedFormula } from '../../utils/feed-formulas';
import { parseFeedLogDate } from '../../utils/feed-logs';
import { parseFiniteNumber } from '../../utils/number';

const optionalText = (value: string | null | undefined): string | null => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
};

/**
 * Upserts a morning feed snapshot, copying calorie density from the formula.
 */
export const processUpsertFeedLog = async (
  pool: Pool,
  input: UpsertFeedLogInput,
): Promise<FeedLog> => {
  if (!input.formula_id?.trim()) throw new Error('formula_id is required');
  if (!input.log_date?.trim()) throw new Error('log_date is required');

  const logDate = parseFeedLogDate(input.log_date);
  const formula = await requireFeedFormula(pool, input.formula_id.trim());

  const feedLeft = parseFiniteNumber(input.feed_left_ml, 'feed_left_ml');
  if (feedLeft < 0) throw new Error('feed_left_ml must be at least 0');

  const totalFed = parseFiniteNumber(input.total_fed_ml, 'total_fed_ml');
  if (totalFed < 0) throw new Error('total_fed_ml must be at least 0');

  const rate =
    input.intermittent_rate_ml_per_hr === undefined
      ? 50
      : parseFiniteNumber(input.intermittent_rate_ml_per_hr, 'intermittent_rate_ml_per_hr');
  if (rate <= 0) throw new Error('intermittent_rate_ml_per_hr must be greater than 0');

  const isStart = input.is_start === true;
  if (isStart) {
    const existingStart = await getStartFeedLog(pool);
    if (existingStart && existingStart.log_date !== logDate) {
      throw new Error('A starting point already exists');
    }
  }

  return upsertFeedLogByDate(pool, {
    log_date: logDate,
    formula_id: formula.id,
    intermittent_rate_ml_per_hr: rate,
    feed_left_ml: feedLeft,
    total_fed_ml: totalFed,
    pump_reset: isStart ? false : (input.pump_reset ?? false),
    is_start: isStart,
    calories_per_1000_ml: formula.calories_per_1000_ml,
    notes: optionalText(input.notes),
  });
};
