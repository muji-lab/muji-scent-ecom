// dashboard/src/lib/api.js - VERSION AVEC LA BONNE TRANSFORMATION

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

// === LA CORRECTION EST ICI ===
// Tes données sont déjà dans le bon format, on n'a pas besoin de les transformer.
// La fonction se contente de retourner l'objet tel quel.
const formatStrapiData = (item) => (item || null);

export async function fetchAllOrders() {
  const response = await fetchStrapi('/orders?sort=createdAt:desc&populate=*');
  // La réponse brute contient un objet { data: [...] }. On ne veut que le tableau.
  if (!response || !response.data) return [];
  // On ne mappe plus avec formatStrapiData, car les données sont déjà bonnes dans `response.data`.
  return response.data;
}

export async function fetchOrderById(customId) {
  if (!customId) return null;
  const path = `/orders?filters[customOrderId][$eq]=${customId}&populate=*`;
  const response = await fetchStrapi(path);
  
  if (!response || !response.data || response.data.length === 0) return null;
  // On retourne directement le premier élément du tableau.
  return response.data[0];
}