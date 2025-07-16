import ProductForm from '@/components/ProductForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NewProduct() {
  return (
    <div className="max-w-xl mx-auto">
     <Link href="/products" className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-800 mb-4">
        <ArrowLeft size={16} /> Retour à la liste
      </Link>
      <h1 className="text-2xl font-bold mb-6">Nouveau produit</h1>
      <ProductForm />
    </div>
  );
}
