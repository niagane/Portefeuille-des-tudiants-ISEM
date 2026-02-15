import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Routes
import authRoutes from './routes/auth.routes';
import inscriptionRoutes from './routes/inscription.routes';
import paiementRoutes from './routes/paiement.routes';
import reclamationRoutes from './routes/reclamation.routes';
import justificatifRoutes from './routes/justificatif.routes';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route de test
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: '🚀 UGB Student Portal API fonctionne !',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Routes principales
app.use('/api/auth', authRoutes);
app.use('/api/inscriptions', inscriptionRoutes);
app.use('/api/paiements', paiementRoutes);
app.use('/api/reclamations', reclamationRoutes);
app.use('/api/justificatifs', justificatifRoutes);

// Route 404
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} non trouvée.`
  });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log('================================');
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
  console.log(`📊 API Health: http://localhost:${PORT}/api/health`);
  console.log(`🗄️  Prisma Studio: npx prisma studio`);
  console.log('================================');
});