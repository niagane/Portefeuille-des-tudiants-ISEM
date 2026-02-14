'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { getCourses, normalizeNiveau } from '@/lib/academic-data';

export default function CoursPage() {
  const { etudiant, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !etudiant) {
      router.push('/login');
    }
  }, [isLoading, etudiant, router]);

  if (isLoading || !etudiant) {
    return <div className="min-h-screen bg-cream" />;
  }

  const niveau = normalizeNiveau(etudiant.niveau);
  const cours = getCourses(niveau, etudiant.filiere);

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-brown-dark text-cream px-4 py-6 shadow-xl">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="w-10 h-10 bg-brown-medium rounded-full flex items-center justify-center hover:bg-brown-light transition-colors">←</Link>
            <h1 className="text-2xl font-bold">Cours</h1>
          </div>
          <span className="px-4 py-1 bg-brown-medium rounded-full text-xs font-bold uppercase">{niveau}</span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {cours.map((item) => (
          <article key={item.module} className="bg-white rounded-3xl border border-brown-light/20 shadow-lg p-6">
            <p className="text-xs font-bold uppercase text-brown-medium tracking-widest">Module</p>
            <h2 className="text-lg font-black text-brown-dark mt-1">{item.module}</h2>
            <p className="text-sm text-brown-medium mt-3">Enseignant: <span className="font-semibold text-brown-dark">{item.enseignant}</span></p>
            <p className="text-sm text-brown-medium">Credits: <span className="font-semibold text-brown-dark">{item.credits}</span></p>
            <p className="text-sm text-brown-medium">Salle: <span className="font-semibold text-brown-dark">{item.salle}</span></p>
            {item.pdfUrl && (
              <a
                href={item.pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex mt-4 px-4 py-2 rounded-xl bg-brown-dark text-cream text-xs font-bold hover:bg-brown-medium transition-colors"
              >
                Telecharger le PDF
              </a>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
