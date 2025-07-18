// src/app/api/auth/update-profile/route.js - API route pour mettre à jour le profil utilisateur

import { NextResponse } from 'next/server';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export async function PUT(request) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Token d\'authentification requis' },
        { status: 401 }
      );
    }

    const updateData = await request.json();
    
    // Exclure les champs non modifiables (email, username, etc.)
    const allowedFields = ['firstName', 'lastName', 'phone', 'address', 'city', 'postalCode', 'country'];
    const filteredData = {};
    
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        filteredData[field] = updateData[field];
      }
    });
    
    console.log('🔄 API update-profile - Mise à jour du profil:', {
      fieldsCount: Object.keys(filteredData).length,
      fields: Object.keys(filteredData),
      originalFields: Object.keys(updateData)
    });

    // D'abord récupérer l'ID utilisateur via /users/me
    const userResponse = await fetch(`${STRAPI_URL}/api/users/me`, {
      headers: {
        'Authorization': authHeader,
      },
    });
    
    if (!userResponse.ok) {
      console.error('❌ API update-profile - Erreur récupération utilisateur:', userResponse.status);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération de l\'utilisateur' },
        { status: userResponse.status }
      );
    }
    
    const userData = await userResponse.json();
    const userId = userData.id;
    
    console.log('👤 API update-profile - ID utilisateur:', userId);
    
    // Maintenant mettre à jour avec l'ID utilisateur
    const response = await fetch(`${STRAPI_URL}/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify(filteredData),
    });

    console.log('📝 API update-profile - Statut Strapi:', response.status);
    
    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      console.error('❌ API update-profile - Erreur parsing JSON:', jsonError);
      return NextResponse.json(
        { error: 'Erreur de communication avec le serveur' },
        { status: response.status }
      );
    }
    
    if (!response.ok) {
      console.error('❌ API update-profile - Erreur Strapi:', data);
      return NextResponse.json(
        { error: data.error?.message || 'Erreur lors de la mise à jour du profil' },
        { status: response.status }
      );
    }

    console.log('✅ API update-profile - Profil mis à jour avec succès');
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('❌ API update-profile - Erreur serveur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    );
  }
}