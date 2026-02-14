'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { getTd, normalizeNiveau } from '@/lib/academic-data';

export default function TdPage() {
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
  const tds = getTd(niveau, etudiant.filiere);

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-brown-dark text-cream px-4 py-6 shadow-xl">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="w-10 h-10 bg-brown-medium rounded-full flex items-center justify-center hover:bg-brown-light transition-colors">←</Link>
            <h1 className="text-2xl font-bold">Travaux Diriges (TD)</h1>
          </div>
          <span className="px-4 py-1 bg-brown-medium rounded-full text-xs font-bold uppercase">{niveau}</span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto p-6 space-y-4">
        {tds.map((item) => (
          <article key={`${item.module}-${item.groupe}`} className="bg-white rounded-3xl border border-brown-light/20 shadow-lg p-6">
            <h2 className="text-lg font-black text-brown-dark">{item.module}</h2>
            <div className="mt-3 grid sm:grid-cols-3 gap-3 text-sm">
              <p className="text-brown-medium">Groupe: <span className="font-semibold text-brown-dark">{item.groupe}</span></p>
              <p className="text-brown-medium">Encadrant: <span className="font-semibold text-brown-dark">{item.encadrant}</span></p>
              <p className="text-brown-medium">Salle: <span className="font-semibold text-brown-dark">{item.salle}</span></p>
            </div>
            {item.pdfUrl && (
              <a
                href={item.pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex mt-4 px-4 py-2 rounded-xl bg-brown-dark text-cream text-xs font-bold hover:bg-brown-medium transition-colors"
              >
                Telecharger le PDF TD
              </a>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
