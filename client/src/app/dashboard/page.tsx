'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { normalizeNiveau } from '@/lib/academic-data';

export default function DashboardPage() {
  const { etudiant, logout, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !etudiant) {
      router.push('/login');
    }
  }, [etudiant, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brown-dark"></div>
      </div>
    );
  }

  if (!etudiant) return null;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const menuItems = [
    {
      title: 'Inscription',
      icon: '📝',
      description: 'Fiche pedagogique ISEM',
      href: '/dashboard/inscription',
      color: 'bg-brown-dark'
    },
    {
      title: 'Cours',
      icon: '📘',
      description: 'Liste des cours par niveau',
      href: '/dashboard/cours',
      color: 'bg-brown-medium'
    },
    {
      title: 'TD',
      icon: '📗',
      description: 'Travaux diriges et groupes',
      href: '/dashboard/td',
      color: 'bg-accent'
    },
    {
      title: 'Emploi du temps',
      icon: '🗓️',
      description: 'Planning hebdomadaire',
      href: '/dashboard/emploi-du-temps',
      color: 'bg-brown-dark'
    },
    {
      title: 'Paiements',
      icon: '💳',
      description: 'En ligne et import recu',
      href: '/dashboard/paiement',
      color: 'bg-brown-medium'
    },
    {
      title: 'Reclamations',
      icon: '📣',
      description: 'Suivi des requetes',
      href: '/dashboard/reclamation',
      color: 'bg-accent'
    },
    {
      title: 'Justificatifs',
      icon: '📄',
      description: 'Absences et certificats',
      href: '/dashboard/justificatif',
      color: 'bg-brown-dark'
    },
    {
      title: 'Mon Profil',
      icon: '👤',
      description: 'Infos academiques',
      href: '/dashboard/profil',
      color: 'bg-brown-medium'
    }
  ];

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-brown-dark text-cream shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brown-medium opacity-20 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between relative z-10 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-cream rounded-2xl flex items-center justify-center text-2xl shadow-lg">🎓</div>
            <div>
              <h1 className="font-black text-xl tracking-tight">Portefeuille Etudiants ISEM UGB</h1>
              <p className="text-brown-light text-[10px] font-bold uppercase tracking-widest">Universite Gaston Berger</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="bg-brown-medium hover:bg-brown-light px-6 py-2 rounded-full text-xs font-bold transition-all shadow-lg active:scale-95">
            DECONNEXION
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 mb-10 border border-brown-light/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-full bg-brown-dark/5 -skew-x-12 translate-x-16 group-hover:translate-x-12 transition-transform duration-700"></div>
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="w-24 h-24 bg-cream rounded-[2rem] flex items-center justify-center text-5xl shadow-inner border border-brown-light/20">👨‍🎓</div>
            <div className="text-center md:text-left flex-1">
              <p className="text-brown-medium font-bold text-xs uppercase tracking-[0.2em] mb-1">Espace Etudiant</p>
              <h2 className="text-3xl font-black text-brown-dark mb-2">Bienvenue, {etudiant.prenom} !</h2>
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <span className="bg-brown-dark text-cream text-[10px] font-bold px-4 py-1.5 rounded-full shadow-md">{etudiant.matricule}</span>
                <span className="bg-brown-light/30 text-brown-dark text-[10px] font-bold px-4 py-1.5 rounded-full border border-brown-light/20">{etudiant.filiere}</span>
                <span className="bg-cream text-brown-dark text-[10px] font-bold px-4 py-1.5 rounded-full border border-brown-light/20">{normalizeNiveau(etudiant.niveau)}</span>
              </div>
            </div>
            <div className="hidden lg:block bg-brown-dark/5 p-4 rounded-3xl border border-brown-light/10">
              <p className="text-[10px] font-black text-brown-medium uppercase tracking-widest mb-1">Statut Annee</p>
              <p className="text-sm font-bold text-brown-dark">2025-2026 : <span className="text-green-600">En cours</span></p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-black text-brown-dark flex items-center gap-3">
            <span className="w-2 h-6 bg-brown-medium rounded-full"></span>
            Services Academiques
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <Link key={item.title} href={item.href} className="group">
              <div className="bg-white rounded-[2rem] shadow-xl hover:shadow-brown-dark/10 transition-all duration-500 hover:-translate-y-2 cursor-pointer p-8 border border-brown-light/10 relative overflow-hidden h-full">
                <div className={`absolute top-0 right-0 w-24 h-24 ${item.color} opacity-[0.03] rounded-bl-[4rem] group-hover:opacity-[0.08] transition-opacity`}></div>
                <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                  {item.icon}
                </div>
                <h4 className="font-black text-brown-dark text-lg mb-2 group-hover:text-brown-medium transition-colors">{item.title}</h4>
                <p className="text-brown-medium text-sm font-medium leading-relaxed">{item.description}</p>
                <div className="mt-6 flex items-center text-xs font-bold text-brown-dark opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
                  ACCEDER →
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 bg-brown-dark rounded-[2rem] p-8 text-cream relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-brown-medium/20 to-transparent"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
            <div className="text-4xl animate-pulse">📢</div>
            <div className="flex-1 text-center md:text-left">
              <h4 className="font-black text-lg mb-1 uppercase tracking-wider">Avis Important</h4>
              <p className="text-brown-light text-sm font-medium">
                Les inscriptions pedagogiques pour le semestre 2 sont ouvertes. Assurez-vous de valider votre fiche avant le <span className="text-cream font-bold underline">28 fevrier 2026</span>.
              </p>
            </div>
            <Link href="/dashboard/inscription" className="bg-cream text-brown-dark px-8 py-3 rounded-2xl font-black text-xs hover:bg-brown-light transition-all active:scale-95 shadow-xl">
              S INSCRIRE MAINTENANT
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
