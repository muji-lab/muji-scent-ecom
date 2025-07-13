// src/lib/api.js
const API_URL = process.env.STRAPI_URL || 'http://localhost:1337';

async function fetchStrapi(path) {
  // On ajoute &populate=image puisqu'on passe déjà un '?' dans path
  const res = await fetch(`${API_URL}${path}&populate=image`);
  if (!res.ok) throw new Error(`Strapi error ${res.status}`);
  return res.json();
}

export async function fetchAllProducts() {
  const json = await fetchStrapi('/api/products?pagination[pageSize]=100');
  return (json.data || []).map(item => ({
    id:          item.id,
    slug:        item.slug,
    title:       item.title,
    price:       item.price,
    // on garde l'UI telle quelle en passant un tableau de tailles
    sizes:       [{ label: item.size, price: item.price }],
    // ici on préfixe chaque URL par API_URL pour obtenir un chemin absolu
    images:      item.image.map(img => `${API_URL}${img.url}`),
    description: item.description,
    stock:       item.stock,
  }));
}

export async function fetchProductBySlug(slugParam) {
  const json = await fetchStrapi(
    `/api/products?filters[slug][$eq]=${encodeURIComponent(slugParam)}`
  );
  const item = json.data?.[0];
  if (!item) return null;
  return {
    id:          item.id,
    slug:        item.slug,
    title:       item.title,
    price:       item.price,
    sizes:       [{ label: item.size, price: item.price }],
    images:      item.image.map(img => `${API_URL}${img.url}`),
    description: item.description,
    stock:       item.stock,
  };
}
