import { Router } from 'express';
import {
  callbackPaydunya,
  creerPaiement,
  getMesPaiements,
  initierPaiementPaydunya,
  verifierPaiementPaydunya
} from '../controllers/paiement.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/', authenticateToken, creerPaiement);
router.post('/paydunya/init', authenticateToken, initierPaiementPaydunya);
router.get('/paydunya/verify/:token', authenticateToken, verifierPaiementPaydunya);
router.post('/paydunya/ipn', callbackPaydunya);
router.get('/mes-paiements', authenticateToken, getMesPaiements);

export default router;
