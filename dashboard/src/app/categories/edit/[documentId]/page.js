import { fetchCategoryById } from '@/lib/api';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import CategoryForm from '@/components/CategoryForm';

export default async function EditCategory({ params }) {
  const { documentId } = await params;
  
  let category = null;
  try {
    category = await fetchCategoryById(documentId);
  } catch (error) {
    console.error('Erreur lors du chargement de la catégorie:', error);
  }

  if (!category) {
    return (
      <div className="max-w-xl mx-auto">
        <Link href="/categories" className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-800 mb-4">
          <ArrowLeft size={16} /> Retour à la liste
        </Link>
        <div className="p-4 text-red-600 bg-red-100 rounded-md">
          Catégorie non trouvée.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <Link href="/categories" className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-800 mb-4">
        <ArrowLeft size={16} /> Retour à la liste
      </Link>
      <h1 className="text-2xl font-bold mb-6">Modifier la catégorie</h1>
      <CategoryForm category={category} />
    </div>
  );
}