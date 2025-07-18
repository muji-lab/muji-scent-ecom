// src/components/LogoutModal.js - Modal de déconnexion globale

'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut } from 'lucide-react';

export default function LogoutModal({ isOpen, onLogout }) {
  useEffect(() => {
    if (isOpen) {
      // Désactiver le scroll
      document.body.style.overflow = 'hidden';
      
      // Déconnecter immédiatement en arrière-plan
      setTimeout(() => {
        onLogout();
      }, 100);
      
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen, onLogout]);

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        {/* Overlay avec flou */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-neutral-900 bg-opacity-20"
          style={{ backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl p-6"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogOut className="w-8 h-8 text-neutral-600" />
            </div>
            
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Au revoir !
            </h3>
            <p className="text-neutral-600 text-sm mb-4">
              Vous êtes en cours de déconnexion...
            </p>
            
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-neutral-300 border-t-neutral-600 rounded-full animate-spin" />
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}