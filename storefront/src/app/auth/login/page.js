// src/app/auth/login/page.js - Page de connexion avec design cohérent

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { motion } from 'framer-motion';
import { ArrowLeft, Eye, EyeOff, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Modal from '../../../components/Modal';
import Toast from '../../../components/Toast';

function FormInput({ id, label, type = 'text', ...props }) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-neutral-700">
        {label}
      </label>
      <input
        id={id}
        type={type}
        className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-base text-black placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-black transition-colors"
        {...props}
      />
    </div>
  );
}

export default function LoginPage() {
  const [formData, setFormData] = useState({
    identifier: '', // Email ou username
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [userName, setUserName] = useState('');
  
  const { signIn } = useAuth();
  const router = useRouter();

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    setError(''); // Clear error when typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn(formData);
      
      if (result.success) {
        // Afficher la modal de succès
        setUserName(result.user.firstName || 'Utilisateur');
        setShowSuccessModal(true);
        
        // Rediriger après 2 secondes
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        setError(result.error || 'Erreur lors de la connexion');
      }
    } catch (err) {
      setError('Une erreur inattendue est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-md mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="flex text-black items-center gap-4 mb-8">
          <Link href="/" className="p-2 rounded-full hover:bg-neutral-100 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-semibold">Se connecter</h1>
        </div>

        {/* Formulaire */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          
          {/* Email */}
          <FormInput
            id="identifier"
            label="Email *"
            type="email"
            value={formData.identifier}
            onChange={handleInputChange}
            placeholder="votre@email.com"
            required
          />

          {/* Mot de passe */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
              Mot de passe *
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Votre mot de passe"
                required
                className="w-full px-3 py-2 pr-10 border border-neutral-300 rounded-lg text-base text-black placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-black transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Erreur */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Bouton de connexion */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-black text-white rounded-full font-medium hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Connexion...
              </>
            ) : (
              'Se connecter'
            )}
          </button>

          {/* Liens */}
          <div className="text-center space-y-4">
            <Link href="/auth/forgot-password" className="text-sm text-neutral-600 hover:text-black">
              Mot de passe oublié ?
            </Link>
            
            <div className="border-t border-neutral-200 pt-4">
              <div className="text-sm text-neutral-600 mb-3">
                Pas encore de compte ?
              </div>
              <Link 
                href="/auth/register" 
                className="inline-block w-full py-2 px-4 border border-black text-black rounded-full font-medium hover:bg-black hover:text-white transition-colors"
              >
                Créer un compte
              </Link>
            </div>
          </div>
        </motion.form>
      </div>

      {/* Modal de succès */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        showCloseButton={false}
        size="sm"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
          </div>
          
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">
            Bienvenue {userName} !
          </h3>
          <p className="text-neutral-600 text-sm mb-4">
            Vous êtes maintenant connecté. Nous vous redirigeons vers la page d'accueil...
          </p>
          
          <div className="flex items-center justify-center">
            <Loader2 className="w-5 h-5 animate-spin text-neutral-400" />
          </div>
        </div>
      </Modal>
    </div>
  );
}