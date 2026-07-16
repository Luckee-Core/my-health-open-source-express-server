import type { Pool } from 'pg';
import {
  createHealthImport,
  upsertHealthImportDraft,
} from '../../data/health-imports';
import { parseCcdaPackage } from './parse';
import type { HealthImportSummary } from './types';

export type PreviewHealthImportInput = {
  filename: string;
  buffer: Buffer;
};

export type PreviewHealthImportResult = {
  previewId: string;
  contentSha256: string;
  filename: string;
  documentCount: number;
  summary: HealthImportSummary;
};

/**
 * Parses an uploaded Health Summary package and persists a preview + full draft.
 */
export const processPreviewHealthImport = async (
  pool: Pool,
  input: PreviewHealthImportInput,
): Promise<PreviewHealthImportResult> => {
  console.log(`🚀 processPreviewHealthImport: ${input.filename}`);
  const parsed = parseCcdaPackage(input.buffer);

  const created = await createHealthImport(pool, {
    filename: input.filename,
    content_sha256: parsed.contentSha256,
    status: 'previewed',
    document_count: parsed.documentCount,
    summary_json: parsed.summary as unknown as Record<string, unknown>,
  });

  await upsertHealthImportDraft(pool, created.id, parsed.fullDraft);

  console.log(`✅ processPreviewHealthImport: ${created.id}`);
  return {
    previewId: created.id,
    contentSha256: parsed.contentSha256,
    filename: input.filename,
    documentCount: parsed.documentCount,
    summary: parsed.summary,
  };
};
