// src/components/AddToCartPanel.js
'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import useCartStore from '@/store/useCartStore';

export default function AddToCartPanel() {
  const {
    isAddToCartPanelOpen,
    closeAddToCartPanel,
    items,
  } = useCartStore();

  /* Auto-fermeture après 6 s */
  useEffect(() => {
    if (!isAddToCartPanelOpen) return;
    const timer = setTimeout(closeAddToCartPanel, 6000);
    return () => clearTimeout(timer);
  }, [isAddToCartPanelOpen, closeAddToCartPanel]);

  const last = items[items.length - 1];
  if (!isAddToCartPanelOpen || !last) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 bottom-0 sm:bottom-8 sm:right-8 sm:left-auto sm:w-[30vw] max-w-md
                   bg-white shadow-2xl border border-neutral-200 z-50
                   rounded-t-2xl sm:rounded-l-2xl overflow-hidden"
      >
        <div className="p-5">
          {/* En-tête */}
          <div className="flex justify-between items-center mb-4">
            <p className="text-lg text-black font-semibold">Produit ajouté</p>
            <button
              onClick={closeAddToCartPanel}
              className="text-sm hover:opacity-70"
              aria-label="Fermer"
            >
              &times;
            </button>
          </div>

          {/* Détails produit */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative w-20 h-28 border border-neutral-200 rounded">
              <Image
                src={last.image}
                alt={last.title}
                fill
                className="object-contain"
                priority
              />
            </div>
            <div>
              <p className="text-xs uppercase text-neutral-500">{last.id}</p>
              <p className="text-sm font-medium leading-snug">{last.title}</p>
              <p className="text-sm text-neutral-600">Taille : {last.size}</p>
              <p className="text-sm font-semibold">{last.price.toFixed(2)} €</p>
            </div>
          </div>

          {/* Boutons */}
          <div className="flex flex-col gap-3">
            <Link
              href="/checkout"
              onClick={closeAddToCartPanel}
              className="bg-black text-white text-center py-3 rounded-full text-sm font-medium"
            >
              Commander maintenant
            </Link>
            <button
              onClick={closeAddToCartPanel}
              className="border border-black text-black text-center py-3 rounded-full text-sm font-medium"
            >
              Continuer mes achats
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
