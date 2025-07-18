// src/app/api/stripe/success/route.js - Créer la commande après paiement Stripe réussi

import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { OrderConfirmationEmail } from '../../../../emails/OrderConfirmationEmail.jsx';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

// Fonction pour générer un ID de commande unique
function generateCustomOrderId() {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const randomPart = Math.random().toString(36).substr(2, 5).toUpperCase();
  return `MS-${year}${month}${day}-${randomPart}`;
}

export async function POST(request) {
  try {
    const { sessionId } = await request.json();
    
    console.log('🔍 Début traitement stripe/success pour sessionId:', sessionId);
    console.log('🔍 Variables d\'environnement:', {
      STRAPI_URL: STRAPI_URL,
      STRAPI_API_TOKEN: STRAPI_API_TOKEN ? 'OK' : 'MANQUANT',
      RESEND_API_KEY: process.env.RESEND_API_KEY ? 'OK' : 'MANQUANT',
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ? 'OK' : 'MANQUANT'
    });
    
    if (!sessionId) {
      console.log('❌ Session ID manquant');
      return NextResponse.json({ error: 'Session ID manquant' }, { status: 400 });
    }

    // Récupérer la session Stripe pour obtenir les détails
    console.log('🔍 Récupération session Stripe...');
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'line_items.data.price.product', 'payment_intent']
    });

    console.log('🔍 Session récupérée:', {
      id: session.id,
      payment_status: session.payment_status,
      line_items_count: session.line_items?.data?.length || 0,
      metadata: session.metadata
    });

    if (session.payment_status !== 'paid') {
      console.log('❌ Paiement non confirmé, statut:', session.payment_status);
      return NextResponse.json({ error: 'Paiement non confirmé' }, { status: 400 });
    }

    // Reconstituer les données de la commande depuis les métadonnées
    const formData = JSON.parse(session.metadata.form_data);
    const lineItems = session.line_items.data;
    
    console.log('🔍 Line items reçus:', JSON.stringify(lineItems, null, 2));
    
    // Conversion des line items en format items de commande
    const items = lineItems.map(item => {
      console.log('🔍 Traitement item:', {
        product_name: item.price.product.name,
        product_description: item.price.product.description,
        unit_amount: item.price.unit_amount,
        quantity: item.quantity,
        images: item.price.product.images
      });
      
      // Extraire la taille depuis la description si disponible
      const description = item.price.product.description || item.description || '';
      const sizeMatch = description.match(/Taille:\s*([^,]+)/);
      const size = sizeMatch ? sizeMatch[1] : 'Standard';
      
      const processedItem = {
        id: item.price.product.id, // On utilise l'ID Stripe du produit
        title: item.price.product.name,
        image: item.price.product.images && item.price.product.images[0] || '',
        size: size,
        price: item.price.unit_amount / 100, // Conversion centimes vers euros
        quantity: item.quantity
      };
      
      console.log('🔍 Item traité:', processedItem);
      return processedItem;
    });
    
    console.log('🔍 Items finaux:', JSON.stringify(items, null, 2));

    const total = session.amount_total / 100; // Conversion centimes vers euros
    const customOrderId = generateCustomOrderId();
    const orderDate = new Date();

    // Créer la commande dans Strapi
    console.log('🔍 Création commande Strapi...');
    const orderData = {
      data: {
        customOrderId: customOrderId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        customerEmail: formData.email,
        shippingAddress: `${formData.address}, ${formData.postalCode} ${formData.city}, ${formData.country}`,
        items: items,
        totalAmount: total,
        paymentMethod: 'stripe',
        paymentStatus: 'paid', // Déjà payé via Stripe
        orderStatus: 'new',
        // Les champs Stripe sont supprimés car pas dans le schéma Strapi
      },
    };

    console.log('🔍 Données commande:', orderData);

    const strapiResponse = await fetch(`${STRAPI_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify(orderData),
    });

    if (!strapiResponse.ok) {
      const errorDetails = await strapiResponse.json();
      console.error("❌ Erreur de Strapi :", errorDetails);
      return NextResponse.json({ error: "Impossible de créer la commande." }, { status: 500 });
    }

    const createdOrder = await strapiResponse.json();
    console.log('✅ Commande créée dans Strapi:', createdOrder.data?.id);

    // Envoyer l'email de confirmation
    console.log('🔍 Envoi email de confirmation...');
    try {
      await resend.emails.send({
        from: 'Muji Lab <contact@send.mujilab.com>',
        to: [formData.email],
        subject: `Confirmation de votre commande Muji Scent #${customOrderId}`,
        react: OrderConfirmationEmail({
          customerName: formData.firstName,
          orderItems: items,
          orderTotal: total,
          orderId: customOrderId,
          orderDate: orderDate,
          shippingAddress: orderData.data.shippingAddress,
          paymentMethod: 'stripe',
        }),
      });
      console.log('✅ Email envoyé avec succès');
    } catch (emailError) {
      console.error("❌ Erreur lors de l'envoi de l'e-mail :", emailError);
      // On ne fait pas échouer la commande pour ça
    }

    console.log('✅ Processus terminé avec succès');
    return NextResponse.json({ 
      success: true, 
      order: createdOrder,
      orderId: customOrderId 
    });

  } catch (error) {
    console.error("❌ Erreur lors de la création de la commande Stripe :", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}