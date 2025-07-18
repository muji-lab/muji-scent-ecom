// src/app/api/stripe/checkout/route.js - API route pour créer une session Stripe

import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Clé Stripe manquante" }, { status: 500 });
  }

  try {
    const { items, customerEmail, formData } = await request.json();

    // Conversion des items du panier en line_items Stripe
    const lineItems = items.map(item => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.title,
          description: `Taille: ${item.size}`,
          images: [item.image], // Stripe accepte les URLs d'images
        },
        unit_amount: Math.round(item.price * 100), // Stripe utilise les centimes
      },
      quantity: item.quantity,
    }));

    // Créer la session Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: customerEmail,
      
      // URLs de redirection
      success_url: `${process.env.NEXT_PUBLIC_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/checkout`,
      
      // Métadonnées pour le webhook
      metadata: {
        customer_email: customerEmail,
        customer_name: `${formData.firstName} ${formData.lastName}`,
        shipping_address: `${formData.address}, ${formData.postalCode} ${formData.city}, ${formData.country}`,
        // On va stocker les données client pour le webhook
        form_data: JSON.stringify(formData),
      },
      
      // Options supplémentaires
      payment_intent_data: {
        metadata: {
          customer_email: customerEmail,
        }
      }
    });

    return NextResponse.json({ sessionId: session.id });

  } catch (error) {
    console.error('Erreur création session Stripe:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}