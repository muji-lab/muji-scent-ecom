// src/lib/api.js - VERSION CORRIGÉE POUR STRUCTURE PLATE

function getStrapiURL(path = '') {
  return `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${path}`;
}

async function fetchStrapi(path, urlParamsStr = '') {
  const populateParams = 'populate[variants][populate]=image';
  const finalUrlParams = urlParamsStr
    ? `${urlParamsStr}&${populateParams}`
    : `?${populateParams}`;
  
  const requestUrl = getStrapiURL(`/api${path}${finalUrlParams}`);

  try {
    const response = await fetch(requestUrl);
    if (!response.ok) {
      console.error('Erreur Strapi:', response.status, await response.text());
      throw new Error(`Erreur lors de l'appel à l'API Strapi`);
    }
    return response.json();
  } catch (error) {
    console.error('Impossible de contacter Strapi:', error);
    return { data: [] };
  }
}

function formatProduct(item) {
  // CORRECTION : L'objet 'item' est maintenant directement le produit, il n'y a plus de clé "attributes".
  
  if (!item?.variants || item.variants.length === 0) {
    return null;
  }

  // On destructure directement depuis 'item'.
  const { id, slug, title, description, stock, variants } = item;

  const allImageUrls = variants.flatMap(v => 
    (v.image || []).map(img => getStrapiURL(img.url))
  );
  const uniqueImageUrls = [...new Set(allImageUrls)];
  
  return {
    id:          id,
    slug:        slug,
    title:       title,
    description: description,
    stock:       stock,
    sizes:       variants.map(v => ({ label: v.label, price: v.price })),
    images:      uniqueImageUrls,
    price:       variants[0].price,
  };
}

export async function fetchAllProducts() {
  const json = await fetchStrapi('/products', '?pagination[pageSize]=100');
  
  if (!Array.isArray(json.data)) {
    return [];
  }

  // CORRECTION : On passe chaque 'item' directement à formatProduct.
  return json.data.map(formatProduct).filter(Boolean);
}

export async function fetchProductBySlug(slug) {
  const json = await fetchStrapi(
    '/products',
    `?filters[slug][$eq]=${encodeURIComponent(slug)}`
  );

  const item = json.data?.[0];
  if (!item) return null;
  
  // CORRECTION : On passe l'item' directement à formatProduct.
  return formatProduct(item);
}