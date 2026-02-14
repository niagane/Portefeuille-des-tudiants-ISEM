'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { normalizeNiveau, PARCOURS_BY_LEVEL, PARCOURS_LABELS } from '@/lib/academic-data';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    matricule: '', nom: '', prenom: '', email: '',
    password: '', telephone: '', filiere: '', niveau: ''
  });

  const niveauOptions = [
    { value: 'LICENCE 1', label: 'Licence 1' },
    { value: 'LICENCE 2', label: 'Licence 2' },
    { value: 'LICENCE 3', label: 'Licence 3' },
    { value: 'MASTER 1', label: 'Master 1' },
    { value: 'MASTER 2', label: 'Master 2' }
  ];

  const selectedNiveau = normalizeNiveau(formData.niveau || 'LICENCE 1');
  const filiereOptions = PARCOURS_BY_LEVEL[selectedNiveau].map((value) => ({
    value,
    label: PARCOURS_LABELS[value] || value
  }));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'niveau') {
      setFormData({ ...formData, niveau: value, filiere: '' });
      return;
    }

    setFormData({ ...formData, [name]: value });
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
      setError(err.response?.data?.message || err.message || 'Erreur lors de la creation du compte');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-64 h-64 bg-brown-light opacity-20 rounded-full blur-3xl -ml-32 -mt-32"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-brown-medium opacity-20 rounded-full blur-3xl -mr-32 -mb-32"></div>

      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl p-10 border border-brown-light/10 relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block w-14 h-14 bg-brown-dark rounded-2xl flex items-center justify-center text-2xl shadow-lg mb-4 hover:rotate-12 transition-transform">
            🎓
          </Link>
          <h1 className="text-2xl font-black text-brown-dark tracking-tight">CREER UN COMPTE ISEM</h1>
          <p className="text-brown-medium text-[10px] font-bold uppercase tracking-widest mt-2">Rejoignez la communaute UGB</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-2xl mb-6 text-sm font-medium flex items-center gap-3">
            <span>❌</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-brown-medium uppercase tracking-widest ml-2">Prenom</label>
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
              <label className="text-[10px] font-black text-brown-medium uppercase tracking-widest ml-2">Code etudiant</label>
              <input name="matricule" required placeholder="FP312345" onChange={handleChange}
                className="w-full px-5 py-3 bg-cream/30 border border-brown-light/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-brown-medium text-brown-dark font-medium placeholder:text-brown-light/50"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-brown-medium uppercase tracking-widest ml-2">Telephone</label>
              <input name="telephone" placeholder="771234567" onChange={handleChange}
                className="w-full px-5 py-3 bg-cream/30 border border-brown-light/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-brown-medium text-brown-dark font-medium placeholder:text-brown-light/50"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-brown-medium uppercase tracking-widest ml-2">Email universitaire</label>
            <input name="email" type="email" required placeholder="prenom.nom@ugb.edu.sn" onChange={handleChange}
              className="w-full px-5 py-3 bg-cream/30 border border-brown-light/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-brown-medium text-brown-dark font-medium placeholder:text-brown-light/50"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-brown-medium uppercase tracking-widest ml-2">Parcours / Filiere</label>
              <select name="filiere" required onChange={handleChange} value={formData.filiere}
                className="w-full px-5 py-3 bg-cream/30 border border-brown-light/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-brown-medium text-brown-dark font-medium">
                <option value="">Choisir</option>
                {filiereOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-brown-medium uppercase tracking-widest ml-2">Niveau</label>
              <select name="niveau" required onChange={handleChange} value={formData.niveau}
                className="w-full px-5 py-3 bg-cream/30 border border-brown-light/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-brown-medium text-brown-dark font-medium">
                <option value="">Choisir</option>
                {niveauOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-brown-medium uppercase tracking-widest ml-2">Mot de passe</label>
            <input name="password" type="password" required placeholder="Minimum 6 caracteres" onChange={handleChange}
              className="w-full px-5 py-3 bg-cream/30 border border-brown-light/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-brown-medium text-brown-dark font-medium placeholder:text-brown-light/50"
            />
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-brown-dark hover:bg-brown-medium disabled:bg-brown-light/50 text-cream font-black py-4 rounded-xl transition-all shadow-xl hover:shadow-brown-dark/20 active:scale-95 flex items-center justify-center gap-3 mt-4"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-cream"></div>
            ) : 'CREER MON COMPTE'}
          </button>
        </form>

        <div className="text-center mt-8 pt-6 border-t border-brown-light/10">
          <p className="text-sm text-brown-medium font-medium">
            Deja inscrit ?{' '}
            <Link href="/login" className="text-brown-dark hover:underline font-black ml-1">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
