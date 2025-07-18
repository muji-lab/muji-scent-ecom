// src/app/api/auth/welcome-email/route.js - API pour envoyer l'email de bienvenue

import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import WelcomeEmail from '../../../../emails/welcome-email';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const { firstName, email } = await request.json();

    if (!firstName || !email) {
      return NextResponse.json(
        { error: 'Nom et email requis' },
        { status: 400 }
      );
    }

    // Envoyer l'email de bienvenue
    const emailResponse = await resend.emails.send({
      from: 'MUJI SCENT <noreply@send.mujilab.com>',
      to: email,
      subject: `Bienvenue chez MUJI SCENT, ${firstName} !`,
      react: WelcomeEmail({ firstName, email }),
    });

    if (emailResponse.error) {
      console.error('Erreur Resend:', emailResponse.error);
      return NextResponse.json(
        { error: 'Erreur lors de l\'envoi de l\'email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      messageId: emailResponse.data?.id 
    });
    
  } catch (error) {
    console.error('Erreur API welcome-email:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}