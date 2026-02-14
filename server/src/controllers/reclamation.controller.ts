import { Request, Response } from 'express';
import prisma from '../prisma.js';

// CRÉER UNE RÉCLAMATION
export const creerReclamation = async (req: Request, res: Response): Promise<void> => {
  try {
    const etudiantId = (req as any).user.id;
    const { objet, description } = req.body;

    const reclamation = await prisma.reclamation.create({
      data: { etudiantId, objet, description }
    });

    res.status(201).json({
      success: true,
      message: 'Réclamation soumise avec succès !',
      reclamation
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

// OBTENIR MES RÉCLAMATIONS
export const getMesReclamations = async (req: Request, res: Response): Promise<void> => {
  try {
    const etudiantId = (req as any).user.id;

    const reclamations = await prisma.reclamation.findMany({
      where: { etudiantId },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({ success: true, reclamations });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};