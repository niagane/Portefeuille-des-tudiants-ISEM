import { Router } from 'express';
import { creerInscription, getMesInscriptions } from '../controllers/inscription.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/', authenticateToken, creerInscription);
router.get('/mes-inscriptions', authenticateToken, getMesInscriptions);

export default router;