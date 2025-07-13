// src/app/api/orders/route.js

import { NextResponse } from 'next/server';

// On a besoin de l'URL de Strapi et d'un token d'API
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

// On va gérer les requêtes POST vers cette URL
export async function POST(request) {
  // 1. Vérifier que le token d'API est bien configuré
  if (!STRAPI_API_TOKEN) {
    return NextResponse.json(
      { error: "Le token d'API Strapi n'est pas configuré." },
      { status: 500 }
    );
  }

  try {
    // 2. Récupérer les données envoyées par notre page de checkout
    const body = await request.json();
    const { formData, items, total } = body;

    // 3. Formater les données pour qu'elles correspondent à notre Content-Type "Order"
    const orderData = {
      data: {
        customerName: formData.name,
        customerEmail: formData.email,
        shippingAddress: `${formData.address}, ${formData.postalCode} ${formData.city}, ${formData.country}`,
        items: items, // Le champ JSON accepte directement notre tableau d'items
        totalAmount: total,
        paymentMethod: 'cod', // Pour l'instant, on force le paiement à la livraison
        paymentStatus: 'pending',
        orderStatus: 'new',
      },
    };

    // 4. Envoyer les données à Strapi pour créer la commande
    const response = await fetch(`${STRAPI_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      console.error("Erreur de Strapi lors de la création de la commande:", errorDetails);
      return NextResponse.json(
        { error: "Impossible de créer la commande." },
        { status: 500 }
      );
    }
    
    const createdOrder = await response.json();

    // 5. Renvoyer une réponse de succès avec les données de la commande créée
    return NextResponse.json({ success: true, order: createdOrder });

  } catch (error) {
    console.error("Erreur interne du serveur:", error);
    return NextResponse.json(
      { error: "Une erreur interne est survenue." },
      { status: 500 }
    );
  }
}