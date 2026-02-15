'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { Inscription } from '@/types';

const MATIERES_PAR_NIVEAU: Record<string, string[]> = {
  'L1': ['Mathématiques Discrètes', 'Algorithmique & C', 'Architecture des Ordinateurs', 'Anglais I', 'Techniques de Communication'],
  'L2': ['Structures de Données', 'Programmation Orientée Objet', 'Systèmes d\'Exploitation', 'Réseaux Informatiques', 'Bases de Données'],
  'L3': ['Génie Logiciel', 'Intelligence Artificielle', 'Sécurité Informatique', 'Développement Web Avancé', 'Gestion de Projet'],
  'M1': ['Big Data', 'Cloud Computing', 'Machine Learning', 'Management SI', 'Recherche Opérationnelle'],
  'M2': ['Architecture Microservices', 'Blockchain', 'Deep Learning', 'Audit Informatique', 'Thèse de Master']
};

export default function InscriptionPage() {
  const { etudiant, isLoading } = useAuth();
  const router = useRouter();
  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [selectedMatieres, setSelectedMatieres] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    typeInscription: '',
    anneeAcademique: '2025-2026'
  });

  useEffect(() => {
    if (!isLoading && !etudiant) router.push('/login');
    if (etudiant) fetchInscriptions();
  }, [etudiant, isLoading]);

  const fetchInscriptions = async () => {
    try {
      const res = await api.get('/inscriptions/mes-inscriptions');
      setInscriptions(res.data.inscriptions);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleMatiere = (matiere: string) => {
    setSelectedMatieres(prev => 
      prev.includes(matiere) ? prev.filter(m => m !== matiere) : [...prev, matiere]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (formData.typeInscription === 'administrative') {
      window.open('https://portail.ugbnumerique.sn/#/home', '_blank');
      setSuccess('Redirection vers le Portail UGB pour l\'inscription administrative.');
      setLoading(false);
      return;
    }

    if (formData.typeInscription === 'pedagogique' && selectedMatieres.length === 0) {
      setError('Veuillez sélectionner au moins une matière.');
      setLoading(false);
      return;
    }

    try {
      await api.post('/inscriptions', {
        ...formData,
        matieres: selectedMatieres
      });
      setSuccess('Inscription pédagogique soumise avec succès !');
      fetchInscriptions();
      setFormData({ typeInscription: '', anneeAcademique: '2025-2026' });
      setSelectedMatieres([]);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'validee': return 'bg-green-100 text-green-700';
      case 'rejetee': return 'bg-red-100 text-red-700';
      default: return 'bg-brown-light/30 text-brown-dark';
    }
  };

  const matieresDisponibles = etudiant ? MATIERES_PAR_NIVEAU[etudiant.niveau] || [] : [];

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-brown-dark text-cream px-4 py-6 shadow-xl">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="w-10 h-10 bg-brown-medium rounded-full flex items-center justify-center hover:bg-brown-light transition-colors">
              ←
            </Link>
            <h1 className="text-2xl font-bold tracking-tight">Inscription ISEM</h1>
          </div>
          <div className="px-4 py-1 bg-brown-medium rounded-full text-xs font-bold uppercase tracking-widest">
            {etudiant?.niveau} - {etudiant?.filiere}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Formulaire */}
        <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-brown-light/20">
          <div className="bg-brown-dark/5 p-6 border-b border-brown-light/10">
            <h2 className="text-xl font-bold text-brown-dark">Fiche d'Inscription</h2>
            <p className="text-sm text-brown-medium">Remplissez les informations pour votre semestre</p>
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
                <label className="text-sm font-bold text-brown-dark uppercase tracking-widest">Type d'inscription</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, typeInscription: 'administrative' })}
                    className={`p-6 rounded-3xl border-2 transition-all text-left flex items-start gap-4 ${
                      formData.typeInscription === 'administrative'
                        ? 'border-brown-dark bg-brown-dark/5 shadow-inner'
                        : 'border-brown-light/20 hover:border-brown-medium'
                    }`}
                  >
                    <span className="text-3xl">🏛️</span>
                    <div>
                      <div className="font-bold text-brown-dark">Administrative</div>
                      <div className="text-brown-medium text-xs">Portail UGB Officiel</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, typeInscription: 'pedagogique' })}
                    className={`p-6 rounded-3xl border-2 transition-all text-left flex items-start gap-4 ${
                      formData.typeInscription === 'pedagogique'
                        ? 'border-brown-dark bg-brown-dark/5 shadow-inner'
                        : 'border-brown-light/20 hover:border-brown-medium'
                    }`}
                  >
                    <span className="text-3xl">📚</span>
                    <div>
                      <div className="font-bold text-brown-dark">Pédagogique</div>
                      <div className="text-brown-medium text-xs">Choix des Matières ISEM</div>
                    </div>
                  </button>
                </div>
              </div>

              {formData.typeInscription === 'pedagogique' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="flex justify-between items-end">
                    <label className="text-sm font-bold text-brown-dark uppercase tracking-widest">Choix des Matières ({etudiant?.niveau})</label>
                    <span className="text-xs text-brown-medium font-medium">{selectedMatieres.length} sélectionnée(s)</span>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {matieresDisponibles.map((matiere) => (
                      <div 
                        key={matiere}
                        onClick={() => toggleMatiere(matiere)}
                        className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                          selectedMatieres.includes(matiere)
                            ? 'bg-brown-dark text-cream border-brown-dark shadow-lg scale-[1.02]'
                            : 'bg-white border-brown-light/20 hover:border-brown-medium text-brown-dark'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                          selectedMatieres.includes(matiere) ? 'border-cream bg-cream text-brown-dark' : 'border-brown-light'
                        }`}>
                          {selectedMatieres.includes(matiere) && '✓'}
                        </div>
                        <span className="font-medium">{matiere}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading || !formData.typeInscription}
                  className="w-full bg-brown-dark hover:bg-brown-medium disabled:bg-brown-light/50 text-cream font-bold py-5 rounded-3xl transition-all shadow-2xl hover:shadow-brown-dark/20 active:scale-95 flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-cream"></div>
                  ) : formData.typeInscription === 'administrative' ? (
                    <><span>🔗</span> Aller sur le Portail UGB</>
                  ) : (
                    <><span>📝</span> Valider ma fiche pédagogique</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Historique */}
        <div className="bg-white rounded-[2rem] shadow-xl p-8 border border-brown-light/20">
          <h2 className="text-xl font-bold text-brown-dark mb-6 flex items-center gap-3">
            <span className="w-2 h-8 bg-brown-medium rounded-full"></span>
            Historique des inscriptions
          </h2>

          {inscriptions.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-brown-light/20 rounded-3xl">
              <div className="text-5xl mb-4 opacity-20">📋</div>
              <p className="text-brown-medium font-medium">Aucun dossier trouvé</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {inscriptions.map((ins) => (
                <div key={ins.id} className="group p-5 rounded-3xl border border-brown-light/10 hover:border-brown-medium transition-all hover:bg-brown-dark/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-cream rounded-2xl flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform">
                      {ins.typeInscription === 'pedagogique' ? '📚' : '🏛️'}
                    </div>
                    <div>
                      <p className="font-bold text-brown-dark capitalize">{ins.typeInscription}</p>
                      <p className="text-brown-medium text-xs font-medium">Année : {ins.anneeAcademique}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <p className="text-[10px] text-brown-medium font-bold uppercase tracking-tighter">Date</p>
                      <p className="text-xs font-bold text-brown-dark">{new Date(ins.createdAt).toLocaleDateString('fr-FR')}</p>
                    </div>
                    <span className={`px-4 py-2 rounded-2xl text-xs font-bold ${getStatutColor(ins.statut)}`}>
                      {ins.statut === 'en_attente' ? '⏳ En attente' : ins.statut === 'validee' ? '✅ Validée' : '❌ Rejetée'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
