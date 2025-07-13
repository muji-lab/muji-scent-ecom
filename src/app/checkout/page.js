// src/app/checkout/page.js - VERSION 2.1 (Corrections de style)

'use client';

import { useState } from 'react';
import useCartStore from '@/store/useCartStore';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

// Le composant pour les champs de formulaire, aucune modification nécessaire ici
function FormInput({ id, label, ...props }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-neutral-700 mb-1">
        {label}
      </label>
      <input
        id={id}
        className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-base focus:outline-none focus:ring-1 focus:ring-black transition"
        {...props}
      />
    </div>
  );
}

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const total = items.reduce((t, i) => t + i.price * i.quantity, 0);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'France',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handlePlaceOrder = async (paymentMethod) => {
    setIsLoading(true);
    console.log('Commande passée avec la méthode :', paymentMethod);
    console.log('Données :', { ...formData, items, total });
    setTimeout(() => setIsLoading(false), 3000);
  };

  if (items.length === 0) {
    // ... (panier vide ne change pas)
  }

  return (
    <div className="bg-white min-h-screen text-neutral-900">
      <main className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center gap-4 py-4 border-b border-neutral-200">
          <Link href="/cart" className="p-2 rounded-full hover:bg-neutral-100">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-semibold">Finaliser ma commande</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 py-12">
          {/* Colonne de gauche : Formulaire */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="w-full"
          >
            <div className="space-y-10">
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold">1</div>
                  <h2 className="text-lg font-semibold">Vos coordonnées</h2>
                </div>
                <div className="space-y-5">
                  <FormInput id="email" label="Adresse e-mail *" type="email" value={formData.email} onChange={handleInputChange} required />
                  <FormInput id="name" label="Nom complet *" type="text" value={formData.name} onChange={handleInputChange} required />
                  <FormInput id="address" label="Adresse *" type="text" value={formData.address} onChange={handleInputChange} required />
                  
                  {/* ======================= CORRECTION CHAMPS INVISIBLES ======================= */}
                  <div className="flex flex-col md:flex-row gap-5">
                    {/* On enveloppe chaque champ dans une div pour que le label soit avec son input */}
                    <div className="flex-1">
                        <FormInput id="postalCode" label="Code postal *" type="text" value={formData.postalCode} onChange={handleInputChange} required />
                    </div>
                    <div className="flex-1">
                        <FormInput id="city" label="Ville *" type="text" value={formData.city} onChange={handleInputChange} required />
                    </div>
                  </div>
                  {/* ===================== FIN DE LA CORRECTION ===================== */}

                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-neutral-700 mb-1">Pays *</label>
                    <select id="country" value={formData.country} onChange={handleInputChange} required className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-base focus:outline-none focus:ring-1 focus:ring-black bg-white transition">
                      <option>France</option>
                      <option>Maroc</option>
                      <option>Belgique</option>
                      <option>Suisse</option>
                    </select>
                  </div>
                </div>
              </section>

              <section>
                {/* ... (La section paiement ne change pas pour l'instant) ... */}
              </section>
            </div>
          </motion.div>

          {/* Colonne de droite : Résumé du panier */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
            className="w-full lg:w-4/5"
          >
            {/* ======================= CORRECTION STYLE DU RÉSUMÉ ======================= */}
            <div className="bg-white p-6 rounded-lg shadow-md sticky top-6">
            {/* J'ai changé bg-neutral-100 en bg-white et ajouté shadow-md */}
            {/* ===================== FIN DE LA CORRECTION ===================== */}

              <h2 className="text-lg font-semibold mb-6">Résumé de la commande</h2>
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex items-center gap-4 text-sm">
                    {/* ======================= CORRECTION PASTILLE QUANTITÉ ======================= */}
                    <div className="relative w-16 h-20 border bg-white rounded-md shrink-0">
                    {/* J'ai enlevé overflow-hidden qui coupait la pastille */}
                      <Image src={item.image} alt={item.title} fill className="object-contain p-1" />
                      <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">{item.quantity}</span>
                    </div>
                    {/* ===================== FIN DE LA CORRECTION ===================== */}

                    <div className="flex-grow">
                      <p className="font-medium text-base">{item.title}</p>
                      <p className="text-xs text-neutral-600">Taille : {item.size}</p>
                    </div>
                    <p className="font-semibold text-base">{(item.price * item.quantity).toFixed(2)} €</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-neutral-200 pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Sous-total</span>
                  <span>{total.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Livraison</span>
                  <span>Offerte</span>
                </div>
                <div className="flex justify-between font-bold text-base border-t border-neutral-200 pt-2 mt-2">
                  <span>Total</span>
                  <span>{total.toFixed(2)} €</span>
                </div>
              </div>
            </div>
          </motion.aside>

        </div>
      </main>
    </div>
  );
}