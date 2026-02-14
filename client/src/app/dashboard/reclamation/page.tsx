'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { Reclamation } from '@/types';

export default function ReclamationPage() {
  const { etudiant, isLoading } = useAuth();
  const router = useRouter();
  const [reclamations, setReclamations] = useState<Reclamation[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    objet: '', description: ''
  });

  useEffect(() => {
    if (!isLoading && !etudiant) router.push('/login');
    if (etudiant) fetchReclamations();
  }, [etudiant, isLoading]);

  const fetchReclamations = async () => {
    try {
      const res = await api.get('/reclamations/mes-reclamations');
      setReclamations(res.data.reclamations);
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await api.post('/reclamations', formData);
      setSuccess('Réclamation envoyée avec succès !');
      fetchReclamations();
      setFormData({ objet: '', description: '' });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de l\'envoi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-brown-dark text-cream px-4 py-6 shadow-xl">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="w-10 h-10 bg-brown-medium rounded-full flex items-center justify-center hover:bg-brown-light transition-colors">
              ←
            </Link>
            <h1 className="text-2xl font-bold tracking-tight">Réclamations</h1>
          </div>
          <div className="w-10 h-10 bg-cream rounded-full flex items-center justify-center text-xl shadow-lg">
            📣
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Formulaire */}
        <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-brown-light/20">
          <div className="bg-brown-dark/5 p-6 border-b border-brown-light/10">
            <h2 className="text-xl font-bold text-brown-dark">Nouvelle réclamation</h2>
            <p className="text-sm text-brown-medium">Nous sommes à votre écoute</p>
          </div>

          <div className="p-8">
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-2xl mb-6 flex items-center gap-3">
                <span className="text-xl">✅</span> {success}
              </div>
            )}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-2xl mb-6 flex items-center gap-3">
                <span className="text-xl">❌</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-brown-medium uppercase tracking-widest ml-2">Objet de la réclamation</label>
                <input
                  required
                  placeholder="Ex: Erreur sur ma note, Problème de paiement..."
                  value={formData.objet}
                  onChange={(e) => setFormData({ ...formData, objet: e.target.value })}
                  className="w-full px-5 py-4 bg-cream/30 border border-brown-light/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-brown-medium text-brown-dark font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-brown-medium uppercase tracking-widest ml-2">Description détaillée</label>
                <textarea
                  required
                  rows={5}
                  placeholder="Expliquez votre problème ici..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-5 py-4 bg-cream/30 border border-brown-light/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-brown-medium text-brown-dark font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !formData.objet}
                className="w-full bg-brown-dark hover:bg-brown-medium disabled:bg-brown-light/50 text-cream font-black py-5 rounded-2xl transition-all shadow-xl hover:shadow-brown-dark/20 flex items-center justify-center gap-3"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-cream"></div>
                ) : (
                  <><span>📣</span> ENVOYER LA RÉCLAMATION</>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Historique */}
        <div className="bg-white rounded-[2rem] shadow-xl p-8 border border-brown-light/20">
          <h2 className="text-xl font-bold text-brown-dark mb-6 flex items-center gap-3">
            <span className="w-2 h-8 bg-brown-medium rounded-full"></span>
            Mes réclamations
          </h2>

          {reclamations.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-brown-light/20 rounded-3xl">
              <div className="text-5xl mb-4 opacity-20">📣</div>
              <p className="text-brown-medium font-medium">Aucune réclamation trouvée</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {reclamations.map((r) => (
                <div key={r.id} className="group p-5 rounded-3xl border border-brown-light/10 hover:border-brown-medium transition-all hover:bg-brown-dark/5 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-brown-dark">{r.objet}</p>
                    <span className={`px-4 py-2 rounded-2xl text-xs font-bold ${
                      r.statut === 'resolue' ? 'bg-green-100 text-green-700' :
                      'bg-brown-light/30 text-brown-dark'
                    }`}>
                      {r.statut === 'resolue' ? '✅ Résolue' : '⏳ En cours'}
                    </span>
                  </div>
                  <p className="text-brown-medium text-sm line-clamp-2">{r.description}</p>
                  <p className="text-[10px] text-brown-light font-bold uppercase tracking-tighter">
                    {new Date(r.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
