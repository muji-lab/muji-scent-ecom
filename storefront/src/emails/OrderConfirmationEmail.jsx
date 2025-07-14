// src/emails/OrderConfirmationEmail.jsx - VERSION FINALE (Le meilleur des deux mondes)

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Row,
  Column,
} from '@react-email/components';
import * as React from 'react';

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const OrderConfirmationEmail = ({
  customerName,
  orderItems,
  orderTotal,
  orderId,
  orderDate,
  shippingAddress,
  paymentMethod,
}) => {
  // On formate la date pour un affichage plus lisible
  const formattedDate = new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(new Date(orderDate));

  const paymentMethodText = {
    cod: 'Paiement à la livraison',
    stripe: 'Carte de crédit',
  }[paymentMethod] || paymentMethod;

  return (
    <Html>
      <Head />
      <Preview>Muji Scent - Test de commande réussi !</Preview>
      <Body style={main}>
        <Container style={container}>
          
          {/* Section En-tête avec Logo - STYLE CORRIGÉ */}
          <Section style={headerSection}>
            <Text style={h1}>MUJI SCENT</Text>
            <Row>
              <Column align="center">
                <Text style={byText}>by</Text>
                <Img src={`${baseUrl}/visuels/logo_mujilab.webp`} width="60" alt="Muji Lab Logo" style={{ marginTop: '5px' }} />
              </Column>
            </Row>
          </Section>
          
          <Section style={{ textAlign: 'center', padding: '30px 0' }}>
            <Img
              src={`${baseUrl}/visuels/muji_on_bottle.webp`}
              width="280"
              alt="Mascotte Muji sur une bouteille de parfum"
              style={mainImage}
            />
          </Section>

          {/* Ton texte préféré est de retour */}
          <Heading style={h2}>
            Félicitations, {customerName} ! Le processus fonctionne.
          </Heading>
          
          <Text style={paragraph}>
            Vous venez de tester avec succès le tunnel de commande du site de démonstration Muji Scent. 
            Ceci est l'e-mail de confirmation transactionnel que vos propres clients pourraient recevoir.
          </Text>

          {/* NOUVELLE SECTION : Détails de la commande */}
          <Section style={detailsSection}>
            <Row>
              <Column>
                <Text style={detailTitle}>Commande N°</Text>
                <Text style={detailValue}>{orderId}</Text>
              </Column>
              <Column style={{ textAlign: 'right' }}>
                <Text style={detailTitle}>Date</Text>
                <Text style={detailValue}>{formattedDate}</Text>
              </Column>
            </Row>
          </Section>

          {/* Section Résumé Commande */}
          <Section style={recapContainer}>
            <Heading as="h3" style={h3}>Résumé de votre commande test</Heading>
            {orderItems.map((item) => (
              <Row key={item.id + item.size} style={itemRow}>
                <Column>
                  <Text style={itemTitle}>{item.title} ({item.size}) x {item.quantity}</Text>
                </Column>
                <Column style={{ textAlign: 'right' }}>
                  <Text style={itemPrice}>{(item.price * item.quantity).toFixed(2)} €</Text>
                </Column>
              </Row>
            ))}
            <Row style={totalRow}>
              <Column>
                <Text style={totalTitle}>Total</Text>
              </Column>
              <Column style={{ textAlign: 'right' }}>
                <Text style={totalPrice}>{orderTotal.toFixed(2)} €</Text>
              </Column>
            </Row>
          </Section>

          {/* NOUVELLE SECTION : Informations de livraison et paiement */}
          <Section style={infoSection}>
            <Row>
              <Column style={infoColumn}>
                <Text style={infoTitle}>Livré à</Text>
                <Text style={infoText}>{customerName}</Text>
                <Text style={infoText}>{shippingAddress}</Text>
              </Column>
              <Column style={infoColumn}>
                <Text style={infoTitle}>Paiement</Text>
                <Text style={infoText}>{paymentMethodText}</Text>
              </Column>
            </Row>
          </Section>

          {/* Section Appel à l'Action (CTA) */}
          <Section style={ctaContainer}>
            <Heading as="h3" style={h3}>Prêt à lancer votre propre boutique ?</Heading>
            <Text style={paragraph}>
              Ce site est un exemple du savoir-faire de <strong>Muji Lab</strong>. Nous créons des solutions e-commerce modernes, rapides et sur-mesure.
            </Text>
            <Link href="mailto:contact@mujilab.com" style={button}>
              Discutons de votre projet
            </Link>
          </Section>

          <Text style={footer}>
            Développé par Muji Lab.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default OrderConfirmationEmail;

// ======================= STYLES COMPLETS =======================

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};
const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
};
const headerSection = {
  textAlign: 'center',
  padding: '20px 0',
  borderBottom: '1px solid #eaeaea',
};
const h1 = {
  color: '#1a1a1a',
  fontSize: '28px',
  fontWeight: '300',
  letterSpacing: '3px',
  margin: '0 0 10px 0',
};
const byText = {
  color: '#525f7f',
  fontSize: '14px',
  margin: '0',
};
const mainImage = {
  maxWidth: '100%',
  margin: '0 auto',
};
const h2 = {
  color: '#1a1a1a',
  fontSize: '22px',
  fontWeight: '600',
  textAlign: 'center',
  padding: '0 30px',
};
const h3 = {
  color: '#1a1a1a',
  fontSize: '18px',
  fontWeight: '600',
  marginBottom: '20px',
};
const paragraph = {
  color: '#525f7f',
  fontSize: '16px',
  lineHeight: '24px',
  textAlign: 'center',
  padding: '0 30px',
};
const detailsSection = {
    padding: '20px 40px',
    borderTop: '1px solid #eaeaea',
};
const detailTitle = {
    fontSize: '12px',
    color: '#8898aa',
    margin: '0',
    textTransform: 'uppercase',
};
const detailValue = {
    fontSize: '14px',
    color: '#333',
    margin: '4px 0 0 0',
    fontWeight: '500',
};
const recapContainer = {
  padding: '20px 40px',
  borderTop: '1px solid #eaeaea',
};
const itemRow = { width: '100%' };
const itemTitle = {
  fontSize: '14px',
  color: '#333',
};
const itemPrice = {
  fontSize: '14px',
  color: '#333',
  fontWeight: 'bold',
};
const totalRow = {
  width: '100%',
  borderTop: '1px solid #eaeaea',
  paddingTop: '10px',
  marginTop: '10px',
};
const totalTitle = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#1a1a1a',
};
const totalPrice = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#1a1a1a',
};
const infoSection = {
    padding: '20px 40px',
    borderTop: '1px solid #eaeaea',
};
const infoColumn = {
    width: '50%',
};
const infoTitle = {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: '8px',
};
const infoText = {
    fontSize: '14px',
    color: '#525f7f',
    margin: '0',
    lineHeight: '20px',
};
const ctaContainer = {
  textAlign: 'center',
  padding: '40px 30px',
  borderTop: '1px solid #eaeaea',
};
const button = {
  backgroundColor: '#000000',
  borderRadius: '50px',
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center',
  display: 'inline-block',
  padding: '14px 28px',
};
const footer = {
  color: '#8898aa',
  fontSize: '12px',
  textAlign: 'center',
};