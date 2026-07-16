import { Router } from 'express';
import { deleteReferralHandler } from './routes/delete-referral-handler';
import { getReferralsHandler } from './routes/get-referrals-handler';
import { patchReferralHandler } from './routes/patch-referral-handler';
import { postReferralHandler } from './routes/post-referral-handler';

/**
 * Factory for referrals router.
 */
export const createReferralsRouter = (): Router => {
  const router = Router();
  router.get('/', getReferralsHandler);
  router.post('/', postReferralHandler);
  router.patch('/:id', patchReferralHandler);
  router.delete('/:id', deleteReferralHandler);
  return router;
};
