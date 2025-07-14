// src/app/api/orders/route.js - MISE À JOUR MAJEURE

import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { OrderConfirmationEmail } from '../../../emails/OrderConfirmationEmail';

const resend = new Resend(process.env.RESEND_API_KEY);
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

// Fonction pour générer un ID de commande unique et lisible
function generateCustomOrderId() {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const randomPart = Math.random().toString(36).substr(2, 5).toUpperCase();
  return `MS-${year}${month}${day}-${randomPart}`;
}

export async function POST(request) {
  if (!STRAPI_API_TOKEN || !process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: "Des clés API sont manquantes." }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { formData, items, total, paymentMethod } = body;

    const customOrderId = generateCustomOrderId();
    const orderDate = new Date();

    const orderData = {
      data: {
        customOrderId: customOrderId, // On sauvegarde notre nouvel ID
        firstName: formData.firstName,
        lastName: formData.lastName,
        customerEmail: formData.email,
        shippingAddress: `${formData.address}, ${formData.postalCode} ${formData.city}, ${formData.country}`,
        items: items,
        totalAmount: total,
        paymentMethod: paymentMethod,
        paymentStatus: 'pending',
        orderStatus: 'new',
      },
    };

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
        console.error("Erreur de Strapi :", errorDetails);
        return NextResponse.json({ error: "Impossible de créer la commande." }, { status: 500 });
    }
    
    const createdOrder = await strapiResponse.json();

    // On envoie l'e-mail avec TOUTES les nouvelles informations
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
          paymentMethod: paymentMethod,
        }),
      });
    } catch (emailError) {
      console.error("Erreur lors de l'envoi de l'e-mail :", emailError);
    }

    return NextResponse.json({ success: true, order: createdOrder });

  } catch (error) {
    console.error("Erreur interne :", error);
    return NextResponse.json({ error: "Une erreur interne est survenue." }, { status: 500 });
  }
}