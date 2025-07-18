// src/lib/stripe.js - Configuration client Stripe

import { loadStripe } from '@stripe/stripe-js';

// Clé publique Stripe (safe côté client)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default stripePromise;