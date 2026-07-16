import multer from 'multer';

const MAX_UPLOAD_BYTES = 25 * 1024 * 1024;

/**
 * Memory-only multipart upload middleware for health import preview (field: file).
 */
export const healthImportUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_UPLOAD_BYTES, files: 1 },
});
