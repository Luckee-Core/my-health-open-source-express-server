import type { Pool } from 'pg';
import { createResearchNote } from '../../data/research-notes/create-research-note';
import type { CreateResearchNoteInput, ResearchNote } from '../../data/research-notes/types';
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
 * Creates a research note after validating input and foreign keys.
 */
export const processCreateResearchNote = async (
  pool: Pool,
  input: CreateResearchNoteInput,
): Promise<ResearchNote> => {
  const title = input.title?.trim() ?? '';
  if (!title) throw new Error('title is required');

  const category = input.category ?? 'other';
  if (!isResearchNoteCategory(category)) {
    throw new Error('category is invalid');
  }

  await assertOptionalHealthRecordFks(pool, { focus_area_id: input.focus_area_id });

  return createResearchNote(pool, {
    title,
    category,
    source_url: optionalText(input.source_url),
    summary: optionalText(input.summary),
    content: optionalText(input.content),
    focus_area_id: optionalId(input.focus_area_id),
  });
};
