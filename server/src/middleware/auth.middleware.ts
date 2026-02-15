import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ 
      success: false,
      message: 'Token manquant. Accès refusé.' 
    });
    return;
  }

  try {
    const secret = process.env.JWT_SECRET || 'secret';
    const decoded = jwt.verify(token, secret) as TokenPayload;
    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ 
      success: false,
      message: 'Token invalide ou expiré.' 
    });
  }
};