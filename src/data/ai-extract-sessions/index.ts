import type { Pool, PoolClient } from 'pg';

type Queryable = Pool | PoolClient;

export type AiExtractEntityType = 'medications' | 'conditions';

export type AiExtractSession = {
  id: string;
  upload_id: string;
  entity_type: AiExtractEntityType;
  status: 'review' | 'committed' | 'failed';
  created_at: string;
  updated_at: string;
};

export type MedicationProposal = {
  id: string;
  session_id: string;
  sort_order: number;
  name: string;
  instructions: string | null;
  started_on: string | null;
  status: 'active' | 'stopped';
  notes: string | null;
  is_selected: boolean;
  created_at: string;
};

export type ConditionProposal = {
  id: string;
  session_id: string;
  sort_order: number;
  name: string;
  clinical_status: 'active' | 'resolved';
  noted_on: string | null;
  diagnosed_on: string | null;
  notes: string | null;
  is_selected: boolean;
  created_at: string;
};

/**
 * Creates an AI extract review session linked to a document upload.
 */
export const createAiExtractSession = async (
  pool: Queryable,
  uploadId: string,
  entityType: AiExtractEntityType,
): Promise<AiExtractSession> => {
  const result = await pool.query<AiExtractSession>(
    `INSERT INTO ai_extract_sessions (upload_id, entity_type, status)
     VALUES ($1, $2, 'review')
     RETURNING *`,
    [uploadId, entityType],
  );
  return result.rows[0];
};

/**
 * Inserts medication proposals for a session.
 */
export const insertMedicationProposals = async (
  pool: Queryable,
  sessionId: string,
  proposals: Array<{
    sort_order: number;
    name: string;
    instructions?: string | null;
    notes?: string | null;
  }>,
): Promise<MedicationProposal[]> => {
  const rows: MedicationProposal[] = [];
  for (const proposal of proposals) {
    const result = await pool.query<MedicationProposal>(
      `INSERT INTO ai_extract_medication_proposals (
         session_id, sort_order, name, instructions, notes
       )
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        sessionId,
        proposal.sort_order,
        proposal.name,
        proposal.instructions ?? null,
        proposal.notes ?? null,
      ],
    );
    rows.push(result.rows[0]);
  }
  return rows;
};

/**
 * Inserts condition proposals for a session.
 */
export const insertConditionProposals = async (
  pool: Queryable,
  sessionId: string,
  proposals: Array<{
    sort_order: number;
    name: string;
    notes?: string | null;
  }>,
): Promise<ConditionProposal[]> => {
  const rows: ConditionProposal[] = [];
  for (const proposal of proposals) {
    const result = await pool.query<ConditionProposal>(
      `INSERT INTO ai_extract_condition_proposals (
         session_id, sort_order, name, notes
       )
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [sessionId, proposal.sort_order, proposal.name, proposal.notes ?? null],
    );
    rows.push(result.rows[0]);
  }
  return rows;
};

/**
 * Loads a session and its proposals.
 */
export const getAiExtractSessionWithProposals = async (
  pool: Pool,
  sessionId: string,
): Promise<{
  session: AiExtractSession;
  medicationProposals: MedicationProposal[];
  conditionProposals: ConditionProposal[];
} | null> => {
  const sessionResult = await pool.query<AiExtractSession>(
    `SELECT * FROM ai_extract_sessions WHERE id = $1`,
    [sessionId],
  );
  const session = sessionResult.rows[0];
  if (!session) return null;

  const medicationProposals =
    session.entity_type === 'medications'
      ? (
          await pool.query<MedicationProposal>(
            `SELECT * FROM ai_extract_medication_proposals
             WHERE session_id = $1 ORDER BY sort_order ASC`,
            [sessionId],
          )
        ).rows
      : [];

  const conditionProposals =
    session.entity_type === 'conditions'
      ? (
          await pool.query<ConditionProposal>(
            `SELECT * FROM ai_extract_condition_proposals
             WHERE session_id = $1 ORDER BY sort_order ASC`,
            [sessionId],
          )
        ).rows
      : [];

  return { session, medicationProposals, conditionProposals };
};

/**
 * Marks an extract session committed.
 */
export const markAiExtractSessionCommitted = async (
  pool: Queryable,
  sessionId: string,
): Promise<void> => {
  await pool.query(
    `UPDATE ai_extract_sessions SET status = 'committed', updated_at = now() WHERE id = $1`,
    [sessionId],
  );
};
