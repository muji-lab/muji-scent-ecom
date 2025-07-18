// src/app/api/auth/login/route.js - API route pour la connexion

import { NextResponse } from 'next/server';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export async function POST(request) {
  try {
    const credentials = await request.json();
    
    console.log('🔄 API login - Tentative de connexion:', {
      email: credentials.identifier,
      fieldsCount: Object.keys(credentials).length
    });

    // Appel à l'API Strapi pour la connexion
    const response = await fetch(`${STRAPI_URL}/api/auth/local`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    console.log('📝 API login - Statut Strapi:', response.status);
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('❌ API login - Erreur Strapi:', data);
      return NextResponse.json(
        { error: data.error?.message || 'Erreur lors de la connexion' },
        { status: response.status }
      );
    }

    console.log('✅ API login - Connexion réussie');
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('❌ API login - Erreur serveur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    );
  }
}