import type { Pool } from 'pg';
import { createTherapyExercise } from '../../data/therapy-exercises';
import type {
  CreateTherapyExerciseInput,
  TherapyExercise,
} from '../../model/therapy-exercise';
import { parseFrequency, parseTrackingKind } from '../../utils/therapy-exercises';

const optionalText = (value: string | null | undefined): string | null => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
};

/**
 * Creates a therapy exercise after validating input.
 */
export const processCreateTherapyExercise = async (
  pool: Pool,
  input: CreateTherapyExerciseInput,
): Promise<TherapyExercise> => {
  if (!input.name?.trim()) throw new Error('name is required');
  if (!input.tracking_kind) throw new Error('tracking_kind is required');
  if (!Number.isFinite(input.target_count) || input.target_count < 1) {
    throw new Error('target_count must be at least 1');
  }

  const trackingKind = parseTrackingKind(input.tracking_kind);
  const frequency = parseFrequency(input.frequency ?? 'daily');
  const unitSize = input.unit_size ?? 1;
  if (!Number.isFinite(unitSize) || unitSize < 1) {
    throw new Error('unit_size must be at least 1');
  }

  return createTherapyExercise(pool, {
    discipline: input.discipline ?? 'speech',
    name: input.name.trim(),
    instructions: optionalText(input.instructions),
    tracking_kind: trackingKind,
    target_count: input.target_count,
    unit_size: unitSize,
    frequency,
    is_active: input.is_active ?? true,
    sort_order: input.sort_order ?? 0,
    source: input.source ?? 'manual',
    import_id: input.import_id ?? null,
  });
};
