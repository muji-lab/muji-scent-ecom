'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

const getStrapiImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
  return `${strapiUrl}${url}`;
};

function StockBadge({ stock }) {
  const stockLevel = stock || 0;
  let colors = 'bg-red-100 text-red-700'; // Rupture
  if (stockLevel > 10) {
    colors = 'bg-green-100 text-green-700'; // En stock
  } else if (stockLevel > 0) {
    colors = 'bg-yellow-100 text-yellow-700'; // Stock faible
  }
  
  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colors}`}>
      {stockLevel > 0 ? `${stockLevel} en stock` : 'Rupture'}
    </span>
  );
}

export default function ProductList({ initialProducts }) {
  const [products, setProducts] = useState(initialProducts);
  const router = useRouter();

  const handleDelete = async (documentId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;

    try {
      const res = await fetch('/api/strapi/products', {
   method :'DELETE',
   headers: { 'Content-Type':'application/json' },
   body   : JSON.stringify({ documentId }),
 });

 if (!res.ok) throw new Error('Échec de la suppression');


      setProducts(products.filter(p => p.documentId !== documentId));
      router.refresh();
    } catch (err) {
      console.error(err);
      alert(`Erreur lors de la suppression : ${err.message}`);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="border-b bg-neutral-50">
          <tr>
            <th className="p-4 font-semibold text-neutral-600">Produit</th>
            <th className="p-4 font-semibold text-neutral-600">Variantes</th>
            <th className="p-4 font-semibold text-neutral-600">Stock</th>
            <th className="p-4 font-semibold text-neutral-600 text-right">Prix (à partir de)</th>
            <th className="p-4 font-semibold text-neutral-600 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map(product => {
              const firstVariant = product.variants?.[0];
              const imageUrl = getStrapiImageUrl(firstVariant?.image);
              const price = firstVariant?.price;

              return (
                <tr key={product.id} className="border-b last:border-b-0 hover:bg-neutral-50">
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-md bg-neutral-100 border relative shrink-0">
                        {imageUrl && <Image src={imageUrl} alt={product.title} fill className="object-contain p-1" sizes="48px" />}
                      </div>
                      <div>
                        <p className="font-semibold">{product.title}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-neutral-600">
                    {product.variants?.map(v => v.label).join(', ') || 'N/A'}
                  </td>
                  <td className="p-4"><StockBadge stock={product.stock} /></td>
                  <td className="p-4 text-right font-semibold">{price ? `${price.toFixed(2)} €` : 'N/A'}</td>
                  <td className="p-4 text-center">
                    <Link href={`/products/edit/${product.documentId}`} className="text-blue-600 hover:underline mr-4">
                      Éditer
                    </Link>
                    <button onClick={() => handleDelete(product.documentId)} className="text-red-600 hover:underline">
                      Supprimer
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr><td colSpan="5" className="text-center text-neutral-500 py-12">Aucun produit trouvé.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
