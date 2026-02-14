'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { Paiement } from '@/types';

export default function PaiementPage() {
  const { etudiant, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [paiements, setPaiements] = useState<Paiement[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [recuFile, setRecuFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    montant: '',
    typePaiement: '',
    methodePaiement: ''
  });

  useEffect(() => {
    if (!isLoading && !etudiant) router.push('/login');
    if (etudiant) fetchPaiements();
  }, [etudiant, isLoading, router]);

  useEffect(() => {
    const status = searchParams.get('status');
    if (status === 'success') {
      setSuccess('Paiement PayDunya finalise. Verification en cours.');
      fetchPaiements();
    }
    if (status === 'cancel') {
      setError('Paiement annule par l utilisateur.');
    }
  }, [searchParams]);

  const fetchPaiements = async () => {
    try {
      const res = await api.get('/paiements/mes-paiements');
      setPaiements(res.data.paiements);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setRecuFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    let recuUrl = null;
    if (formData.methodePaiement === 'physique' && recuFile) {
      recuUrl = `uploads/recus/${Date.now()}_${recuFile.name}`;
    }

    try {
      const payload = {
        ...formData,
        montant: parseFloat(formData.montant),
        recuUrl
      };

      if (formData.methodePaiement === 'wave' || formData.methodePaiement === 'orange_money' || formData.methodePaiement === 'carte') {
        const res = await api.post('/paiements/paydunya/init', {
          ...payload,
          successUrl: `${window.location.origin}/dashboard/paiement?status=success`,
          cancelUrl: `${window.location.origin}/dashboard/paiement?status=cancel`
        });

        const checkoutUrl = res.data?.checkoutUrl;
        if (!checkoutUrl) throw new Error('URL de paiement indisponible.');
        window.location.href = checkoutUrl;
        return;
      }

      await api.post('/paiements', payload);
      setSuccess('Recu soumis avec succes. En attente de verification par l ISEM.');
      fetchPaiements();
      setFormData({ montant: '', typePaiement: '', methodePaiement: '' });
      setRecuFile(null);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Erreur lors du paiement');
    } finally {
      setLoading(false);
    }
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'valide':
        return 'bg-green-100 text-green-700';
      case 'echoue':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-brown-light/30 text-brown-dark';
    }
  };

  const methodesEnLigne = [
    { id: 'wave', label: 'Wave', icon: '/payment/wave.svg' },
    { id: 'orange_money', label: 'Orange Money', icon: '/payment/orange-money.svg' },
    { id: 'carte', label: 'Carte bancaire', icon: '' }
  ];

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-brown-dark text-cream px-4 py-6 shadow-xl">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="w-10 h-10 bg-brown-medium rounded-full flex items-center justify-center hover:bg-brown-light transition-colors">
              ←
            </Link>
            <h1 className="text-2xl font-bold tracking-tight">Paiements ISEM</h1>
          </div>
          <span className="text-3xl">💰</span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-brown-light/20">
          <div className="bg-brown-dark/5 p-6 border-b border-brown-light/10">
            <h2 className="text-xl font-bold text-brown-dark">Effectuer un paiement</h2>
            <p className="text-sm text-brown-medium">Simulation PayDunya: Wave, Orange Money ou carte.</p>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-brown-dark uppercase tracking-widest">Type de paiement</label>
                  <select
                    required
                    value={formData.typePaiement}
                    onChange={(e) => setFormData({ ...formData, typePaiement: e.target.value })}
                    className="w-full px-4 py-4 bg-cream/50 border border-brown-light/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brown-medium text-brown-dark font-medium"
                  >
                    <option value="">Selectionner</option>
                    <option value="inscription">Frais d inscription</option>
                    <option value="scolarite">Frais de scolarite</option>
                    <option value="restauration">Restauration CROUS</option>
                    <option value="logement">Logement CROUS</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-brown-dark uppercase tracking-widest">Montant (FCFA)</label>
                  <input
                    type="number"
                    required
                    placeholder="Ex: 50000"
                    value={formData.montant}
                    onChange={(e) => setFormData({ ...formData, montant: e.target.value })}
                    className="w-full px-4 py-4 bg-cream/50 border border-brown-light/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brown-medium text-brown-dark font-medium"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-bold text-brown-dark uppercase tracking-widest">Methode de paiement</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {methodesEnLigne.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, methodePaiement: m.id })}
                      className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                        formData.methodePaiement === m.id
                          ? 'border-brown-dark bg-brown-dark/5 shadow-inner'
                          : 'border-brown-light/10 hover:border-brown-medium'
                      }`}
                    >
                      {m.icon ? (
                        <Image src={m.icon} alt={m.label} width={72} height={72} className="rounded-lg object-contain" />
                      ) : (
                        <span className="text-3xl">💳</span>
                      )}
                      <span className="text-xs font-bold text-brown-dark">{m.label}</span>
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, methodePaiement: 'physique' })}
                  className={`w-full p-5 rounded-2xl border-2 transition-all flex items-center gap-4 ${
                    formData.methodePaiement === 'physique'
                      ? 'border-brown-dark bg-brown-dark/5 shadow-inner'
                      : 'border-brown-light/10 hover:border-brown-medium'
                  }`}
                >
                  <span className="text-3xl">🏦</span>
                  <div className="text-left">
                    <div className="font-bold text-brown-dark">Paiement physique (banque/agence)</div>
                    <div className="text-brown-medium text-xs">Importer un recu scanne</div>
                  </div>
                </button>
              </div>

              {formData.methodePaiement === 'physique' && (
                <div className="space-y-4 p-6 bg-brown-light/10 rounded-3xl border border-dashed border-brown-medium animate-in zoom-in duration-300">
                  <label className="text-sm font-bold text-brown-dark uppercase tracking-widest block mb-2 text-center">Importation du recu</label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*,.pdf"
                  />
                  <div onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center justify-center gap-3 cursor-pointer py-4">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl shadow-lg">
                      {recuFile ? '📄' : '📤'}
                    </div>
                    <p className="text-brown-dark font-bold text-sm">{recuFile ? recuFile.name : 'Cliquer pour choisir un fichier'}</p>
                    <p className="text-[10px] text-brown-medium uppercase font-bold tracking-widest">JPG, PNG ou PDF (max 5 Mo)</p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !formData.methodePaiement || (formData.methodePaiement === 'physique' && !recuFile)}
                className="w-full bg-brown-dark hover:bg-brown-medium disabled:bg-brown-light/50 text-cream font-bold py-5 rounded-3xl transition-all shadow-2xl hover:shadow-brown-dark/20 flex items-center justify-center gap-3"
              >
                {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-cream"></div> : <><span>💳</span> Confirmer le paiement</>}
              </button>
            </form>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] shadow-xl p-8 border border-brown-light/20">
          <h2 className="text-xl font-bold text-brown-dark mb-6 flex items-center gap-3">
            <span className="w-2 h-8 bg-brown-medium rounded-full"></span>
            Mes transactions
          </h2>

          {paiements.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-brown-light/20 rounded-3xl">
              <div className="text-5xl mb-4 opacity-20">💰</div>
              <p className="text-brown-medium font-medium">Aucun paiement enregistre</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {paiements.map((p) => (
                <div key={p.id} className="group p-5 rounded-3xl border border-brown-light/10 hover:border-brown-medium transition-all hover:bg-brown-dark/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-cream rounded-2xl flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform">
                      {p.methodePaiement === 'physique' ? '🏦' : '📱'}
                    </div>
                    <div>
                      <p className="font-bold text-brown-dark capitalize">{p.typePaiement}</p>
                      <p className="text-brown-medium text-xs font-medium">via {p.methodePaiement.replace('_', ' ')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-lg font-black text-brown-dark">{p.montant.toLocaleString()} FCFA</p>
                      <p className="text-[10px] text-brown-medium font-bold uppercase tracking-tighter">{new Date(p.createdAt).toLocaleDateString('fr-FR')}</p>
                    </div>
                    <span className={`px-4 py-2 rounded-2xl text-xs font-bold ${getStatutColor(p.statutPaiement)}`}>
                      {p.statutPaiement === 'valide' ? '✅ Valide' : p.statutPaiement === 'echoue' ? '❌ Echoue' : '⏳ En attente'}
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
