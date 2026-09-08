import type { Pool, PoolClient } from 'pg';
import type { CreateInsuranceCoverageInput, InsuranceCoverage } from '../../model/insurance-coverage';

type Queryable = Pool | PoolClient;

/**
 * Upserts a InsuranceCoverage by (source_system, source_entry_key).
 */
export const upsertInsuranceCoverageBySourceKey = async (
  pool: Queryable,
  input: CreateInsuranceCoverageInput,
): Promise<InsuranceCoverage> => {
  console.log('💾 upsertInsuranceCoverageBySourceKey');
  if (!input.source_system || !input.source_entry_key) {
    throw new Error('source_system and source_entry_key are required for upsert');
  }
  try {
    const result = await pool.query<InsuranceCoverage>(
      `INSERT INTO insurance_coverages (payer_name, member_id, group_number, plan_name, status, source_system, source_document_id, source_entry_key)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (source_system, source_entry_key)
       DO UPDATE SET
         payer_name = EXCLUDED.payer_name,
         member_id = EXCLUDED.member_id,
         group_number = EXCLUDED.group_number,
         plan_name = EXCLUDED.plan_name,
         status = EXCLUDED.status,
         source_document_id = EXCLUDED.source_document_id,
         updated_at = now()
       RETURNING *`,
      [
        input.payer_name,
        input.member_id ?? null,
        input.group_number ?? null,
        input.plan_name ?? null,
        input.status ?? null,
        input.source_system ?? null,
        input.source_document_id ?? null,
        input.source_entry_key ?? null,
      ],
    );
    return result.rows[0];
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to upsert InsuranceCoverage: ${message}`);
  }
};
