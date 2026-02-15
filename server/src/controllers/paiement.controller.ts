import { Request, Response } from 'express';
import prisma from '../prisma';

// CRÉER UN PAIEMENT
export const creerPaiement = async (req: Request, res: Response): Promise<void> => {
  try {
    const etudiantId = (req as any).user.id;
    const { montant, typePaiement, methodePaiement, recuUrl } = req.body;

    // Générer une référence unique
    const reference = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const paiement = await prisma.paiement.create({
      data: {
        etudiantId,
        montant,
        typePaiement,
        methodePaiement,
        recuUrl,
        statutPaiement: methodePaiement === 'physique' ? 'en_attente' : 'valide'
      }
    });

    res.status(201).json({
      success: true,
      message: 'Paiement initié avec succès !',
      paiement,
      reference
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

// OBTENIR MES PAIEMENTS
export const getMesPaiements = async (req: Request, res: Response): Promise<void> => {
  try {
    const etudiantId = (req as any).user.id;

    const paiements = await prisma.paiement.findMany({
      where: { etudiantId },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({ success: true, paiements });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};