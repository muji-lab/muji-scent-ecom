// src/app/checkout/success/page.js - Gestion COD + Stripe

'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import useCartStore from '../../../store/useCartStore';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderCreated, setOrderCreated] = useState(false);
  const [error, setError] = useState(null);
  const clearCart = useCartStore((s) => s.clearCart);
  
  useEffect(() => {
    // Si on a un session_id, c'est un paiement Stripe
    if (sessionId && !orderCreated) {
      setPaymentMethod('stripe');
      setIsProcessing(true);
      
      // Créer la commande après paiement Stripe
      fetch('/api/stripe/success', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      })
      .then(res => res.json())
      .then(data => {
        console.log('Réponse API stripe/success:', data);
        if (data.success) {
          setOrderCreated(true);
          clearCart(); // Vider le panier après succès
        } else {
          setError(data.error || 'Erreur inconnue');
        }
      })
      .catch(err => {
        console.error('Erreur création commande:', err);
        setError('Erreur de connexion');
      })
      .finally(() => setIsProcessing(false));
    }
  }, [sessionId, orderCreated, clearCart]);

  return (
    <div className="bg-white min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md text-center bg-neutral-50 p-8 rounded-xl shadow-md"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.2,
            type: 'spring',
            stiffness: 260,
            damping: 20,
          }}
          className="mx-auto"
        >
          <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
        </motion.div>

        <h1 className="text-2xl font-semibold text-neutral-900 mb-2">
          {paymentMethod === 'stripe' ? 'Paiement confirmé !' : 'Merci pour votre commande !'}
        </h1>

        <p className="text-neutral-600 mb-8">
          {paymentMethod === 'stripe' 
            ? (isProcessing 
                ? 'Finalisation de votre commande en cours...' 
                : 'Votre paiement a été traité avec succès. Vous recevrez bientôt un e-mail de confirmation avec les détails de votre achat.')
            : 'Votre commande a bien été enregistrée. Vous recevrez bientôt un e-mail de confirmation avec les détails de votre achat.'}
        </p>

        {paymentMethod === 'stripe' && !isProcessing && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-800 text-sm">
              ✅ Paiement sécurisé traité par Stripe
            </p>
          </div>
        )}

        {isProcessing && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800 text-sm">
              🔄 Création de votre commande en cours...
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 text-sm">
              ❌ Erreur : {error}
            </p>
          </div>
        )}

        <Link
          href="/"
          className="inline-block w-full py-3 bg-black text-white rounded-full text-center text-sm font-medium hover:bg-neutral-800 transition-all"
        >
          Continuer mes achats
        </Link>
      </motion.div>
    </div>
  );
}