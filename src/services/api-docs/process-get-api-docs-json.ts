import { buildApiDocsCatalog } from './api-docs-catalog';
import type { ApiDocsCatalog } from './types';

/**
 * Builds the API documentation catalog.
 */
export const processGetApiDocsJson = (): ApiDocsCatalog => {
  return buildApiDocsCatalog();
};
