// src/app/product/[slug]/page.js - VERSION FINALE ET STABLE

import { fetchProductBySlug } from '@/lib/api';
import ProductPage from '@/components/ProductPage';

// On revient à la signature la plus simple et la plus sûre
export default async function ProductSlugPage({ params }) {
  // On extrait le slug sur une ligne séparée. C'est plus clair pour Next.js.
  const slug = params.slug;
  const product = await fetchProductBySlug(slug);
  
  if (!product) {
    return <p className="p-8">Produit introuvable</p>;
  }
  
  return <ProductPage product={product} />;
}