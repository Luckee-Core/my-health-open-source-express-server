import type { Pool } from 'pg';
import { FEED_FORMULA_SELECT } from './select-columns';
import type { FeedFormula, UpdateFeedFormulaInput } from '../../model/feed-formula';

/**
 * Updates a feed formula by id.
 */
export const updateFeedFormulaById = async (
  pool: Pool,
  id: string,
  input: UpdateFeedFormulaInput,
): Promise<FeedFormula | null> => {
  const fields: string[] = [];
  const values: unknown[] = [];
  let index = 1;

  const setField = (column: string, value: unknown): void => {
    fields.push(`${column} = $${index}`);
    values.push(value);
    index += 1;
  };

  if (input.brand !== undefined) setField('brand', input.brand);
  if (input.name !== undefined) setField('name', input.name);
  if (input.calories_per_1000_ml !== undefined) {
    setField('calories_per_1000_ml', input.calories_per_1000_ml);
  }
  if (input.container_volume_ml !== undefined) {
    setField('container_volume_ml', input.container_volume_ml);
  }
  if (input.volume_fl_oz !== undefined) setField('volume_fl_oz', input.volume_fl_oz);
  if (input.volume_qt !== undefined) setField('volume_qt', input.volume_qt);
  if (input.volume_l !== undefined) setField('volume_l', input.volume_l);
  if (input.is_active !== undefined) setField('is_active', input.is_active);
  if (input.notes !== undefined) setField('notes', input.notes);

  if (fields.length === 0) {
    const existing = await pool.query<FeedFormula>(
      `SELECT ${FEED_FORMULA_SELECT} FROM feed_formulas WHERE id = $1`,
      [id],
    );
    return existing.rows[0] ?? null;
  }

  fields.push(`updated_at = now()`);
  values.push(id);

  const result = await pool.query<FeedFormula>(
    `UPDATE feed_formulas SET ${fields.join(', ')} WHERE id = $${index}
     RETURNING ${FEED_FORMULA_SELECT}`,
    values,
  );
  return result.rows[0] ?? null;
};
