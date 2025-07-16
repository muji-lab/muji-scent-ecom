'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';

export default function SettingsPage() {
  const [orphans, setOrphans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deletedCount, setDeletedCount] = useState(0);

  const handleDryRun = async () => {
    setDeletedCount(0);
    setLoading(true);
    try {
      const res  = await fetch('/api/strapi/find-orphan-images');
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setOrphans(data);
    } catch (e) {
      alert("Impossible de récupérer les images orphelines : " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (orphans.length === 0) return;
    if (!confirm(`Êtes-vous sûr de vouloir supprimer définitivement ${orphans.length} image(s) ? Cette action est irréversible.`)) {
      return;
    }

    setDeleting(true);
    try {
      const idsToDelete = orphans.map(img => img.id);
      const res = await fetch('/api/strapi/delete-orphan-images', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: idsToDelete }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Une erreur est survenue lors de la suppression.');
      }
      
      setDeletedCount(result.deletedCount || 0);
      setOrphans([]); // Clear the list after deletion

    } catch (e) {
      alert("Erreur lors de la suppression : " + e.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Paramètres</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Bloc Nettoyage */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="font-semibold text-lg mb-2 flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-red-500" />
            Nettoyage des images orphelines
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Identifie les médias dans Strapi sans aucune utilisation.
          </p>

          <button
            onClick={handleDryRun}
            disabled={loading || deleting}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {loading ? 'Recherche...' : '🕵️‍♀️ Trouver les images orphelines'}
          </button>

          {deleting && (
            <p className="text-sm text-yellow-600 mt-4">Suppression en cours...</p>
          )}

          {deletedCount > 0 && (
             <p className="text-sm text-green-600 mt-4">{deletedCount} image(s) supprimée(s) avec succès !</p>
          )}

          {orphans.length > 0 && !deleting && (
            <div className="mt-4 border-t pt-4">
              <h3 className="font-medium text-sm mb-2">
                {orphans.length} image(s) orpheline(s) trouvée(s) :
              </h3>
              <ul className="max-h-64 overflow-auto text-sm text-gray-700 space-y-2">
                {orphans.map((img) => (
                  <li key={img.name} className="flex items-center gap-2">
                    <img
                      src={img.url}
                      alt={img.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                    <a href={img.url} target="_blank" rel="noopener noreferrer" className="truncate hover:underline">{img.name}</a>
                  </li>
                ))}
              </ul>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="mt-4 w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition disabled:bg-gray-400"
              >
                <Trash2 className="inline w-4 h-4 mr-2" />
                Supprimer les {orphans.length} images
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
