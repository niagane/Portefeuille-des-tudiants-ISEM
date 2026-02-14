import { Router } from 'express';
import { creerReclamation, getMesReclamations } from '../controllers/reclamation.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/', authenticateToken, creerReclamation);
router.get('/mes-reclamations', authenticateToken, getMesReclamations);

export default router;