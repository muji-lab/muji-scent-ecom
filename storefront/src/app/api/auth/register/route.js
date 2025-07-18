// src/app/api/auth/register/route.js - API route pour l'inscription

import { NextResponse } from 'next/server';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export async function POST(request) {
  try {
    const userData = await request.json();
    
    console.log('🔄 API register - Tentative d\'inscription:', {
      username: userData.username,
      email: userData.email,
      fieldsCount: Object.keys(userData).length
    });

    // Appel à l'API Strapi pour l'inscription
    const response = await fetch(`${STRAPI_URL}/api/auth/local/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    console.log('📝 API register - Statut Strapi:', response.status);
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('❌ API register - Erreur Strapi:', data);
      return NextResponse.json(
        { error: data.error?.message || 'Erreur lors de l\'inscription' },
        { status: response.status }
      );
    }

    console.log('✅ API register - Inscription réussie');
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('❌ API register - Erreur serveur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    );
  }
}