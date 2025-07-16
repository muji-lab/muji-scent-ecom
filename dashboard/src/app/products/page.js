import { fetchAllProducts } from '@/lib/api';
import Link from 'next/link';
import ProductList from '@/components/ProductList';

export default async function ProductsPage() {
  let products = [];
  try {
    products = await fetchAllProducts();
  } catch (err) {
    return <div className="p-4 text-red-600 bg-red-100 rounded-md">Erreur: Impossible de charger les produits.</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Produits</h1>
        <Link href="/products/new" className="px-4 py-2 bg-black text-white rounded-lg font-semibold text-sm">
          Ajouter un produit
        </Link>
      </div>
      <ProductList initialProducts={products} />
    </div>
  );
}
