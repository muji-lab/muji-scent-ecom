// src/emails/welcome-email.js - Template email de bienvenue (style démo)

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

export default function WelcomeEmail({ firstName, email }) {
  return (
    <Html>
      <Head />
      <Preview>Muji Scent - Test de création de compte réussi !</Preview>
      <Body style={main}>
        <Container style={container}>
          
          {/* Section En-tête avec Logo */}
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

          {/* Message principal */}
          <Heading style={h2}>
            Félicitations, {firstName} ! Votre compte de test est créé.
          </Heading>
          
          <Text style={paragraph}>
            Vous venez de tester avec succès la création de compte sur le site de démonstration Muji Scent. 
            Ceci est l'e-mail de bienvenue que vos propres clients pourraient recevoir.
          </Text>

          {/* Section Avantages */}
          <Section style={benefitsSection}>
            <Heading as="h3" style={h3}>Fonctionnalités testées</Heading>
            <Text style={benefitItem}>✓ Inscription multi-étapes avec validation</Text>
            <Text style={benefitItem}>✓ Vérification email en temps réel</Text>
            <Text style={benefitItem}>✓ Sécurité du mot de passe renforcée</Text>
            <Text style={benefitItem}>✓ Sauvegarde des informations client</Text>
            <Text style={benefitItem}>✓ Email de bienvenue automatique</Text>
          </Section>

          {/* Section Appel à l'Action */}
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
}

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

const benefitsSection = {
  padding: '20px 40px',
  borderTop: '1px solid #eaeaea',
};

const benefitItem = {
  fontSize: '14px',
  color: '#333',
  margin: '8px 0',
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