import type { Pool } from 'pg';
import { updateResearchNoteById } from '../../data/research-notes/update-research-note-by-id';
import type { ResearchNote, UpdateResearchNoteInput } from '../../data/research-notes/types';
import {
  assertOptionalHealthRecordFks,
  isResearchNoteCategory,
} from '../../utils/health-record';

const optionalText = (value: string | null | undefined): string | null => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
};

const optionalId = (value: string | null | undefined): string | null => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
};

/**
 * Updates a research note by id after validating input.
 */
export const processUpdateResearchNoteById = async (
  pool: Pool,
  id: string,
  input: UpdateResearchNoteInput,
): Promise<ResearchNote> => {
  const normalized: UpdateResearchNoteInput = { ...input };

  if (input.title !== undefined) {
    const title = input.title.trim();
    if (!title) throw new Error('title cannot be empty');
    normalized.title = title;
  }
  if (input.category !== undefined && !isResearchNoteCategory(input.category)) {
    throw new Error('category is invalid');
  }
  if (input.source_url !== undefined) {
    normalized.source_url = optionalText(input.source_url);
  }
  if (input.summary !== undefined) {
    normalized.summary = optionalText(input.summary);
  }
  if (input.content !== undefined) {
    normalized.content = optionalText(input.content);
  }
  if (input.focus_area_id !== undefined) {
    normalized.focus_area_id = optionalId(input.focus_area_id);
  }

  await assertOptionalHealthRecordFks(pool, { focus_area_id: normalized.focus_area_id });

  return updateResearchNoteById(pool, id, normalized);
};
