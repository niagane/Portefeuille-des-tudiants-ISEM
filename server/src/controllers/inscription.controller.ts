import { Request, Response } from 'express';
import prisma from '../prisma';

// CRÉER UNE INSCRIPTION
export const creerInscription = async (req: Request, res: Response): Promise<void> => {
  try {
    const etudiantId = (req as any).user.id;
    const { typeInscription, anneeAcademique, matieres } = req.body;

    // Vérifier si inscription existe déjà
    const existingInscription = await prisma.inscription.findFirst({
      where: { etudiantId, typeInscription, anneeAcademique }
    });

    if (existingInscription) {
      res.status(400).json({
        success: false,
        message: 'Une inscription existe déjà pour cette année.'
      });
      return;
    }

    const inscription = await prisma.inscription.create({
      data: { 
        etudiantId, 
        typeInscription, 
        anneeAcademique,
        matieres: matieres ? JSON.stringify(matieres) : null
      }
    });

    res.status(201).json({
      success: true,
      message: 'Inscription créée avec succès !',
      inscription
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

// OBTENIR MES INSCRIPTIONS
export const getMesInscriptions = async (req: Request, res: Response): Promise<void> => {
  try {
    const etudiantId = (req as any).user.id;

    const inscriptions = await prisma.inscription.findMany({
      where: { etudiantId },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({ success: true, inscriptions });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};