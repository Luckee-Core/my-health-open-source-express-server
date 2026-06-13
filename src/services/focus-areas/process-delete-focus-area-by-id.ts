import type { Pool } from 'pg';
import { deleteFocusAreaById } from '../../data/focus-areas/delete-focus-area-by-id';

/**
 * Deletes a focus area by id.
 */
export const processDeleteFocusAreaById = async (pool: Pool, id: string): Promise<void> => {
  await deleteFocusAreaById(pool, id);
};
