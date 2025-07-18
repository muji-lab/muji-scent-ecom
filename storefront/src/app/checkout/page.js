// src/app/checkout/page.js - MISE À JOUR AVEC PRÉNOM / NOM

'use client';

import { useState, useMemo, useEffect } from 'react';
import useCartStore from '../../store/useCartStore';
import { useAuth } from '../../contexts/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, CreditCard, User, UserPlus, CheckCircle } from 'lucide-react';
import CheckoutStepper, { Step } from '../../components/CheckoutStepper';
import stripePromise from '../../lib/stripe';

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
  const { user, isAuthenticated } = useAuth();

  const [checkoutMode, setCheckoutMode] = useState(''); // 'authenticated', 'guest', 'register'
  const [createAccount, setCreateAccount] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'France',
    paymentMethod: 'cod',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Préremplir les données si l'utilisateur est connecté
  useEffect(() => {
    if (isAuthenticated && user) {
      setCheckoutMode('authenticated');
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        address: user.address || '',
        city: user.city || '',
        postalCode: user.postalCode || '',
        country: user.country || 'France',
      }));
    } else {
      setCheckoutMode('guest');
    }
  }, [isAuthenticated, user]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Composant pour choisir le mode de checkout (guest seulement)
  const CheckoutModeSelector = () => (
    <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">Comment souhaitez-vous passer commande ?</h3>
      <div className="space-y-3">
        <label className="flex items-center gap-3 p-3 border border-neutral-200 rounded-lg hover:bg-white cursor-pointer">
          <input
            type="radio"
            name="checkoutMode"
            value="guest"
            checked={checkoutMode === 'guest' && !createAccount}
            onChange={() => {
              setCheckoutMode('guest');
              setCreateAccount(false);
            }}
            className="w-4 h-4"
          />
          <User className="w-5 h-5 text-neutral-600" />
          <div>
            <div className="font-medium">Commande invité</div>
            <div className="text-sm text-neutral-600">Commandez rapidement sans créer de compte</div>
          </div>
        </label>
        
        <label className="flex items-center gap-3 p-3 border border-neutral-200 rounded-lg hover:bg-white cursor-pointer">
          <input
            type="radio"
            name="checkoutMode"
            value="register"
            checked={checkoutMode === 'guest' && createAccount}
            onChange={() => {
              setCheckoutMode('guest');
              setCreateAccount(true);
            }}
            className="w-4 h-4"
          />
          <UserPlus className="w-5 h-5 text-neutral-600" />
          <div>
            <div className="font-medium">Créer un compte et commander</div>
            <div className="text-sm text-neutral-600">Créez un compte pour suivre vos commandes</div>
          </div>
        </label>
      </div>
    </div>
  );

  // Composant pour afficher les infos préremplies si connecté
  const AuthenticatedUserInfo = () => (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-2 mb-2">
        <CheckCircle className="w-5 h-5 text-green-600" />
        <span className="font-medium text-green-800">Connecté en tant que</span>
      </div>
      <div className="text-sm text-green-700">
        {user?.firstName} {user?.lastName} ({user?.email})
      </div>
      <div className="text-xs text-green-600 mt-1">
        Vos informations seront préremplies automatiquement
      </div>
    </div>
  );

  // Fonction pour gérer le paiement COD (inchangée)
  const handleCODPayment = async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formData, items, total, paymentMethod: 'cod' }),
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

  // Fonction pour gérer le paiement Stripe
  const handleStripePayment = async () => {
    setIsLoading(true);
    setApiError(null);
    
    try {
      const stripe = await stripePromise;
      
      // Créer la session Stripe
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          items, 
          customerEmail: formData.email, 
          formData 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la création de la session Stripe');
      }

      const { sessionId } = await response.json();
      
      // Rediriger vers Stripe Checkout
      const result = await stripe.redirectToCheckout({ sessionId });
      
      if (result.error) {
        throw new Error(result.error.message);
      }
      
    } catch (err) {
      setApiError(err.message);
      setIsLoading(false);
    }
  };

  // Fonction principale appelée par le stepper
  const handleFinalStep = async () => {
    if (formData.paymentMethod === 'stripe') {
      await handleStripePayment();
    } else {
      await handleCODPayment();
    }
  };

  // Validations dynamiques selon le mode de checkout
  const validations = useMemo(() => {
    const baseValidations = [
      formData.firstName.trim() !== '' && formData.lastName.trim() !== '',
      formData.address.trim().length >= 5,
      formData.city.trim() !== '' && formData.postalCode.trim() !== '',
      true // Paiement toujours valide
    ];

    // Si utilisateur connecté, pas besoin de validation email
    if (checkoutMode === 'authenticated') {
      return baseValidations;
    }

    // Si guest, ajouter validation email au début
    return [
      formData.email.trim() !== '' && /\S+@\S+\.\S+/.test(formData.email),
      ...baseValidations
    ];
  }, [checkoutMode, formData.email, formData.firstName, formData.lastName, formData.address, formData.city, formData.postalCode]);

  // Fonction pour générer les étapes dynamiquement
  const generateSteps = () => {
    const steps = [];
    let stepIndex = 0;

    // Étape email seulement si pas connecté
    if (checkoutMode === 'guest') {
      steps.push(
        <Step key={stepIndex} isValid={validations[stepIndex]}>
          <h2 className="text-lg font-semibold mb-4">Quelle est votre adresse e-mail ?</h2>
          <FormInput 
            id="email" 
            label="Adresse e-mail *" 
            type="email" 
            value={formData.email} 
            onChange={handleInputChange} 
            placeholder="nom@exemple.com" 
          />
          {createAccount && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                Un compte sera créé automatiquement avec cette adresse email après votre commande.
              </p>
            </div>
          )}
        </Step>
      );
      stepIndex++;
    }

    // Étape nom (toujours présente)
    steps.push(
      <Step key={stepIndex} isValid={validations[stepIndex]}>
        <h2 className="text-lg font-semibold mb-4">
          {checkoutMode === 'authenticated' ? 'Confirmez votre nom' : 'Quel est votre nom ?'}
        </h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <FormInput 
              id="firstName" 
              label="Prénom *" 
              type="text" 
              value={formData.firstName} 
              onChange={handleInputChange}
              disabled={checkoutMode === 'authenticated' && user?.firstName}
            />
          </div>
          <div className="flex-1">
            <FormInput 
              id="lastName" 
              label="Nom de famille *" 
              type="text" 
              value={formData.lastName} 
              onChange={handleInputChange}
              disabled={checkoutMode === 'authenticated' && user?.lastName}
            />
          </div>
        </div>
      </Step>
    );
    stepIndex++;

    // Étape adresse
    steps.push(
      <Step key={stepIndex} isValid={validations[stepIndex]}>
        <h2 className="text-lg font-semibold mb-4">
          {checkoutMode === 'authenticated' ? 'Confirmez votre adresse de livraison' : 'Quelle est votre adresse de livraison ?'}
        </h2>
        <FormInput 
          id="address" 
          label="Adresse *" 
          type="text" 
          value={formData.address} 
          onChange={handleInputChange} 
        />
        <div className="mt-4">
          <label htmlFor="country" className="block text-sm font-medium text-neutral-700 mb-1">Pays *</label>
          <select 
            id="country" 
            value={formData.country} 
            onChange={handleInputChange} 
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-base bg-white"
          >
            <option>France</option>
            <option>Maroc</option>
          </select>
        </div>
      </Step>
    );
    stepIndex++;

    // Étape ville et code postal
    steps.push(
      <Step key={stepIndex} isValid={validations[stepIndex]}>
        <h2 className="text-lg font-semibold mb-4">Ville et code postal</h2>
        <div className="flex gap-4">
          <div className="flex-1">
            <FormInput 
              id="postalCode" 
              label="Code postal *" 
              type="text" 
              value={formData.postalCode} 
              onChange={handleInputChange} 
            />
          </div>
          <div className="flex-1">
            <FormInput 
              id="city" 
              label="Ville *" 
              type="text" 
              value={formData.city} 
              onChange={handleInputChange} 
            />
          </div>
        </div>
      </Step>
    );
    stepIndex++;

    // Étape paiement
    steps.push(
      <Step key={stepIndex} isValid={validations[stepIndex]}>
        <h2 className="text-lg font-semibold mb-4">Choisissez votre méthode de paiement</h2>
        <div className="space-y-4">
          <button
            onClick={() => setFormData(f => ({ ...f, paymentMethod: 'cod' }))}
            className={`w-full p-4 border-2 rounded-lg text-left transition ${
              formData.paymentMethod === 'cod' 
                ? 'border-black bg-neutral-50' 
                : 'border-neutral-300 hover:border-neutral-400'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full border-2 ${
                formData.paymentMethod === 'cod' 
                  ? 'border-black bg-black' 
                  : 'border-neutral-300'
              }`} />
              <div>
                <div className="font-medium">Paiement à la livraison</div>
                <div className="text-sm text-neutral-600">Réglez votre commande en espèces ou par carte</div>
              </div>
            </div>
          </button>
          
          <button
            onClick={() => setFormData(f => ({ ...f, paymentMethod: 'stripe' }))}
            className={`w-full p-4 border-2 rounded-lg text-left transition ${
              formData.paymentMethod === 'stripe' 
                ? 'border-black bg-neutral-50' 
                : 'border-neutral-300 hover:border-neutral-400'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full border-2 ${
                formData.paymentMethod === 'stripe' 
                  ? 'border-black bg-black' 
                  : 'border-neutral-300'
              }`} />
              <div>
                <div className="font-medium flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Carte bancaire
                </div>
                <div className="text-sm text-neutral-600">Paiement sécurisé par Stripe</div>
              </div>
            </div>
          </button>
        </div>
      </Step>
    );

    return steps;
  };

  if (items.length === 0 && !isLoading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Panier vide</h1>
          <p className="text-neutral-600 mb-6">Votre panier est vide. Ajoutez des produits pour continuer.</p>
          <Link href="/" className="bg-black text-white px-6 py-3 rounded-lg hover:bg-neutral-800 transition">
            Continuer les achats
          </Link>
        </div>
      </div>
    );
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
            {/* Affichage des composants selon le mode */}
            {checkoutMode === 'authenticated' && <AuthenticatedUserInfo />}
            {checkoutMode === 'guest' && <CheckoutModeSelector />}
            
            {/* Stepper avec étapes dynamiques */}
            <CheckoutStepper steps={generateSteps()} onFinalStep={handleFinalStep} />

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