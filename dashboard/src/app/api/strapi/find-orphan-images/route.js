// src/app/api/strapi/find-orphan-images/route.js
import { NextResponse } from 'next/server';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;
const HEADERS = {
  Authorization: `Bearer ${STRAPI_TOKEN}`,
  'Content-Type': 'application/json',
};

export async function GET() {
  try {
    // 1. Fetch all files from the Strapi media library
    const allFilesRes = await fetch(`${STRAPI_URL}/api/upload/files`, { headers: HEADERS });
    if (!allFilesRes.ok) {
      throw new Error(`Strapi 'upload/files' responded with ${allFilesRes.status}`);
    }
    const allFiles = await allFilesRes.json();
    const allImages = allFiles.filter(file => file.mime.startsWith('image/'));

    // 2. Fetch all content types that might contain media.
    // For now, we focus on products, but this could be expanded.
    const productsRes = await fetch(`${STRAPI_URL}/api/products?populate=*`, { headers: HEADERS });
    if (!productsRes.ok) {
      const errorBody = await productsRes.text();
      console.error("Strapi Error Body:", errorBody);
      throw new Error(`Strapi 'products' responded with ${productsRes.status}`);
    }
    const productsData = await productsRes.json();
    
    // 3. Create a single large string containing all populated product data.
    // Using `populate=*` is a less aggressive version of `deep` and should be supported.
    // It populates the first level of relations, which is where media usually is.
    const contentString = JSON.stringify(productsData.data);

    // 4. Extract all unique media IDs found in the stringified content.
    // This regex looks for any number that follows a key like "id":, "ID": etc.,
    // which is a reliable way to find all referenced media IDs in the JSON response.
    const usedMediaIds = new Set();
    const idRegex = /"id"\s*:\s*(\d+)/g;
    let match;
    while ((match = idRegex.exec(contentString)) !== null) {
      usedMediaIds.add(parseInt(match[1], 10));
    }

    // 5. Filter the list of all images to find the orphans.
    // An image is an orphan if its ID is not in the set of used media IDs.
    const orphanImages = allImages.filter(image => !usedMediaIds.has(image.id));

    // 6. Return the list of orphan images
    return NextResponse.json(orphanImages);

  } catch (err) {
    console.error('[FIND-ORPHANS ERROR]', err);
    return NextResponse.json(
      { error: err.message || 'Server Error' },
      { status: 500 }
    );
  }
}
