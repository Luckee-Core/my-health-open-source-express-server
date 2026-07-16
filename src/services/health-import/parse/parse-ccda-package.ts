import { createHash } from 'crypto';
import { buildImportDraft } from './build-import-draft';
import { parseCcdaDocument } from './parse-ccda-document';
import { unzipHealthSummary } from './unzip-health-summary';
import type { ParseCcdaPackageResult } from '../types';

/**
 * Unzips (or accepts raw XML), parses each C-CDA DOC, merges into one draft + summary.
 */
export const parseCcdaPackage = (buffer: Buffer): ParseCcdaPackageResult => {
  console.log('🚀 parseCcdaPackage');
  const contentSha256 = createHash('sha256').update(buffer).digest('hex');
  const documents = unzipHealthSummary(buffer);
  const drafts = documents.map((doc) => parseCcdaDocument(doc.xml, doc.name).draft);
  const { fullDraft, summary } = buildImportDraft(drafts);
  console.log(`✅ parseCcdaPackage: ${documents.length} docs, sha256=${contentSha256.slice(0, 12)}…`);
  return {
    fullDraft,
    summary,
    documentCount: documents.length,
    contentSha256,
  };
};
