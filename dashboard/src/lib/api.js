// dashboard/src/lib/api.js - COMPLET AVEC GESTION PRODUITS

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

async function fetchStrapi(path) {
  if (!STRAPI_API_TOKEN) {
    console.error("ERREUR: STRAPI_API_TOKEN n'est pas défini.");
    throw new Error("Token d'API Strapi non configuré.");
  }
  const requestUrl = `${STRAPI_URL}/api${path}`;
  try {
    const response = await fetch(requestUrl, {
      method: 'GET',
      headers: { Authorization: `Bearer ${STRAPI_API_TOKEN}` },
      cache: 'no-store',
    });
    if (!response.ok) {
      throw new Error(`Erreur Strapi: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    throw error;
  }
}

const formatStrapiData = (item) => (item || null);

export async function fetchAllOrders({ query, filters = {} }) {
  let path = '/orders?sort=createdAt:desc&populate=*';
  if (query) {
    const searchQuery = `&filters[$or][0][firstName][$containsi]=${query}` + `&filters[$or][1][lastName][$containsi]=${query}` + `&filters[$or][2][customerEmail][$containsi]=${query}` + `&filters[$or][3][customOrderId][$containsi]=${query}`;
    path += searchQuery;
  }
  Object.entries(filters).forEach(([key, value]) => {
    if (value) { path += `&filters[${key}][$eq]=${value}`; }
  });
  const response = await fetchStrapi(path);
  return response?.data || [];
}

export async function fetchOrderById(customId) {
  if (!customId) return null;
  const path = `/orders?filters[customOrderId][$eq]=${customId}&populate=*`;
  const response = await fetchStrapi(path);
  return response?.data?.[0] ? formatStrapiData(response.data[0]) : null;
}

export async function fetchTodaysOrders() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isoDate = today.toISOString();
  const path = `/orders?filters[createdAt][$gte]=${isoDate}&populate=*`;
  const response = await fetchStrapi(path);
  return response?.data || [];
}

export async function fetchOrdersToShip(limit = 5) {
  const path = `/orders?filters[orderStatus][$eq]=new&sort=createdAt:asc&pagination[limit]=${limit}&populate=*`;
  const response = await fetchStrapi(path);
  return response?.data || [];
}

// dashboard/src/lib/api.js
export async function fetchAllProducts() {
  const path = "/products?populate[variants][populate][image]=true";
  const res  = await fetchStrapi(path);

  const products = (res?.data || []).map((p) => {
    const a = p.attributes || p;

    const rawVariants = Array.isArray(a.variants)
      ? a.variants
      : Array.isArray(a.variants?.data)
      ? a.variants.data
      : [];

    const variants = rawVariants.map((v) => {
      const va = v.attributes || v;
      // première image
      let imgUrl = null;
      if (va.image) {
        const imgs = Array.isArray(va.image?.data ?? va.image)
          ? (va.image.data || va.image)
          : [va.image.data];
        imgUrl = imgs[0]?.attributes?.url || imgs[0]?.url || null;
      }
      return {
        id   : v.id || va.id,
        label: va.label,
        price: va.price,
        stock: va.stock,
        image: imgUrl,
      };
    });

    const total = variants.reduce((s, v) => s + (v.stock ?? 0), 0);

    return {
      id    : p.id,
      documentId: a.documentId,
      title : a.title,
      slug  : a.slug,
      customProductId: a.customProductId,
      stock : total,         // <—
      variants,
      description: a.description,   // pour la page produit
    };
  });

  return products;
}



const API_TOKEN   = process.env.STRAPI_API_TOKEN;

const headers = { Authorization: `Bearer ${API_TOKEN}` };

// ---------- CRUD PRODUIT ----------
export async function createProduct(payload /* JS object */) {
  const res = await fetch(`${STRAPI_URL}/api/products`, {
    method : 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body   : JSON.stringify({ data: payload }),
  });
 if (!res.ok) {
  const msg = await res.text();       // ↩  affiche vraiment la réponse
   console.error('STRAPI ERROR:', msg);
   throw new Error(msg);
 }  return res.json();
}

export async function updateProduct(id, payload) {
  const res = await fetch(`${STRAPI_URL}/api/products/${id}`, {
    method : 'PUT',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body   : JSON.stringify({ data: payload }),
  });
  if (!res.ok) throw new Error('Mise à jour impossible');
  return res.json();
}

export async function deleteProduct(id) {
  const res = await fetch(`${STRAPI_URL}/api/products/${id}`, {
    method : 'DELETE',
    headers,
  });
  if (!res.ok) throw new Error('Suppression impossible');
}


// ------------------------------------------------------------------
// Récupère un produit par documentId, avec variantes + images
// ------------------------------------------------------------------
export async function fetchProductById(documentId) {
  if (!documentId) return null;
  const res = await fetchStrapi(
    `/products/${documentId}?populate[variants][populate][image]=true`
  );
  const p = res?.data;
  if (!p) return null;

  const a = p.attributes || p;

  // Conversion Blocks -> TipTap pour pré‑remplir l’éditeur
const blocksToTipTap = (blocks = []) => ({
  type   : 'doc',
  content: blocks.map((p) => ({
    type   : 'paragraph',
    content: (p.children || []).map((leaf) => ({
      type :'text',
      text : leaf.text || '',
      marks: [
        ...(leaf.bold   ? [{ type:'bold'   }] : []),
        ...(leaf.italic ? [{ type:'italic' }] : []),
      ],
    })),
  })),
});


  return {
    documentId      : a.documentId,
    title           : a.title,
    slug            : a.slug,
    customProductId : a.customProductId,
    description     : blocksToTipTap(a.description),
    variants        : (a.variants || []).map((v) => ({
      id    : v.id,
      label : v.label,
      price : v.price,
      stock : v.stock,
      images: (v.image || []).map((img) => ({ id: img.id, url: img.url })),
    })),
  };
}
