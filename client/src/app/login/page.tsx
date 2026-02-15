'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', formData);
      const { token, etudiant } = response.data;
      login(token, etudiant);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-brown-light opacity-20 rounded-full blur-3xl -ml-32 -mt-32"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-brown-medium opacity-20 rounded-full blur-3xl -mr-32 -mb-32"></div>

      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md p-10 border border-brown-light/10 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-block w-16 h-16 bg-brown-dark rounded-3xl flex items-center justify-center text-3xl shadow-lg mb-6 hover:rotate-12 transition-transform">
            🎓
          </Link>
          <h1 className="text-3xl font-black text-brown-dark tracking-tight">Portefeuille Étudiants ISEM UGB</h1>
          <p className="text-brown-medium text-xs font-bold uppercase tracking-widest mt-2">Accès Étudiant Sécurisé</p>
        </div>

        {/* Erreur */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-2xl mb-8 text-sm font-medium flex items-center gap-3">
            <span>❌</span> {error}
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-brown-medium uppercase tracking-[0.2em] ml-2">
              Email Universitaire
            </label>
            <input
              type="email"
              required
              placeholder="prenom.nom@ugb.edu.sn"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-6 py-4 bg-cream/30 border border-brown-light/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brown-medium focus:border-transparent text-brown-dark font-medium placeholder:text-brown-light/50 transition-all"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-2">
              <label className="text-[10px] font-black text-brown-medium uppercase tracking-[0.2em]">
                Mot de passe
              </label>
              <Link href="#" className="text-[10px] font-bold text-brown-dark hover:underline">Oublié ?</Link>
            </div>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-6 py-4 bg-cream/30 border border-brown-light/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brown-medium focus:border-transparent text-brown-dark font-medium placeholder:text-brown-light/50 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brown-dark hover:bg-brown-medium disabled:bg-brown-light/50 text-cream font-black py-5 rounded-2xl transition-all shadow-xl hover:shadow-brown-dark/20 active:scale-95 flex items-center justify-center gap-3 mt-4"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-cream"></div>
            ) : 'SE CONNECTER'}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-10 pt-8 border-t border-brown-light/10">
          <p className="text-sm text-brown-medium font-medium">
            Nouveau à l'ISEM ?{' '}
            <Link href="/register" className="text-brown-dark hover:underline font-black ml-1">
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
