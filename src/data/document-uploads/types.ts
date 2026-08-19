export type DocumentUploadStatus =
  | 'pending'
  | 'processing'
  | 'review'
  | 'committed'
  | 'failed'
  | 'duplicate_rejected';

export type IngestKind = 'file' | 'paste' | 'photo' | 'ccd_zip';

export type DocumentUpload = {
  id: string;
  source_instance_id: string | null;
  ingest_kind: IngestKind;
  report_type: string;
  original_filename: string | null;
  content_sha256: string;
  report_date: string | null;
  provider_name: string | null;
  storage_path: string | null;
  status: DocumentUploadStatus;
  created_at: string;
  updated_at: string;
};

export type CreateDocumentUploadInput = {
  source_instance_id?: string | null;
  ingest_kind: IngestKind;
  report_type: string;
  original_filename?: string | null;
  content_sha256: string;
  report_date?: string | null;
  provider_name?: string | null;
  storage_path?: string | null;
  status?: DocumentUploadStatus;
};
