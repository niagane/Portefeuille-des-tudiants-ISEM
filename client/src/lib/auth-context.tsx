'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Etudiant } from '@/types';

interface AuthContextType {
  etudiant: Etudiant | null;
  token: string | null;
  login: (token: string, etudiant: Etudiant) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [etudiant, setEtudiant] = useState<Etudiant | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedEtudiant = localStorage.getItem('etudiant');

    if (savedToken && savedEtudiant) {
      setToken(savedToken);
      setEtudiant(JSON.parse(savedEtudiant));
    }
    setIsLoading(false);
  }, []);

  const login = (newToken: string, newEtudiant: Etudiant) => {
    setToken(newToken);
    setEtudiant(newEtudiant);
    localStorage.setItem('token', newToken);
    localStorage.setItem('etudiant', JSON.stringify(newEtudiant));
  };

  const logout = () => {
    setToken(null);
    setEtudiant(null);
    localStorage.removeItem('token');
    localStorage.removeItem('etudiant');
  };

  return (
    <AuthContext.Provider value={{ etudiant, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}