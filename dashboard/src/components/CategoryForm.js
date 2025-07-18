'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Info } from 'lucide-react';
import { fetchCategories, createCategory, updateCategory } from '@/lib/api';

export default function CategoryForm({ category = null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isSubcategory, setIsSubcategory] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parentCategory: null,
  });

  useEffect(() => {
    // Charger les catégories existantes pour le dropdown
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    // Pré-remplir le formulaire si on édite une catégorie
    if (category) {
      setFormData({
        name: category.name || '',
        description: category.description || '',
        parentCategory: category.parentCategory?.id || null,
      });
      setIsSubcategory(!!category.parentCategory);
    }
  }, [category]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSend = {
        name: formData.name,
        description: formData.description,
        parentCategory: isSubcategory ? formData.parentCategory : null,
      };

      if (category) {
        // Modification
        await updateCategory(category.id, dataToSend);
      } else {
        // Création
        await createCategory(dataToSend);
      }

      router.push('/categories');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde de la catégorie');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nom de la catégorie */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Nom de la catégorie *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="Ex: Parfums, Cosmétiques, Accessoires..."
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Description (optionnel)
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="Décrivez brièvement cette catégorie..."
          />
        </div>

        {/* Type de catégorie */}
        <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Type de catégorie</span>
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="categoryType"
                checked={!isSubcategory}
                onChange={() => {
                  setIsSubcategory(false);
                  setFormData({ ...formData, parentCategory: null });
                }}
                className="text-black focus:ring-black"
              />
              <span className="text-sm text-neutral-700">Catégorie principale</span>
            </label>
            <p className="text-xs text-neutral-500 ml-6">Ex: Parfums, Cosmétiques, Accessoires</p>
            
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="categoryType"
                checked={isSubcategory}
                onChange={() => setIsSubcategory(true)}
                className="text-black focus:ring-black"
              />
              <span className="text-sm text-neutral-700">Sous-catégorie</span>
            </label>
            <p className="text-xs text-neutral-500 ml-6">Ex: Parfums Homme, Parfums Femme</p>
          </div>
        </div>

        {/* Sélection de la catégorie parent */}
        {isSubcategory && (
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Catégorie principale *
            </label>
            <select
              value={formData.parentCategory || ''}
              onChange={(e) => setFormData({ ...formData, parentCategory: e.target.value || null })}
              required={isSubcategory}
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            >
              <option value="">Choisir une catégorie principale</option>
              {categories.filter(cat => !cat.parentCategory && cat.id !== category?.id).map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Boutons */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={() => router.push('/categories')}
            className="flex-1 px-4 py-3 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors font-medium"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-3 bg-black text-white rounded-lg hover:bg-neutral-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Sauvegarde...' : (category ? 'Modifier' : 'Créer la catégorie')}
          </button>
        </div>
      </form>
    </div>
  );
}