import { Router } from 'express';
import { creerReclamation, getMesReclamations } from '../controllers/reclamation.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticateToken, creerReclamation);
router.get('/mes-reclamations', authenticateToken, getMesReclamations);

export default router;