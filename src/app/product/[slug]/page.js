// src/app/product/[slug]/page.js
import { fetchProductBySlug } from '@/lib/api';
import ProductPage from '@/components/ProductPage';

export default async function ProductSlugPage({ params }) {
  const product = await fetchProductBySlug(params.slug);
  if (!product) {
    return <p className="p-8">Produit introuvable</p>;
  }
  return <ProductPage product={product} />;
}
