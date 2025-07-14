// src/app/checkout/page.js - MISE À JOUR AVEC PRÉNOM / NOM

'use client';

import { useState, useMemo } from 'react';
import useCartStore from '../../store/useCartStore';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2 } from 'lucide-react';
import CheckoutStepper, { Step } from '../../components/CheckoutStepper';

// Le composant FormInput ne change pas
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
  const clearCart = useCartStore((s) => s.clearCart);
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: '', // Changement ici
    lastName: '',  // Changement ici
    email: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'France',
    paymentMethod: 'cod',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleFinalStep = async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formData, items, total, paymentMethod: formData.paymentMethod }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'La création de la commande a échoué.');
      }
      clearCart();
      router.push('/checkout/success');
    } catch (err) {
      setApiError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Validations pour chaque étape
  const validations = [
    useMemo(() => formData.email.trim() !== '' && /\S+@\S+\.\S+/.test(formData.email), [formData.email]),
    useMemo(() => formData.firstName.trim() !== '' && formData.lastName.trim() !== '', [formData.firstName, formData.lastName]), // Changement ici
    useMemo(() => formData.address.trim().length >= 5, [formData.address]),
    useMemo(() => formData.city.trim() !== '' && formData.postalCode.trim() !== '', [formData.city, formData.postalCode]),
    true
  ];

  if (items.length === 0 && !isLoading) {
    // ... (panier vide ne change pas)
  }

  return (
    <div className="bg-white min-h-screen text-neutral-900">
      <main className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center gap-4 py-4 border-b border-neutral-200">
          <Link href="/cart" className="p-2 rounded-full hover:bg-neutral-100" aria-label="Retour au panier">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-semibold">Finaliser ma commande</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 py-12">
          {/* Colonne de gauche : Formulaire avec Stepper */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="w-full"
          >
            <CheckoutStepper steps={
              [
                <Step key={1} isValid={validations[0]}>
                  <h2 className="text-lg font-semibold mb-4">Quelle est votre adresse e-mail ?</h2>
                  <FormInput id="email" label="Adresse e-mail *" type="email" value={formData.email} onChange={handleInputChange} placeholder="nom@exemple.com" />
                </Step>,
                // ======================= ÉTAPE DU NOM MODIFIÉE =======================
                <Step key={2} isValid={validations[1]}>
                  <h2 className="text-lg font-semibold mb-4">Quel est votre nom ?</h2>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <FormInput id="firstName" label="Prénom *" type="text" value={formData.firstName} onChange={handleInputChange} />
                    </div>
                    <div className="flex-1">
                      <FormInput id="lastName" label="Nom de famille *" type="text" value={formData.lastName} onChange={handleInputChange} />
                    </div>
                  </div>
                </Step>,
                // ===================== FIN DE LA MODIFICATION =====================
                <Step key={3} isValid={validations[2]}>
                  <h2 className="text-lg font-semibold mb-4">Quelle est votre adresse de livraison ?</h2>
                  <FormInput id="address" label="Adresse *" type="text" value={formData.address} onChange={handleInputChange} />
                  <div className="mt-4">
                    <label htmlFor="country" className="block text-sm font-medium text-neutral-700 mb-1">Pays *</label>
                    <select id="country" value={formData.country} onChange={handleInputChange} className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-base bg-white">
                        <option>France</option>
                        <option>Maroc</option>
                    </select>
                  </div>
                </Step>,
                <Step key={4} isValid={validations[3]}>
                  <h2 className="text-lg font-semibold mb-4">Ville et code postal ?</h2>
                  <div className="flex gap-4">
                    <div className="flex-1"><FormInput id="postalCode" label="Code postal *" type="text" value={formData.postalCode} onChange={handleInputChange} /></div>
                    <div className="flex-1"><FormInput id="city" label="Ville *" type="text" value={formData.city} onChange={handleInputChange} /></div>
                  </div>
                </Step>,
                <Step key={5} isValid={validations[4]}>
                  <h2 className="text-lg font-semibold mb-4">Choisissez votre méthode de paiement</h2>
                  <div className="space-y-4">
                    <button
                      onClick={() => setFormData(f => ({ ...f, paymentMethod: 'cod' }))}
                      className={`w-full p-4 border-2 rounded-lg font-semibold text-left transition ${formData.paymentMethod === 'cod' ? 'border-black' : 'border-neutral-300 hover:border-neutral-500'}`}
                    >
                      Paiement à la livraison
                    </button>
                    <button disabled className="w-full p-4 border rounded-lg font-semibold text-left transition disabled:opacity-50">
                      Carte de crédit (Bientôt)
                    </button>
                  </div>
                </Step>
              ]
            } onFinalStep={handleFinalStep} />

            {isLoading && <div className="flex justify-center mt-6"><Loader2 className="w-6 h-6 animate-spin" /></div>}
            {apiError && <p className="text-red-600 text-sm mt-4 text-center">{apiError}</p>}
          </motion.div>

          {/* Colonne de droite : Résumé de la commande */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
            className="w-full lg:w-4/5"
          >
            <div className="bg-white p-6 rounded-lg shadow-md sticky top-6">
              <h2 className="text-lg font-semibold mb-6">Résumé de la commande</h2>
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex items-center gap-4 text-sm">
                    <div className="relative w-16 h-20 border bg-white rounded-md shrink-0">
                      <Image src={item.image} alt={item.title} fill className="object-contain p-1" />
                      <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">{item.quantity}</span>
                    </div>
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