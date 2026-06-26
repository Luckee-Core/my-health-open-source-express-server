export type ResearchNoteCategory =
  | 'imaging'
  | 'article'
  | 'doctor_prep'
  | 'personal'
  | 'other';

export type ResearchNote = {
  id: string;
  title: string;
  category: ResearchNoteCategory;
  source_url: string | null;
  summary: string | null;
  content: string | null;
  focus_area_id: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateResearchNoteInput = {
  title: string;
  category?: ResearchNoteCategory;
  source_url?: string | null;
  summary?: string | null;
  content?: string | null;
  focus_area_id?: string | null;
};

export type UpdateResearchNoteInput = Partial<CreateResearchNoteInput>;
