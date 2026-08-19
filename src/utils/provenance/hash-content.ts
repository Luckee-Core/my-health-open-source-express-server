import { createHash } from 'crypto';

/**
 * SHA-256 hex digest of UTF-8 text (normalized trim).
 */
export const hashContent = (text: string): string => {
  const normalized = text.trim().replace(/\r\n/g, '\n');
  return createHash('sha256').update(normalized, 'utf8').digest('hex');
};
