// src/app/api/preview-email/route.js - VERSION MISE À JOUR

import { NextResponse } from 'next/server';
import { render } from '@react-email/render';
import { OrderConfirmationEmail } from '../../../emails/OrderConfirmationEmail.jsx'; // N'oublie pas l'extension .jsx

export async function GET() {
  // On crée des données de test complètes
  const testData = {
    customerName: 'Hicham',
    orderId: 'MS-20250714-TEST1',
    orderDate: new Date(), // On passe une vraie date de test
    orderItems: [
      { id: 1, title: 'Sunset Delight', size: '100ml', quantity: 1, price: 189.00 },
      { id: 2, title: 'Le Printemps', size: '200ml', quantity: 2, price: 249.00 },
    ],
    orderTotal: 189.00 + (2 * 249.00),
    shippingAddress: '123 Avenue des Champs-Élysées, 75008 Paris, France', // Adresse de test
    paymentMethod: 'cod', // Méthode de paiement de test
  };

  const emailHtml = await render(<OrderConfirmationEmail {...testData} />);

  return new NextResponse(emailHtml, {
    headers: { 'Content-Type': 'text/html' },
  });
}