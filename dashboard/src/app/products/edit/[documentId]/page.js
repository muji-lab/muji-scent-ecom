import ProductForm          from '@/components/ProductForm';
import { fetchProductById } from '@/lib/api';
import Link                 from 'next/link';
import { ArrowLeft }        from 'lucide-react';

export default async function EditProduct({ params: { documentId } }) {
  const product = await fetchProductById(documentId);

  if (!product) {
    return <div className="p-4 text-red-600">Produit introuvable.</div>;
  }

  return (
    <div className="max-w-xl mx-auto">
      <Link href="/products" className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-800 mb-4">
        <ArrowLeft size={16} /> Retour à la liste
      </Link>
      <h1 className="text-2xl font-bold mb-6">Éditer : {product.title}</h1>
      <ProductForm initial={product} />
    </div>
  );
}
