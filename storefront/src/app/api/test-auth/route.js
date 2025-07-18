// src/app/api/test-auth/route.js - Test de l'API d'authentification Strapi v5

import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { action } = await request.json();
    
    console.log('🔍 Test auth - Action:', action);
    
    if (action === 'test-register') {
      // Test d'inscription avec des données factices uniques
      const timestamp = Date.now();
      const testUser = {
        username: `testuser_${timestamp}`,
        email: `test_${timestamp}@example.com`,
        password: 'testpassword123',
      };

      console.log('🔍 Données utilisateur test:', testUser);

      const response = await fetch('http://localhost:1337/api/auth/local/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testUser),
      });

      console.log('🔍 Response status:', response.status);
      console.log('🔍 Response ok:', response.ok);

      const data = await response.json();
      console.log('🔍 Response data:', JSON.stringify(data, null, 2));
      
      return NextResponse.json({
        success: response.ok,
        status: response.status,
        data: data,
        message: 'Test d\'inscription terminé'
      });
    }

    return NextResponse.json({ error: 'Action non reconnue' }, { status: 400 });
    
  } catch (error) {
    console.error('Erreur test auth:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}