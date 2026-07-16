export type HealthImportStatus = 'previewed' | 'committed' | 'failed';

export type HealthImport = {
  id: string;
  filename: string;
  content_sha256: string;
  status: HealthImportStatus;
  document_count: number;
  summary_json: Record<string, unknown> | null;
  error: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateHealthImportInput = {
  filename: string;
  content_sha256: string;
  status?: HealthImportStatus;
  document_count?: number;
  summary_json?: Record<string, unknown> | null;
  error?: string | null;
};

export type UpdateHealthImportInput = {
  status?: HealthImportStatus;
  document_count?: number;
  summary_json?: Record<string, unknown> | null;
  error?: string | null;
};
