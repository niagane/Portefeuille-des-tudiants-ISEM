import { Router } from 'express';
import { creerPaiement, getMesPaiements } from '../controllers/paiement.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticateToken, creerPaiement);
router.get('/mes-paiements', authenticateToken, getMesPaiements);

export default router;