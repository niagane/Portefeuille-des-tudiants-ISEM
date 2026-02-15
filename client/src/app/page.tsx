'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { etudiant, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && etudiant) {
      router.push('/dashboard');
    }
  }, [etudiant, isLoading, router]);

  return (
    <div className="min-h-screen bg-cream overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brown-light opacity-20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-brown-medium opacity-10 rounded-full blur-3xl"></div>

      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center p-6 md:px-12">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-brown-dark rounded-xl flex items-center justify-center text-cream font-bold text-xl shadow-lg">U</div>
          <span className="text-2xl font-bold text-brown-dark tracking-tighter">Portefeuille Étudiants <span className="text-brown-medium">ISEM UGB</span></span>
        </div>
        <div className="flex gap-4">
          <Link href="/login" className="px-6 py-2 text-brown-dark font-medium hover:text-brown-medium transition-colors">
            Connexion
          </Link>
          <Link href="/register" className="px-6 py-2 bg-brown-dark text-cream rounded-full font-medium hover:bg-brown-medium transition-all shadow-lg hover:shadow-brown-dark/20">
            S'inscrire
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 container mx-auto px-6 pt-12 md:pt-24 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 text-center md:text-left">
          <div className="inline-block px-4 py-1 bg-brown-light/30 text-brown-dark rounded-full text-sm font-semibold mb-6 animate-bounce">
            Nouvelle Plateforme ISEM 2.0 🚀
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-brown-dark leading-tight mb-6">
            L'Avenir de votre <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brown-dark to-brown-medium">Parcours Académique</span>
          </h1>
          <p className="text-lg text-brown-dark/70 mb-10 max-w-xl">
            Gérez vos inscriptions, vos paiements et vos réclamations en un clic. Une expérience fluide, sécurisée et futuriste conçue pour les étudiants de l'UGB.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link href="/register" className="px-8 py-4 bg-brown-dark text-cream rounded-2xl font-bold text-lg hover:bg-brown-medium transition-all shadow-xl hover:scale-105">
              Commencer maintenant
            </Link>
            <div className="flex items-center gap-4 px-6 py-4 bg-white/50 backdrop-blur-md rounded-2xl border border-brown-light/20">
              <div className="flex -space-x-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full bg-brown-light border-2 border-cream flex items-center justify-center text-[10px] font-bold">U{i}</div>
                ))}
              </div>
              <span className="text-sm font-medium text-brown-dark">+2000 étudiants inscrits</span>
            </div>
          </div>
        </div>

        <div className="flex-1 relative">
          {/* Futuristic Visual Element */}
          <div className="relative w-full aspect-square max-w-md mx-auto">
            <div className="absolute inset-0 bg-brown-dark rounded-[3rem] rotate-6 opacity-10"></div>
            <div className="absolute inset-0 bg-brown-medium rounded-[3rem] -rotate-3 opacity-10"></div>
            <div className="relative h-full w-full bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-brown-light/20 flex items-center justify-center group">
              {/* Dynamic Image Placeholder */}
              <div className="absolute inset-0 bg-gradient-to-br from-brown-light/20 to-transparent"></div>
              <div className="text-8xl group-hover:scale-110 transition-transform duration-500">🎓</div>
              
              {/* Floating UI Elements */}
              <div className="absolute top-10 right-[-20px] bg-white p-4 rounded-2xl shadow-xl border border-brown-light/10 animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs">✓</div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Paiement</p>
                    <p className="text-sm font-bold text-brown-dark">Validé avec succès</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-10 left-[-20px] bg-white p-4 rounded-2xl shadow-xl border border-brown-light/10 animate-float-delayed">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-brown-light text-brown-dark rounded-full flex items-center justify-center text-xs">📝</div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Inscription</p>
                    <p className="text-sm font-bold text-brown-dark">Pédagogique active</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer / Stats */}
      <footer className="relative z-10 mt-20 border-t border-brown-light/20 py-10">
        <div className="container mx-auto px-6 flex flex-wrap justify-center gap-12 md:gap-24">
          <div className="text-center">
            <p className="text-4xl font-black text-brown-dark">100%</p>
            <p className="text-sm text-brown-medium font-bold uppercase tracking-widest">Numérique</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-black text-brown-dark">24/7</p>
            <p className="text-sm text-brown-medium font-bold uppercase tracking-widest">Disponibilité</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-black text-brown-dark">ISEM</p>
            <p className="text-sm text-brown-medium font-bold uppercase tracking-widest">Excellence</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(20px); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 5s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
