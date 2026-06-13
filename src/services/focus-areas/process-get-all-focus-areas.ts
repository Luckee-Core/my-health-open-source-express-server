import type { Pool } from 'pg';
import { getAllFocusAreas } from '../../data/focus-areas/get-all-focus-areas';
import type { FocusArea } from '../../data/focus-areas/types';

/**
 * Loads all focus areas.
 */
export const processGetAllFocusAreas = async (pool: Pool): Promise<FocusArea[]> => {
  return getAllFocusAreas(pool);
};
