'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { Justificatif } from '@/types';

export default function JustificatifPage() {
  const { etudiant, isLoading } = useAuth();
  const router = useRouter();
  const [justificatifs, setJustificatifs] = useState<Justificatif[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    motif: '', dateDebut: '', dateFin: ''
  });

  useEffect(() => {
    if (!isLoading && !etudiant) router.push('/login');
    if (etudiant) fetchJustificatifs();
  }, [etudiant, isLoading]);

  const fetchJustificatifs = async () => {
    try {
      const res = await api.get('/justificatifs/mes-justificatifs');
      setJustificatifs(res.data.justificatifs);
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await api.post('/justificatifs', formData);
      setSuccess('Justificatif soumis avec succès !');
      fetchJustificatifs();
      setFormData({ motif: '', dateDebut: '', dateFin: '' });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la soumission');
    } finally {
      setLoading(false);
    }
  };

  const motifs = [
    { id: 'maladie', label: 'Maladie', icon: '🤒' },
    { id: 'famille', label: 'Raison familiale', icon: '👨‍👩‍👧' },
    { id: 'stage', label: 'Stage', icon: '💼' },
    { id: 'autre', label: 'Autre', icon: '📋' },
  ];

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-brown-dark text-cream px-4 py-6 shadow-xl">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="w-10 h-10 bg-brown-medium rounded-full flex items-center justify-center hover:bg-brown-light transition-colors">
              ←
            </Link>
            <h1 className="text-2xl font-bold tracking-tight">Justificatifs</h1>
          </div>
          <div className="w-10 h-10 bg-cream rounded-full flex items-center justify-center text-xl shadow-lg">
            📄
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Formulaire */}
        <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-brown-light/20">
          <div className="bg-brown-dark/5 p-6 border-b border-brown-light/10">
            <h2 className="text-xl font-bold text-brown-dark">Soumettre un justificatif</h2>
            <p className="text-sm text-brown-medium">Justifiez vos absences en quelques clics</p>
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

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-4">
                <label className="text-sm font-bold text-brown-dark uppercase tracking-widest">Motif de l'absence</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {motifs.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, motif: m.id })}
                      className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                        formData.motif === m.id
                          ? 'border-brown-dark bg-brown-dark/5 shadow-inner'
                          : 'border-brown-light/10 hover:border-brown-medium'
                      }`}
                    >
                      <span className="text-3xl">{m.icon}</span>
                      <span className="text-xs font-bold text-brown-dark">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-brown-medium uppercase tracking-widest ml-2">Date de début</label>
                  <input
                    type="date"
                    required
                    value={formData.dateDebut}
                    onChange={(e) => setFormData({ ...formData, dateDebut: e.target.value })}
                    className="w-full px-5 py-4 bg-cream/30 border border-brown-light/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-brown-medium text-brown-dark font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-brown-medium uppercase tracking-widest ml-2">Date de fin</label>
                  <input
                    type="date"
                    required
                    value={formData.dateFin}
                    onChange={(e) => setFormData({ ...formData, dateFin: e.target.value })}
                    className="w-full px-5 py-4 bg-cream/30 border border-brown-light/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-brown-medium text-brown-dark font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !formData.motif}
                className="w-full bg-brown-dark hover:bg-brown-medium disabled:bg-brown-light/50 text-cream font-black py-5 rounded-2xl transition-all shadow-xl hover:shadow-brown-dark/20 flex items-center justify-center gap-3"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-cream"></div>
                ) : (
                  <><span>📄</span> SOUMETTRE LE JUSTIFICATIF</>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Historique */}
        <div className="bg-white rounded-[2rem] shadow-xl p-8 border border-brown-light/20">
          <h2 className="text-xl font-bold text-brown-dark mb-6 flex items-center gap-3">
            <span className="w-2 h-8 bg-brown-medium rounded-full"></span>
            Mes justificatifs
          </h2>

          {justificatifs.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-brown-light/20 rounded-3xl">
              <div className="text-5xl mb-4 opacity-20">📄</div>
              <p className="text-brown-medium font-medium">Aucun justificatif trouvé</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {justificatifs.map((j) => (
                <div key={j.id} className="group p-5 rounded-3xl border border-brown-light/10 hover:border-brown-medium transition-all hover:bg-brown-dark/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-cream rounded-2xl flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform">
                      {j.motif === 'maladie' ? '🤒' : j.motif === 'famille' ? '👨‍👩‍👧' : '📋'}
                    </div>
                    <div>
                      <p className="font-bold text-brown-dark capitalize">{j.motif}</p>
                      <p className="text-brown-medium text-xs font-medium">
                        Du {new Date(j.dateDebut).toLocaleDateString('fr-FR')} au {new Date(j.dateFin).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <span className={`px-4 py-2 rounded-2xl text-xs font-bold ${
                    j.statut === 'accepte' ? 'bg-green-100 text-green-700' :
                    j.statut === 'refuse' ? 'bg-red-100 text-red-700' :
                    'bg-brown-light/30 text-brown-dark'
                  }`}>
                    {j.statut === 'accepte' ? '✅ Accepté' : j.statut === 'refuse' ? '❌ Refusé' : '⏳ En attente'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
