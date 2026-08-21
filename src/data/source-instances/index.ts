import type { Pool } from 'pg';

export type SourceInstanceRow = {
  id: string;
  source_system_id: string;
  hospital_id: string | null;
  label: string;
  source_system_code: string;
  source_system_name: string;
  hospital_name: string | null;
  created_at: string;
  updated_at: string;
};

/**
 * Lists source instances with joined system and hospital labels.
 */
export const listSourceInstances = async (pool: Pool): Promise<SourceInstanceRow[]> => {
  const result = await pool.query<SourceInstanceRow>(
    `SELECT
       si.id,
       si.source_system_id,
       si.hospital_id,
       si.label,
       ss.code AS source_system_code,
       ss.name AS source_system_name,
       h.name AS hospital_name,
       si.created_at,
       si.updated_at
     FROM source_instances si
     INNER JOIN source_systems ss ON ss.id = si.source_system_id
     LEFT JOIN hospitals h ON h.id = si.hospital_id
     ORDER BY si.label ASC`,
  );
  return result.rows;
};

/**
 * Creates a source instance (e.g. MyChart @ Jefferson).
 */
export const createSourceInstance = async (
  pool: Pool,
  input: { source_system_id: string; hospital_id?: string | null; label: string },
): Promise<SourceInstanceRow> => {
  const insert = await pool.query<{ id: string }>(
    `INSERT INTO source_instances (source_system_id, hospital_id, label)
     VALUES ($1, $2, $3)
     RETURNING id`,
    [input.source_system_id, input.hospital_id ?? null, input.label.trim()],
  );
  const rows = await listSourceInstances(pool);
  const created = rows.find((row) => row.id === insert.rows[0].id);
  if (!created) throw new Error('failed to load created source instance');
  return created;
};

/**
 * Lists all source systems for pickers.
 */
export const listSourceSystems = async (
  pool: Pool,
): Promise<Array<{ id: string; code: string; name: string }>> => {
  const result = await pool.query(`SELECT id, code, name FROM source_systems ORDER BY name ASC`);
  return result.rows;
};
