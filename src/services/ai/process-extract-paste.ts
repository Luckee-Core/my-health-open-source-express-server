import { writeFile } from 'fs/promises';
import path from 'path';
import type { Pool } from 'pg';
import {
  createAiExtractSession,
  getAiExtractSessionWithProposals,
  insertConditionProposals,
  insertMedicationProposals,
  markAiExtractSessionCommitted,
} from '../../data/ai-extract-sessions';
import { createClinicalRecordSource } from '../../data/clinical-record-sources/create-clinical-record-source';
import { createCondition } from '../../data/conditions/create-condition';
import { createMedication } from '../../data/medications/create-medication';
import { syncMedicationDoseScheduleFromInstructions } from '../medications/sync-medication-dose-schedule';
import {
  createDocumentUpload,
  findDocumentUploadBySha256,
} from '../../data/document-uploads';
import { hashContent } from '../../utils/provenance/hash-content';
import {
  ensureUploadStorageDir,
  getUploadStorageRoot,
} from '../../utils/provenance/ensure-upload-storage-dir';
import { parseConditionText } from './extract/parse-condition-text';
import { parseMedicationText } from './extract/parse-medication-text';

export type ExtractPasteInput = {
  text: string;
  sourceInstanceId?: string | null;
  originalFilename?: string | null;
  reportType: 'medications_list' | 'conditions_list';
  entityType: 'medications' | 'conditions';
};

export class DuplicateUploadError extends Error {
  uploadId: string;

  constructor(uploadId: string) {
    super('This paste was already imported');
    this.name = 'DuplicateUploadError';
    this.uploadId = uploadId;
  }
}

/**
 * Stores paste text on disk, registers upload, parses proposals, opens review session.
 */
export const processExtractPaste = async (pool: Pool, input: ExtractPasteInput) => {
  const trimmed = input.text.trim();
  if (!trimmed) throw new Error('text is required');

  const contentSha256 = hashContent(trimmed);
  const existing = await findDocumentUploadBySha256(pool, contentSha256);
  if (existing) {
    throw new DuplicateUploadError(existing.id);
  }

  await ensureUploadStorageDir();
  const filename =
    input.originalFilename?.trim() ||
    `paste-${input.entityType}-${new Date().toISOString().replace(/[:.]/g, '-')}.txt`;
  const storagePath = path.join(getUploadStorageRoot(), `${contentSha256}-${filename}`);
  await writeFile(storagePath, trimmed, 'utf8');

  const upload = await createDocumentUpload(pool, {
    source_instance_id: input.sourceInstanceId ?? null,
    ingest_kind: 'paste',
    report_type: input.reportType,
    original_filename: filename,
    content_sha256: contentSha256,
    storage_path: storagePath,
    status: 'review',
  });

  const session = await createAiExtractSession(pool, upload.id, input.entityType);

  if (input.entityType === 'medications') {
    const parsed = parseMedicationText(trimmed);
    const proposals = await insertMedicationProposals(
      pool,
      session.id,
      parsed.map((row, index) => ({
        sort_order: index,
        name: row.name,
        instructions: row.instructions,
        notes: row.notes,
      })),
    );
    return { upload, session, medicationProposals: proposals, conditionProposals: [] };
  }

  const parsed = parseConditionText(trimmed);
  const proposals = await insertConditionProposals(
    pool,
    session.id,
    parsed.map((row, index) => ({
      sort_order: index,
      name: row.name,
      notes: row.notes,
    })),
  );
  return { upload, session, medicationProposals: [], conditionProposals: proposals };
};

/**
 * Commits selected proposals into domain tables with provenance junction rows.
 */
export const processCommitExtractSession = async (pool: Pool, sessionId: string) => {
  const bundle = await getAiExtractSessionWithProposals(pool, sessionId);
  if (!bundle) throw new Error('session not found');
  if (bundle.session.status === 'committed') throw new Error('session already committed');

  const uploadId = bundle.session.upload_id;
  const uploadRow = await pool.query<{ source_instance_id: string | null }>(
    `SELECT source_instance_id FROM document_uploads WHERE id = $1`,
    [uploadId],
  );
  const sourceInstanceId = uploadRow.rows[0]?.source_instance_id ?? null;

  const createdMedications = [];
  const createdConditions = [];

  if (bundle.session.entity_type === 'medications') {
    for (const proposal of bundle.medicationProposals) {
      if (!proposal.is_selected) continue;
      const med = await createMedication(pool, {
        name: proposal.name,
        instructions: proposal.instructions,
        started_on: proposal.started_on,
        status: proposal.status,
        notes: proposal.notes,
        source_system: 'paste',
        source_document_id: uploadId,
        source_entry_key: proposal.id,
      });
      await syncMedicationDoseScheduleFromInstructions(
        pool,
        med.id,
        med.instructions,
        med.status,
      );
      await createClinicalRecordSource(pool, {
        entity_table: 'medications',
        entity_id: med.id,
        upload_id: uploadId,
        source_instance_id: sourceInstanceId,
        source_entry_key: proposal.id,
      });
      createdMedications.push(med);
    }
  } else {
    for (const proposal of bundle.conditionProposals) {
      if (!proposal.is_selected) continue;
      const condition = await createCondition(pool, {
        name: proposal.name,
        status: proposal.clinical_status,
        noted_on: proposal.noted_on,
        diagnosed_on: proposal.diagnosed_on,
        notes: proposal.notes,
        source_system: 'paste',
        source_document_id: uploadId,
        source_entry_key: proposal.id,
      });
      await createClinicalRecordSource(pool, {
        entity_table: 'conditions',
        entity_id: condition.id,
        upload_id: uploadId,
        source_instance_id: sourceInstanceId,
        source_entry_key: proposal.id,
      });
      createdConditions.push(condition);
    }
  }

  await markAiExtractSessionCommitted(pool, sessionId);
  await pool.query(
    `UPDATE document_uploads SET status = 'committed', updated_at = now() WHERE id = $1`,
    [uploadId],
  );

  return { medications: createdMedications, conditions: createdConditions };
};
