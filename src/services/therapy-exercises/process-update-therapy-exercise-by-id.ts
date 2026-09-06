import type { Pool } from 'pg';
import {
  getTherapyExerciseById,
  updateTherapyExerciseById,
} from '../../data/therapy-exercises';
import type {
  TherapyExercise,
  UpdateTherapyExerciseInput,
} from '../../data/therapy-exercises';
import { parseTrackingKind } from '../../utils/therapy-exercises';

const optionalText = (value: string | null | undefined): string | null => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
};

/**
 * Updates a therapy exercise by id.
 */
export const processUpdateTherapyExerciseById = async (
  pool: Pool,
  id: string,
  input: UpdateTherapyExerciseInput,
): Promise<TherapyExercise> => {
  const existing = await getTherapyExerciseById(pool, id);
  if (!existing) {
    throw new Error('Therapy exercise not found');
  }

  const patch: UpdateTherapyExerciseInput = { ...input };
  if (patch.name !== undefined && !patch.name.trim()) {
    throw new Error('name cannot be empty');
  }
  if (patch.tracking_kind !== undefined) {
    patch.tracking_kind = parseTrackingKind(patch.tracking_kind);
  }
  if (patch.target_count !== undefined && patch.target_count < 1) {
    throw new Error('target_count must be at least 1');
  }
  if (patch.unit_size !== undefined && patch.unit_size < 1) {
    throw new Error('unit_size must be at least 1');
  }
  if (patch.name !== undefined) patch.name = patch.name.trim();
  if (patch.instructions !== undefined) patch.instructions = optionalText(patch.instructions);

  const updated = await updateTherapyExerciseById(pool, id, patch);
  if (!updated) {
    throw new Error('Therapy exercise not found');
  }
  return updated;
};
