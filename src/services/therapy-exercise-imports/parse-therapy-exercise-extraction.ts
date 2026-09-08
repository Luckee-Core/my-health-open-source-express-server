import type { TherapyExerciseImportDraftExercise } from '../../model/therapy-exercise-import';
export const THERAPY_EXERCISE_IMPORT_VISION_MODEL = 'claude-haiku-4-5-20251001';

export const THERAPY_EXERCISE_IMPORT_SYSTEM_PROMPT = `You extract speech-therapy HOMEWORK from a photo of a printed worksheet.

LAYOUT (critical):
- These sheets are two-column. HOMEWORK is the LEFT text column: titled exercise sections with how-to steps and "Do ___ reps ___ times per day".
- IGNORE the entire RIGHT side: anatomical diagrams, leader lines, and labels such as Soft palate, Tongue, Pharynx, Epiglottis, Larynx, Esophagus, Airway.
- IGNORE page numbers, headers like "Page 2 of 2", accessibility/footer text, and figure captions.

WHAT COUNTS AS AN EXERCISE:
- A named block with a procedure (what the patient physically does).
- Typical titles on these sheets: Tongue hold (Masako), Shaker, Epiglottic control, Yawning, Effortful swallow, Mendelsohn, Resistive tongue exercise.
- Prefer handwritten numbers over printed blanks. If a range is written (e.g. 2-3), use the first number.
- Skip a block if it is only an anatomy label with no "do this" steps.

Return ONLY valid JSON:
{
  "exercises": [
    {
      "name": "short exercise name",
      "instructions": "full how-to text including frequency, or null",
      "tracking_kind": "timed_attempts" or "sets_reps",
      "target_count": number,
      "unit_size": number
    }
  ]
}

TRACKING:
- timed_attempts: holds with a duration. unit_size = seconds per hold (1 minute = 60). target_count = how many holds to log today (reps × times per day when both appear).
- sets_reps: no hold duration. unit_size = reps per session. target_count = times per day (if missing, use reps as target_count and unit_size = 1).
- Positive integers only.
- If frequency blanks are empty, still include the exercise; put that in instructions and use 1 for missing counts.`;

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

type ExtractedDraft = {
  exercises: TherapyExerciseImportDraftExercise[];
};

const isValidExercise = (value: unknown): value is TherapyExerciseImportDraftExercise => {
  if (!value || typeof value !== 'object') return false;
  const row = value as TherapyExerciseImportDraftExercise;
  if (!row.name?.trim()) return false;
  if (row.tracking_kind !== 'timed_attempts' && row.tracking_kind !== 'sets_reps') return false;
  if (!Number.isFinite(row.target_count) || row.target_count < 1) return false;
  if (!Number.isFinite(row.unit_size) || row.unit_size < 1) return false;
  return true;
};

/**
 * Validates uploaded image mime type for therapy import.
 */
export const validateTherapyImportMimeType = (mimeType: string): void => {
  if (!ALLOWED_MIME_TYPES.has(mimeType)) {
    throw new Error('Unsupported image type. Use JPEG, PNG, or WebP (HEIC is not supported).');
  }
};

/**
 * Parses vision JSON into therapy exercise draft rows.
 */
export const parseTherapyExerciseExtractionResponse = (text: string): ExtractedDraft => {
  const trimmed = text.trim();
  const jsonStart = trimmed.indexOf('{');
  const jsonEnd = trimmed.lastIndexOf('}');
  if (jsonStart < 0 || jsonEnd < 0) {
    throw new Error('AI response did not contain JSON');
  }
  const parsed = JSON.parse(trimmed.slice(jsonStart, jsonEnd + 1)) as { exercises?: unknown[] };
  if (!Array.isArray(parsed.exercises)) {
    throw new Error('AI response missing exercises array');
  }
  const exercises = parsed.exercises.filter(isValidExercise).map((row) => ({
    name: row.name.trim(),
    instructions: row.instructions?.trim() ? row.instructions.trim() : null,
    tracking_kind: row.tracking_kind,
    target_count: Math.floor(row.target_count),
    unit_size: Math.floor(row.unit_size),
  }));
  if (exercises.length === 0) {
    throw new Error('No valid exercises extracted from photo');
  }
  return { exercises };
};
