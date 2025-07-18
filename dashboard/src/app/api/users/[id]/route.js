// dashboard/src/app/api/users/[id]/route.js - API routes pour gestion utilisateur individuel

import { fetchUserById, updateUser } from '@/lib/api';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const user = await fetchUserById(params.id);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(user);
  } catch (error) {
    console.error('Erreur API users GET:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const userData = await request.json();
    const updatedUser = await updateUser(params.id, userData);
    
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Erreur API users PUT:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour' },
      { status: 500 }
    );
  }
}