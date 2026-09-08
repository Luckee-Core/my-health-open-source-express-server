import type { ResearchNoteCategory } from '../../model/research-note';

const RESEARCH_NOTE_CATEGORIES: ResearchNoteCategory[] = [
  'imaging',
  'article',
  'doctor_prep',
  'personal',
  'other',
];

/**
 * Returns true when value is a valid research note category.
 */
export const isResearchNoteCategory = (value: string): value is ResearchNoteCategory =>
  RESEARCH_NOTE_CATEGORIES.includes(value as ResearchNoteCategory);
