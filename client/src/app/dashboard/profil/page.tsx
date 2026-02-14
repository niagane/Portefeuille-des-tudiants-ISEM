'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

export default function ProfilPage() {
  const { etudiant, logout } = useAuth();
  const router = useRouter();

  if (!etudiant) return null;

  const infos = [
    { label: 'Matricule', value: etudiant.matricule, icon: '🎓' },
    { label: 'Nom complet', value: `${etudiant.prenom} ${etudiant.nom}`, icon: '👤' },
    { label: 'Email', value: etudiant.email, icon: '📧' },
    { label: 'Téléphone', value: etudiant.telephone || 'Non renseigné', icon: '📱' },
    { label: 'Filière', value: etudiant.filiere, icon: '📚' },
    { label: 'Niveau', value: etudiant.niveau, icon: '📊' },
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
            <h1 className="text-2xl font-bold tracking-tight">Mon Profil</h1>
          </div>
          <div className="w-10 h-10 bg-cream rounded-full flex items-center justify-center text-xl shadow-lg">
            👤
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 border border-brown-light/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brown-dark/5 rounded-bl-[4rem]"></div>
          
          <div className="flex flex-col md:flex-row items-center gap-8 mb-10 relative z-10">
            <div className="w-24 h-24 bg-cream rounded-[2rem] flex items-center justify-center text-5xl shadow-inner border border-brown-light/20">
              👨‍🎓
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-black text-brown-dark">
                {etudiant.prenom} {etudiant.nom}
              </h2>
              <p className="text-brown-medium font-bold uppercase tracking-widest text-xs mt-1">{etudiant.matricule}</p>
              <div className="flex justify-center md:justify-start gap-2 mt-3">
                <span className="bg-brown-dark text-cream text-[10px] font-bold px-4 py-1.5 rounded-full shadow-md">
                  {etudiant.filiere}
                </span>
                <span className="bg-brown-light/30 text-brown-dark text-[10px] font-bold px-4 py-1.5 rounded-full border border-brown-light/20">
                  {etudiant.niveau}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
            {infos.map((info) => (
              <div key={info.label} className="group flex items-center gap-4 p-5 bg-cream/30 rounded-[1.5rem] border border-brown-light/10 hover:border-brown-medium transition-all">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform">
                  {info.icon}
                </div>
                <div>
                  <p className="text-[10px] font-black text-brown-medium uppercase tracking-widest">{info.label}</p>
                  <p className="font-bold text-brown-dark break-all">{info.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => { logout(); router.push('/login'); }}
          className="w-full bg-white border-2 border-red-100 hover:bg-red-50 text-red-600 font-black py-5 rounded-[2rem] transition-all shadow-lg active:scale-95 flex items-center justify-center gap-3"
        >
          <span>🚪</span> SE DÉCONNECTER
        </button>
      </div>
    </div>
  );
}
