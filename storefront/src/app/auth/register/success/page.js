// src/app/auth/register/success/page.js - Page de confirmation d'inscription

'use client';

import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '../../../../contexts/AuthContext';

export default function RegisterSuccessPage() {
  const { user } = useAuth();

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-md mx-auto px-4 py-8">
        
        {/* Contenu centré */}
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Icône de succès */}
            <div className="flex justify-center">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>

            {/* Titre */}
            <h1 className="text-2xl font-semibold text-black">
              Bienvenue {user?.firstName || 'chez MUJI SCENT'} !
            </h1>

            {/* Message */}
            <div className="space-y-3 text-neutral-600">
              <p>
                Votre compte a été créé avec succès.
              </p>
              <p>
                Un email de bienvenue vient d'être envoyé à <strong>{user?.email}</strong>
              </p>
            </div>

            {/* Boutons d'action */}
            <div className="space-y-4 pt-6">
              <Link
                href="/"
                className="inline-flex items-center gap-2 w-full py-3 px-6 bg-black text-white rounded-full font-medium hover:bg-neutral-800 transition-colors justify-center"
              >
                Découvrir nos parfums
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <Link
                href="/account"
                className="inline-block w-full py-3 px-6 border border-black text-black rounded-full font-medium hover:bg-black hover:text-white transition-colors text-center"
              >
                Voir mon compte
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}