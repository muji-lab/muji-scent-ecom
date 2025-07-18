// src/app/api/auth/profile/route.js - API route pour récupérer le profil utilisateur

import { NextResponse } from 'next/server';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export async function GET(request) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Token d\'authentification requis' },
        { status: 401 }
      );
    }

    console.log('🔄 API profile - Récupération du profil utilisateur');

    // Appel à l'API Strapi pour récupérer le profil
    const response = await fetch(`${STRAPI_URL}/api/users/me`, {
      headers: {
        'Authorization': authHeader,
      },
    });

    console.log('📝 API profile - Statut Strapi:', response.status);
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('❌ API profile - Erreur Strapi:', data);
      return NextResponse.json(
        { error: data.error?.message || 'Erreur lors de la récupération du profil' },
        { status: response.status }
      );
    }

    console.log('✅ API profile - Profil récupéré avec succès');
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('❌ API profile - Erreur serveur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    );
  }
}