// src/app/api/auth/check-email/route.js - API pour vérifier si un email existe déjà

import { NextResponse } from 'next/server';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email requis' },
        { status: 400 }
      );
    }

    // Validation format email
    if (!/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json(
        { error: 'Format email invalide' },
        { status: 400 }
      );
    }

    // Vérifier si l'email existe déjà dans Strapi avec timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

    try {
      const response = await fetch(`${STRAPI_URL}/api/users?filters[email][$eq]=${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error('Erreur Strapi check-email:', response.status);
        return NextResponse.json(
          { error: 'Erreur lors de la vérification' },
          { status: 500 }
        );
      }

      const data = await response.json();
      const emailExists = data.length > 0;

      return NextResponse.json({ 
        exists: emailExists,
        message: emailExists ? 'Cette adresse email est déjà utilisée' : 'Email disponible'
      });
    } catch (strapiError) {
      clearTimeout(timeoutId);
      console.error('Erreur connexion Strapi:', strapiError);
      return NextResponse.json(
        { error: 'Erreur de connexion' },
        { status: 503 }
      );
    }
    
  } catch (error) {
    console.error('Erreur API check-email:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}