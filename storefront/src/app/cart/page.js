// src/app/cart/page.js - VERSION FINALE MISE À JOUR

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useCartStore from '../../store/useCartStore';
import { motion } from 'framer-motion';
// On importe toutes les icônes nécessaires
import { Plus, Minus, ShieldCheck, Truck, Undo2, Store } from 'lucide-react';

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const incQty = useCartStore((s) => s.increaseQuantity);
  const decQty = useCartStore((s) => s.decreaseQuantity);
  const remove = useCartStore((s) => s.removeFromCart);
  const clearCart = useCartStore((s) => s.clearCart);
  const router = useRouter();
  const total = items.reduce((t, i) => t + i.price * i.quantity, 0);

  if (!items.length)
    return (
      <div className="bg-neutral-100 min-h-screen flex flex-col items-center justify-center px-4">
        <h1 className="text-2xl font-semibold mb-4">Votre panier est vide</h1>
        <Link href="/" className="underline text-sm text-neutral-600">
          ← Continuer mes achats
        </Link>
      </div>
    );

  return (
    <div className="bg-neutral-100 text-neutral-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-4">
        <motion.div
          className="bg-white rounded-lg shadow-md flex items-center gap-4 px-4 py-3 text-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="w-6 h-6 bg-black text-white rounded-full grid place-items-center text-xs">
            🎁
          </div>
          <span>N’oubliez pas de personnaliser vos cadeaux ! Découvrez nos options.</span>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 flex flex-col lg:flex-row gap-12">
        {/* Colonne produits */}
        <section className="flex-1">
          <h1 className="text-2xl font-semibold mb-6">
            Mon Panier <span className="text-neutral-500">({items.length})</span>
          </h1>

          <div className="space-y-12">
            {items.map((item, idx) => (
              <motion.article
                key={`${item.id}-${item.size}-${idx}`}
                className="grid grid-cols-1 md:grid-cols-12 bg-white rounded-lg shadow-md overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="md:col-span-4 lg:col-span-3 relative aspect-[3/4]">
                  <Image src={item.image} alt={item.title} fill className="object-contain" />
                </div>
                <div className="md:col-span-8 lg:col-span-9 p-6 flex flex-col gap-6">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-xs uppercase text-neutral-500">{item.id}</p>
                      <h2 className="font-medium">{item.title}</h2>
                      <p className="text-sm text-neutral-600">Taille : {item.size}</p>
                    </div>
                    <p className="font-medium">{(item.price * item.quantity).toFixed(2)} €</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => decQty(item.id, item.size)}
                      aria-label="Diminuer"
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-black text-white hover:bg-neutral-800 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-lg w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => incQty(item.id, item.size)}
                      aria-label="Augmenter"
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-black text-white hover:bg-neutral-800 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex justify-between text-sm border-t border-neutral-200 pt-4">
                    <button className="text-neutral-500" disabled>🤍 Wishlist</button>
                    <button onClick={() => remove(item.id, item.size)} className="text-neutral-500 hover:text-black">
                      Retirer
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Boutons bas */}
          <div className="mt-10 flex justify-between items-center flex-wrap gap-4">
            <Link
              href="/"
              className="bg-black text-white text-sm px-5 py-2 rounded-full hover:bg-neutral-800 transition"
            >
              ← Continuer mes achats
            </Link>
            <button
              onClick={clearCart}
              className="bg-neutral-500 text-white text-sm px-5 py-2 rounded-full hover:bg-neutral-600 transition"
            >
              Vider le panier
            </button>
          </div>
        </section>

        {/* Colonne résumé */}
        <aside className="lg:w-[340px] space-y-6 sticky top-6 self-center">
          <motion.div
            className="bg-white rounded-lg shadow-md p-6 space-y-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex justify-between text-sm"><span>Sous-total</span><span>{total.toFixed(2)} €</span></div>
            <div className="flex justify-between text-sm"><span>Livraison</span><span>Offerte</span></div>
            <hr />
            <div className="flex justify-between font-semibold"><span>Total</span><span>{total.toFixed(2)} €</span></div>

            <button
              onClick={() => router.push('/checkout')}
              className="w-full py-3 rounded-full bg-black text-white text-sm font-medium hover:bg-neutral-800"
            >Procéder au paiement</button>

            <button
              disabled
              className="w-full py-3 rounded-full bg-[#0070E0] text-white text-sm font-medium opacity-60"
            >Payer avec PayPal</button>
          </motion.div>

          {/* BLOC DE GARANTIES AMÉLIORÉ */}
          <motion.div
            className="bg-white rounded-lg shadow-md p-6 space-y-4 text-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-green-600 shrink-0" />
              <span>Paiement 100% sécurisé</span>
            </div>
            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5 text-neutral-600 shrink-0" />
              <span>Livraison offerte – 3 à 5 jours</span>
            </div>
            <div className="flex items-center gap-3">
              <Undo2 className="w-5 h-5 text-neutral-600 shrink-0" />
              <span>Retour gratuit sous 30 jours</span>
            </div>
            <div className="flex items-center gap-3">
              <Store className="w-5 h-5 text-neutral-600 shrink-0" />
              <span>Retrait en boutique sous 24h</span>
            </div>
          </motion.div>

        </aside>
      </div>
    </div>
  );
}