import type { Request, Response } from 'express';

/**
 * Handles GET /api/health — liveness probe (no success envelope).
 */
export const getHealthHandler = (_req: Request, res: Response): void => {
  console.log('📥 GET /api/health');
  res.json({
    status: 'ok',
    message: 'My Health Express Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
  console.log('✅ GET /api/health');
  console.log('📤 GET /api/health');
};
