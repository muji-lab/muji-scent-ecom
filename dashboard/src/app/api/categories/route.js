import { NextResponse } from 'next/server';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

async function strapiRequest(path, options = {}) {
  if (!STRAPI_API_TOKEN) {
    throw new Error('Token d\'API Strapi non configuré.');
  }

  const response = await fetch(`${STRAPI_URL}/api${path}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Erreur Strapi:', errorText);
    throw new Error(`Erreur Strapi: ${response.status}`);
  }

  return response.json();
}

// GET - Récupérer toutes les catégories
export async function GET() {
  try {
    const data = await strapiRequest('/categories?populate=*');
    return NextResponse.json(data);
  } catch (error) {
    console.error('Erreur lors du chargement des catégories:', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement des catégories' },
      { status: 500 }
    );
  }
}

// POST - Créer une nouvelle catégorie
export async function POST(request) {
  try {
    const categoryData = await request.json();
    
    const data = await strapiRequest('/categories', {
      method: 'POST',
      body: JSON.stringify({ data: categoryData }),
    });
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Erreur lors de la création de la catégorie:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la catégorie' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour une catégorie
export async function PUT(request) {
  try {
    const { id, data: categoryData } = await request.json();
    
    const data = await strapiRequest(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ data: categoryData }),
    });
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la catégorie:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la catégorie' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une catégorie
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get('id');
    
    if (!documentId) {
      return NextResponse.json(
        { error: 'ID de catégorie manquant' },
        { status: 400 }
      );
    }
    
    await strapiRequest(`/categories/${documentId}`, {
      method: 'DELETE',
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la suppression de la catégorie:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la catégorie' },
      { status: 500 }
    );
  }
}