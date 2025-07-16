// dashboard/src/app/api/strapi/cleanup/route.js

import { NextResponse } from 'next/server';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

export async function GET() {
  try {
    // 1. Récupérer tous les fichiers uploadés
    const uploadsRes = await fetch(`${STRAPI_URL}/upload/files`, {
      headers: { Authorization: `Bearer ${STRAPI_API_TOKEN}` },
    });
    const uploads = await uploadsRes.json();

    // 2. Filtrer les fichiers non liés à un contenu
    const orphaned = uploads.filter((file) => !file.related || file.related.length === 0);

    // 3. Supprimer les fichiers orphelins un par un
    const deleted = [];
    for (const file of orphaned) {
      await fetch(`${STRAPI_URL}/upload/files/${file.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${STRAPI_API_TOKEN}` },
      });
      deleted.push(file.name);
    }

    return NextResponse.json({
      status: 'ok',
      deletedCount: deleted.length,
      deleted,
      message: `${deleted.length} image(s) supprimée(s).`,
    });
  } catch (error) {
    console.error('[CLEANUP ERROR]', error);
    return NextResponse.json(
      { status: 'error', message: 'Erreur lors du nettoyage' },
      { status: 500 }
    );
  }
}
