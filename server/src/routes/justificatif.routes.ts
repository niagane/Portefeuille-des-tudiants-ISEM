import { Router } from 'express';
import { soumettreJustificatif, getMesJustificatifs } from '../controllers/justificatif.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/', authenticateToken, soumettreJustificatif);
router.get('/mes-justificatifs', authenticateToken, getMesJustificatifs);

export default router;