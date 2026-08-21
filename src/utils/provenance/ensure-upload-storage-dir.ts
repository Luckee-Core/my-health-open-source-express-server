import { mkdir } from 'fs/promises';
import path from 'path';

const UPLOAD_ROOT = process.env.UPLOAD_STORAGE_DIR ?? path.join(process.cwd(), 'data', 'uploads');

/**
 * Ensures the on-disk upload root exists and returns its absolute path.
 */
export const ensureUploadStorageDir = async (): Promise<string> => {
  await mkdir(UPLOAD_ROOT, { recursive: true });
  return UPLOAD_ROOT;
};

export const getUploadStorageRoot = (): string => UPLOAD_ROOT;
