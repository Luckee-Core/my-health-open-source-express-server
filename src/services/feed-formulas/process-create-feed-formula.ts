import type { Pool } from 'pg';
import { createFeedFormula } from '../../data/feed-formulas';
import type { CreateFeedFormulaInput, FeedFormula } from '../../model/feed-formula';
import { parseFiniteNumber, parseOptionalFiniteNumber } from '../../utils/number';

const optionalText = (value: string | null | undefined): string | null => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
};

/**
 * Creates a feed formula after validating input.
 */
export const processCreateFeedFormula = async (
  pool: Pool,
  input: CreateFeedFormulaInput,
): Promise<FeedFormula> => {
  if (!input.brand?.trim()) throw new Error('brand is required');
  if (!input.name?.trim()) throw new Error('name is required');

  const calories = parseFiniteNumber(input.calories_per_1000_ml, 'calories_per_1000_ml');
  if (calories <= 0) throw new Error('calories_per_1000_ml must be greater than 0');

  const containerVolume =
    input.container_volume_ml === undefined
      ? 1000
      : parseFiniteNumber(input.container_volume_ml, 'container_volume_ml');
  if (containerVolume <= 0) throw new Error('container_volume_ml must be greater than 0');

  const volumeFlOz = parseOptionalFiniteNumber(input.volume_fl_oz, 'volume_fl_oz');
  const volumeQt = parseOptionalFiniteNumber(input.volume_qt, 'volume_qt');
  const volumeL = parseOptionalFiniteNumber(input.volume_l, 'volume_l');
  if (volumeFlOz !== null && volumeFlOz <= 0) throw new Error('volume_fl_oz must be greater than 0');
  if (volumeQt !== null && volumeQt <= 0) throw new Error('volume_qt must be greater than 0');
  if (volumeL !== null && volumeL <= 0) throw new Error('volume_l must be greater than 0');

  return createFeedFormula(pool, {
    brand: input.brand.trim(),
    name: input.name.trim(),
    calories_per_1000_ml: calories,
    container_volume_ml: containerVolume,
    volume_fl_oz: volumeFlOz,
    volume_qt: volumeQt,
    volume_l: volumeL,
    is_active: input.is_active ?? true,
    notes: optionalText(input.notes),
  });
};
