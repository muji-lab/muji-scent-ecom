// dashboard/src/components/SearchInput.js - VERSION UX AMÉLIORÉE

'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Search, X as XIcon } from 'lucide-react'; // On importe l'icône X

export default function SearchInput() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const currentQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(currentQuery);

  // Synchronise l'état interne si l'URL change (ex: bouton retour du navigateur)
  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set('q', query);
    } else {
      params.delete('q');
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleReset = () => {
    setQuery(''); // On vide le champ de recherche
    const params = new URLSearchParams(searchParams);
    params.delete('q'); // On retire le paramètre 'q' de l'URL
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="mb-6 flex items-center gap-2">
      <div className="relative flex-grow">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Chercher par nom, e-mail, n° de commande..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
      </div>
      
      {/* === BOUTON DE RECHERCHE === */}
      <button 
        type="submit"
        className="px-4 py-2 bg-black text-white rounded-lg font-semibold text-sm hover:bg-neutral-800 transition-colors"
      >
        Rechercher
      </button>

      {/* === BOUTON DE RÉINITIALISATION === */}
      {/* S'affiche uniquement si une recherche est active */}
      {currentQuery && (
        <button 
          type="button"
          onClick={handleReset}
          className="p-2 text-neutral-500 rounded-lg hover:bg-neutral-200 hover:text-neutral-800 transition-colors"
          title="Réinitialiser la recherche"
        >
          <XIcon className="h-5 w-5 text-black" />
        </button>
      )}
    </form>
  );
}