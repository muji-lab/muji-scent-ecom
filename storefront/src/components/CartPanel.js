// src/components/CartPanel.js
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, Minus, Trash2 } from 'lucide-react';
import useCartStore from '../store/useCartStore';

export default function CartPanel() {
  const isOpen  = useCartStore((s) => s.isCartOpen);
  const close   = useCartStore((s) => s.closeCartPanel);

  const items   = useCartStore((s) => s.items);
  const inc     = useCartStore((s) => s.increaseQuantity);
  const dec     = useCartStore((s) => s.decreaseQuantity);
  const remove  = useCartStore((s) => s.removeFromCart);

  const total   = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            onClick={close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black z-40"
          />

          {/* Panel */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-50 shadow-xl overflow-y-auto rounded-l-2xl"
          >
            <div className="relative p-6 flex flex-col h-full text-neutral-900">
              {/* Close */}
              <button
                onClick={close}
                className="absolute top-2 right-2 text-2xl hover:opacity-70"
                aria-label="Fermer le panier"
              >
                &times;
              </button>

              {/* Header */}
              <h2 className="text-lg font-semibold mb-6">
                Mon Panier ({items.length})
              </h2>

              {/* Items */}
              <motion.div
                layout="position"
                className="flex-1 overflow-y-auto space-y-6 pr-1 mb-6"
              >
                {items.map((item, idx) => (
                  <motion.div
                    key={`${item.id}-${item.size}-${idx}`}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.25 }}
                    className="flex gap-4"
                  >
                    {/* Visuel */}
                    <div className="relative w-20 h-28 border border-neutral-200 rounded bg-white">
                      <Image src={item.image} alt={item.title} fill className="object-contain" />
                    </div>

                    {/* Infos */}
                    <div className="flex-1">
                      <p className="text-sm font-medium leading-snug">{item.title}</p>
                      <p className="text-xs text-neutral-600 mb-2">Taille&nbsp;: {item.size}</p>

                      {/* Quantité + prix */}
                      <div className="flex items-center gap-3 text-sm">
                      <button
                          onClick={() => dec(item.id, item.size)}
                          aria-label="Diminuer"
                          className="w-7 h-7 flex items-center justify-center rounded-full bg-black text-white hover:bg-neutral-800 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => inc(item.id, item.size)}
                          aria-label="Augmenter"
                          className="w-7 h-7 flex items-center justify-center rounded-full bg-black text-white hover:bg-neutral-800 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>

                        <span className="ml-auto font-semibold">
                          {(item.price * item.quantity).toFixed(2)} €
                        </span>
                      </div>

                      {/* Supprimer */}
                      <button
                        onClick={() => remove(item.id, item.size)}
                        className="mt-2 inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-900"
                      >
                        <Trash2 className="w-3 h-3" />
                        Retirer
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Total & CTA */}
              <div className="border-t border-neutral-200 pt-4">
                <div className="flex justify-between text-sm mb-4">
                  <span>Total</span>
                  <span className="font-semibold">{total.toFixed(2)} €</span>
                </div>

                <Link
                  href="/cart"
                  onClick={close}
                  className="block w-full bg-black text-white text-center py-3 rounded-full text-sm font-medium hover:bg-neutral-800"
                >
                  Valider mon panier
                </Link>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
