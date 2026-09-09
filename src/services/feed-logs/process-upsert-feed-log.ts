import type { Pool } from 'pg';
import { getStartFeedLog, insertStartFeedLog, upsertFeedLogByDate } from '../../data/feed-logs';
import type { FeedLog, UpsertFeedLogInput } from '../../model/feed-log';
import { requireFeedFormula } from '../../utils/feed-formulas';
import { parseFeedLogDate } from '../../utils/feed-logs';
import { parseFiniteNumber } from '../../utils/number';

const optionalText = (value: string | null | undefined): string | null => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
};

/**
 * Saves the one-time start snapshot or upserts a morning snapshot.
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

  const existingStart = await getStartFeedLog(pool);
  const notes = optionalText(input.notes);
  const wantsStart = input.is_start === true;

  if (wantsStart) {
    if (existingStart) {
      throw new Error('A starting point already exists');
    }
    return insertStartFeedLog(pool, {
      log_date: logDate,
      formula_id: formula.id,
      intermittent_rate_ml_per_hr: rate,
      feed_left_ml: feedLeft,
      total_fed_ml: totalFed,
      calories_per_1000_ml: formula.calories_per_1000_ml,
      notes,
    });
  }

  if (!existingStart) {
    throw new Error('A starting point is required before logging mornings');
  }

  return upsertFeedLogByDate(pool, {
    log_date: logDate,
    formula_id: formula.id,
    intermittent_rate_ml_per_hr: rate,
    feed_left_ml: feedLeft,
    total_fed_ml: totalFed,
    pump_reset: input.pump_reset ?? false,
    calories_per_1000_ml: formula.calories_per_1000_ml,
    notes,
  });
};
