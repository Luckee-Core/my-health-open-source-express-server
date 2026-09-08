import type { Pool } from 'pg';
import { getFeedFormulaById, updateFeedFormulaById } from '../../data/feed-formulas';
import type { FeedFormula, UpdateFeedFormulaInput } from '../../model/feed-formula';
import { parseFiniteNumber, parseOptionalFiniteNumber } from '../../utils/number';

const optionalText = (value: string | null | undefined): string | null => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
};

/**
 * Updates a feed formula by id.
 */
export const processUpdateFeedFormulaById = async (
  pool: Pool,
  id: string,
  input: UpdateFeedFormulaInput,
): Promise<FeedFormula> => {
  const existing = await getFeedFormulaById(pool, id);
  if (!existing) {
    throw new Error('Feed formula not found');
  }

  const patch: UpdateFeedFormulaInput = { ...input };
  if (patch.brand !== undefined) {
    if (!patch.brand.trim()) throw new Error('brand cannot be empty');
    patch.brand = patch.brand.trim();
  }
  if (patch.name !== undefined) {
    if (!patch.name.trim()) throw new Error('name cannot be empty');
    patch.name = patch.name.trim();
  }
  if (patch.calories_per_1000_ml !== undefined) {
    const calories = parseFiniteNumber(patch.calories_per_1000_ml, 'calories_per_1000_ml');
    if (calories <= 0) throw new Error('calories_per_1000_ml must be greater than 0');
    patch.calories_per_1000_ml = calories;
  }
  if (patch.container_volume_ml !== undefined) {
    const containerVolume = parseFiniteNumber(
      patch.container_volume_ml,
      'container_volume_ml',
    );
    if (containerVolume <= 0) throw new Error('container_volume_ml must be greater than 0');
    patch.container_volume_ml = containerVolume;
  }
  if (patch.volume_fl_oz !== undefined) {
    const volumeFlOz = parseOptionalFiniteNumber(patch.volume_fl_oz, 'volume_fl_oz');
    if (volumeFlOz !== null && volumeFlOz <= 0) {
      throw new Error('volume_fl_oz must be greater than 0');
    }
    patch.volume_fl_oz = volumeFlOz;
  }
  if (patch.volume_qt !== undefined) {
    const volumeQt = parseOptionalFiniteNumber(patch.volume_qt, 'volume_qt');
    if (volumeQt !== null && volumeQt <= 0) {
      throw new Error('volume_qt must be greater than 0');
    }
    patch.volume_qt = volumeQt;
  }
  if (patch.volume_l !== undefined) {
    const volumeL = parseOptionalFiniteNumber(patch.volume_l, 'volume_l');
    if (volumeL !== null && volumeL <= 0) {
      throw new Error('volume_l must be greater than 0');
    }
    patch.volume_l = volumeL;
  }
  if (patch.notes !== undefined) patch.notes = optionalText(patch.notes);

  const updated = await updateFeedFormulaById(pool, id, patch);
  if (!updated) {
    throw new Error('Feed formula not found');
  }
  return updated;
};
