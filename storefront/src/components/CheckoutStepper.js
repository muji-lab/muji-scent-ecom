// src/components/CheckoutStepper.js

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';

export default function CheckoutStepper({ steps, onFinalStep, finalButtonText = 'Valider ma commande' }) {
  const [currentStep, setCurrentStep] = useState(0);

  const next = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(step => step + 1);
    } else {
      onFinalStep();
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep(step => step - 1);
    }
  };

  const isNextDisabled = steps[currentStep].props.isValid === false;
  const isFinalStep = currentStep === steps.length - 1;

  return (
    <div className="w-full">
      {/* Barre de progression */}
      <div className="flex items-center mb-8">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center w-full">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-colors ${
                currentStep > index ? 'bg-black text-white' : 
                currentStep === index ? 'bg-black text-white' : 'bg-neutral-200 text-neutral-500'
              }`}
            >
              {currentStep > index ? <Check className="w-5 h-5" /> : index + 1}
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-4 bg-neutral-200">
                <div 
                  className="h-full bg-black transition-all duration-300"
                  style={{ width: currentStep > index ? '100%' : '0%' }} 
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Contenu de l'étape actuelle */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {steps[currentStep]}
        </motion.div>
      </AnimatePresence>

      {/* Boutons de navigation */}
      <div className="mt-10 flex items-center justify-between">
        {currentStep > 0 ? (
          <button onClick={prev} className="flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-black">
            <ArrowLeft className="w-4 h-4" />
            Retour
          </button>
        ) : <div />}
        
        <button 
          onClick={next} 
          disabled={isNextDisabled}
          className="px-6 py-3 bg-black text-white rounded-full text-sm font-medium transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isFinalStep ? finalButtonText : 'Suivant'}
        </button>
      </div>
    </div>
  );
}

// Un composant helper pour définir chaque étape
export function Step({ children }) {
  return <>{children}</>;
}