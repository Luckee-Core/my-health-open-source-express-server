/**
 * Returns true when a pg error is a unique constraint violation for the given index name.
 */
export const isUniqueViolation = (error: unknown, indexName: string): boolean => {
  if (!error || typeof error !== 'object') return false;
  const pgError = error as { code?: string; message?: string };
  return pgError.code === '23505' && (pgError.message?.includes(indexName) ?? false);
};
