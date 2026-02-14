'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { getSchedule, normalizeNiveau } from '@/lib/academic-data';

export default function EmploiDuTempsPage() {
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
  const planning = getSchedule(niveau, etudiant.filiere);

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-brown-dark text-cream px-4 py-6 shadow-xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="w-10 h-10 bg-brown-medium rounded-full flex items-center justify-center hover:bg-brown-light transition-colors">←</Link>
            <h1 className="text-2xl font-bold">Emploi du temps hebdomadaire</h1>
          </div>
          <span className="px-4 py-1 bg-brown-medium rounded-full text-xs font-bold uppercase">{niveau}</span>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-3xl border border-brown-light/20 shadow-xl overflow-x-auto">
          <table className="w-full min-w-[860px]">
            <thead className="bg-brown-dark text-cream">
              <tr>
                <th className="text-left p-4 text-sm">Heure</th>
                <th className="text-left p-4 text-sm">Lundi</th>
                <th className="text-left p-4 text-sm">Mardi</th>
                <th className="text-left p-4 text-sm">Mercredi</th>
                <th className="text-left p-4 text-sm">Jeudi</th>
                <th className="text-left p-4 text-sm">Vendredi</th>
              </tr>
            </thead>
            <tbody>
              {planning.map((slot) => (
                <tr key={slot.heure} className="border-t border-brown-light/20 text-sm">
                  <td className="p-4 font-bold text-brown-dark">{slot.heure}</td>
                  <td className="p-4 text-brown-medium">{slot.lundi}</td>
                  <td className="p-4 text-brown-medium">{slot.mardi}</td>
                  <td className="p-4 text-brown-medium">{slot.mercredi}</td>
                  <td className="p-4 text-brown-medium">{slot.jeudi}</td>
                  <td className="p-4 text-brown-medium">{slot.vendredi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
