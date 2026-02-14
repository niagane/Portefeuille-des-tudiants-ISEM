import { Request, Response } from 'express';
import prisma from '../prisma';

// SOUMETTRE UN JUSTIFICATIF
export const soumettreJustificatif = async (req: Request, res: Response): Promise<void> => {
  try {
    const etudiantId = (req as any).user.id;
    const { motif, dateDebut, dateFin } = req.body;

    const justificatif = await prisma.justificatif.create({
      data: {
        etudiantId,
        motif,
        dateDebut: new Date(dateDebut),
        dateFin: new Date(dateFin)
      }
    });

    res.status(201).json({
      success: true,
      message: 'Justificatif soumis avec succès !',
      justificatif
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

// OBTENIR MES JUSTIFICATIFS
export const getMesJustificatifs = async (req: Request, res: Response): Promise<void> => {
  try {
    const etudiantId = (req as any).user.id;

    const justificatifs = await prisma.justificatif.findMany({
      where: { etudiantId },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({ success: true, justificatifs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};