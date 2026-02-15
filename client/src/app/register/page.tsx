'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    matricule: '', nom: '', prenom: '', email: '',
    password: '', telephone: '', filiere: '', niveau: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/register', formData);
      const { token, etudiant } = response.data;
      login(token, etudiant);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la création du compte');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-brown-light opacity-20 rounded-full blur-3xl -ml-32 -mt-32"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-brown-medium opacity-20 rounded-full blur-3xl -mr-32 -mb-32"></div>

      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl p-10 border border-brown-light/10 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block w-14 h-14 bg-brown-dark rounded-2xl flex items-center justify-center text-2xl shadow-lg mb-4 hover:rotate-12 transition-transform">
            🎓
          </Link>
          <h1 className="text-2xl font-black text-brown-dark tracking-tight">CRÉER UN COMPTE ISEM</h1>
          <p className="text-brown-medium text-[10px] font-bold uppercase tracking-widest mt-2">Rejoignez la communauté UGB</p>
        </div>

        {/* Erreur */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-2xl mb-6 text-sm font-medium flex items-center gap-3">
            <span>❌</span> {error}
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-brown-medium uppercase tracking-widest ml-2">Prénom</label>
              <input name="prenom" required placeholder="Amadou" onChange={handleChange}
                className="w-full px-5 py-3 bg-cream/30 border border-brown-light/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-brown-medium text-brown-dark font-medium placeholder:text-brown-light/50"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-brown-medium uppercase tracking-widest ml-2">Nom</label>
              <input name="nom" required placeholder="Diallo" onChange={handleChange}
                className="w-full px-5 py-3 bg-cream/30 border border-brown-light/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-brown-medium text-brown-dark font-medium placeholder:text-brown-light/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-brown-medium uppercase tracking-widest ml-2">Matricule</label>
              <input name="matricule" required placeholder="UGB2024001" onChange={handleChange}
                className="w-full px-5 py-3 bg-cream/30 border border-brown-light/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-brown-medium text-brown-dark font-medium placeholder:text-brown-light/50"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-brown-medium uppercase tracking-widest ml-2">Téléphone</label>
              <input name="telephone" placeholder="771234567" onChange={handleChange}
                className="w-full px-5 py-3 bg-cream/30 border border-brown-light/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-brown-medium text-brown-dark font-medium placeholder:text-brown-light/50"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-brown-medium uppercase tracking-widest ml-2">Email Universitaire</label>
            <input name="email" type="email" required placeholder="prenom.nom@ugb.edu.sn" onChange={handleChange}
              className="w-full px-5 py-3 bg-cream/30 border border-brown-light/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-brown-medium text-brown-dark font-medium placeholder:text-brown-light/50"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-brown-medium uppercase tracking-widest ml-2">Filière</label>
              <select name="filiere" required onChange={handleChange}
                className="w-full px-5 py-3 bg-cream/30 border border-brown-light/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-brown-medium text-brown-dark font-medium">
                <option value="">Choisir</option>
                <option value="Informatique">Informatique</option>
                <option value="Economie">Economie</option>
                <option value="Gestion">Gestion</option>
                <option value="Management">Management</option>
                <option value="Comptabilite">Comptabilité</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-brown-medium uppercase tracking-widest ml-2">Niveau</label>
              <select name="niveau" required onChange={handleChange}
                className="w-full px-5 py-3 bg-cream/30 border border-brown-light/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-brown-medium text-brown-dark font-medium">
                <option value="">Choisir</option>
                <option value="L1">Licence 1</option>
                <option value="L2">Licence 2</option>
                <option value="L3">Licence 3</option>
                <option value="M1">Master 1</option>
                <option value="M2">Master 2</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-brown-medium uppercase tracking-widest ml-2">Mot de passe</label>
            <input name="password" type="password" required placeholder="Minimum 6 caractères" onChange={handleChange}
              className="w-full px-5 py-3 bg-cream/30 border border-brown-light/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-brown-medium text-brown-dark font-medium placeholder:text-brown-light/50"
            />
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-brown-dark hover:bg-brown-medium disabled:bg-brown-light/50 text-cream font-black py-4 rounded-xl transition-all shadow-xl hover:shadow-brown-dark/20 active:scale-95 flex items-center justify-center gap-3 mt-4"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-cream"></div>
            ) : 'CRÉER MON COMPTE'}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-8 pt-6 border-t border-brown-light/10">
          <p className="text-sm text-brown-medium font-medium">
            Déjà inscrit ?{' '}
            <Link href="/login" className="text-brown-dark hover:underline font-black ml-1">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
