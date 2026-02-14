import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Prisma } from '@prisma/client';
import prisma from '../prisma.js';

// INSCRIPTION ÉTUDIANT
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { matricule, nom, prenom, email, password, telephone, filiere, niveau } = req.body;

    if (!matricule || !nom || !prenom || !email || !password || !filiere || !niveau) {
      res.status(400).json({
        success: false,
        message: 'Tous les champs obligatoires doivent être renseignés.'
      });
      return;
    }

    if (typeof password !== 'string' || password.length < 6) {
      res.status(400).json({
        success: false,
        message: 'Le mot de passe doit contenir au moins 6 caractères.'
      });
      return;
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const normalizedMatricule = String(matricule).trim().toUpperCase();

    // Vérifier si l'étudiant existe déjà
    const existingStudent = await prisma.etudiant.findFirst({
      where: {
        OR: [{ email: normalizedEmail }, { matricule: normalizedMatricule }]
      }
    });

    if (existingStudent) {
      res.status(400).json({
        success: false,
        message: 'Un étudiant avec cet email ou matricule existe déjà.'
      });
      return;
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    // Créer l'étudiant
    const etudiant = await prisma.etudiant.create({
      data: {
        matricule: normalizedMatricule,
        nom: String(nom).trim(),
        prenom: String(prenom).trim(),
        email: normalizedEmail,
        password: hashedPassword,
        telephone: telephone ? String(telephone).trim() : null,
        filiere: String(filiere).trim(),
        niveau: String(niveau).trim()
      }
    });

    // Créer le token JWT
    const token = jwt.sign(
      { id: etudiant.id, email: etudiant.email, role: 'etudiant' },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Compte créé avec succès !',
      token,
      etudiant: {
        id: etudiant.id,
        matricule: etudiant.matricule,
        nom: etudiant.nom,
        prenom: etudiant.prenom,
        email: etudiant.email,
        filiere: etudiant.filiere,
        niveau: etudiant.niveau
      }
    });
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        res.status(400).json({
          success: false,
          message: 'Un étudiant avec cet email ou matricule existe déjà.'
        });
        return;
      }

      res.status(400).json({
        success: false,
        message: `Erreur base de données (${error.code}).`
      });
      return;
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
      res.status(400).json({
        success: false,
        message: 'Données d’inscription invalides.'
      });
      return;
    }

    console.error('Erreur register:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la création du compte.'
    });
  }
};

// CONNEXION ÉTUDIANT
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    console.log('Tentative de connexion pour:', email);

    // Trouver l'étudiant
    const etudiant = await prisma.etudiant.findUnique({
      where: { email }
    });

    if (!etudiant) {
      console.log('Étudiant non trouvé:', email);
      res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect.'
      });
      return;
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, etudiant.password);

    if (!isPasswordValid) {
      console.log('Mot de passe invalide pour:', email);
      res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect.'
      });
      return;
    }

    // Créer le token JWT
    const token = jwt.sign(
      { id: etudiant.id, email: etudiant.email, role: 'etudiant' },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Connexion réussie !',
      token,
      etudiant: {
        id: etudiant.id,
        matricule: etudiant.matricule,
        nom: etudiant.nom,
        prenom: etudiant.prenom,
        email: etudiant.email,
        filiere: etudiant.filiere,
        niveau: etudiant.niveau
      }
    });
  } catch (error: any) {
    console.error('Erreur login détaillée:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la connexion.',
      error: error.message
    });
  }
};

// PROFIL ÉTUDIANT CONNECTÉ
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;

    const etudiant = await prisma.etudiant.findUnique({
      where: { id: userId },
      select: {
        id: true,
        matricule: true,
        nom: true,
        prenom: true,
        email: true,
        telephone: true,
        filiere: true,
        niveau: true,
        createdAt: true
      }
    });

    if (!etudiant) {
      res.status(404).json({
        success: false,
        message: 'Étudiant non trouvé.'
      });
      return;
    }

    res.status(200).json({
      success: true,
      etudiant
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur serveur.'
    });
  }
};
