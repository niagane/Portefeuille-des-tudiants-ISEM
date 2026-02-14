import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// Charger explicitement le .env du dossier server
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Routes
import authRoutes from './routes/auth.routes';
import inscriptionRoutes from './routes/inscription.routes';
import paiementRoutes from './routes/paiement.routes';
import reclamationRoutes from './routes/reclamation.routes';
import justificatifRoutes from './routes/justificatif.routes';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;
const defaultFrontendOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000'];
const configuredOrigin = process.env.FRONTEND_URL;
const allowedOrigins = configuredOrigin
  ? Array.from(new Set([...defaultFrontendOrigins, configuredOrigin]))
  : defaultFrontendOrigins;

// Middlewares
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error(`CORS non autorise pour l origine: ${origin}`));
  },
  credentials: true
}));
app.use(express.json());
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});
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
