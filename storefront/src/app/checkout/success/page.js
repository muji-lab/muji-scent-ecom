// src/app/checkout/success/page.js

'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

export default function SuccessPage() {
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
          Merci pour votre commande !
        </h1>

        <p className="text-neutral-600 mb-8">
          Votre commande a bien été enregistrée. Vous recevrez bientôt un e-mail de confirmation avec les détails de votre achat.
        </p>

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