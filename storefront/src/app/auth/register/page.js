// src/app/auth/register/page.js - Page d'inscription avec stepper et champs complets

'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { motion } from 'framer-motion';
import { ArrowLeft, Eye, EyeOff, Loader2, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import CheckoutStepper, { Step } from '../../../components/CheckoutStepper';

function FormInput({ id, label, type = 'text', ...props }) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-neutral-700">
        {label}
      </label>
      <input
        id={id}
        type={type}
        className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-base text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-black transition-colors"
        {...props}
      />
    </div>
  );
}

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    // Étape 1 : Infos personnelles
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Étape 2 : Adresse
    address: '',
    city: '',
    postalCode: '',
    country: 'France',
    
    // Étape 3 : Mot de passe
    password: '',
    confirmPassword: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState(''); // 'available', 'taken', 'checking', 'error'
  
  const { signUp } = useAuth();
  const router = useRouter();

  // Fonction pour valider la force du mot de passe
  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    
    return {
      isValid: minLength && hasLowerCase && hasUpperCase,
      minLength,
      hasLowerCase,
      hasUpperCase
    };
  };

  // Fonction pour vérifier si l'email existe déjà
  const checkEmailExists = useCallback(async (email) => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailStatus('');
      return;
    }
    
    setIsCheckingEmail(true);
    setEmailStatus('checking');
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
      
      const response = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.exists) {
          setEmailError('Cette adresse email est déjà utilisée');
          setEmailStatus('taken');
        } else {
          setEmailError('');
          setEmailStatus('available');
        }
      } else {
        // En cas d'erreur de la requête, on n'affiche pas d'erreur
        // mais on laisse la validation finale se faire côté serveur
        setEmailError('');
        setEmailStatus('error');
        console.warn('Erreur vérification email:', response.status);
      }
    } catch (error) {
      // En cas d'erreur réseau ou timeout, on n'affiche pas d'erreur
      // mais on laisse la validation finale se faire côté serveur
      setEmailError('');
      setEmailStatus('error');
      console.error('Erreur vérification email:', error);
    } finally {
      setIsCheckingEmail(false);
    }
  }, []);

  // Debounce pour la vérification email
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (formData.email) {
        checkEmailExists(formData.email);
      }
    }, 800);
    return () => clearTimeout(timeoutId);
  }, [formData.email, checkEmailExists]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    setError(''); // Clear error when typing
    
    // Clear email error when typing
    if (id === 'email') {
      setEmailError('');
      setEmailStatus('');
    }
  };

  const handleFinalStep = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Vérification finale de l'email avant création du compte
      try {
        const emailCheckResponse = await fetch('/api/auth/check-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: formData.email }),
        });
        
        if (emailCheckResponse.ok) {
          const emailCheckData = await emailCheckResponse.json();
          if (emailCheckData.exists) {
            setError('Cette adresse email est déjà utilisée. Veuillez utiliser une autre adresse.');
            return;
          }
        }
      } catch (emailCheckError) {
        console.warn('Erreur vérification finale email:', emailCheckError);
        // On continue même si la vérification échoue
      }

      // Créer un username à partir du prénom et nom
      const username = `${formData.firstName.toLowerCase()}.${formData.lastName.toLowerCase()}`;
      
      console.log('🔄 Tentative d\'inscription avec:', {
        username,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
      });
      
      const result = await signUp({
        username,
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.country,
      });
      
      console.log('📝 Résultat inscription:', result);
      
      if (result.success) {
        // Envoyer l'email de bienvenue
        try {
          console.log('📧 Envoi email de bienvenue...');
          const emailResponse = await fetch('/api/auth/welcome-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              firstName: formData.firstName,
              email: formData.email,
            }),
          });
          
          if (emailResponse.ok) {
            console.log('✅ Email de bienvenue envoyé');
          } else {
            console.warn('⚠️ Erreur envoi email:', emailResponse.status);
          }
        } catch (emailError) {
          console.warn('❌ Erreur envoi email de bienvenue:', emailError);
          // Ne pas faire échouer l'inscription si l'email échoue
        }
        
        // Rediriger vers la page de succès
        router.push('/auth/register/success');
      } else {
        // Gestion spécifique des erreurs
        if (result.error?.includes('Email or Username are already taken')) {
          setError('Cette adresse email est déjà utilisée. Veuillez utiliser une autre adresse.');
        } else if (result.error?.includes('username')) {
          setError('Ce nom d\'utilisateur est déjà pris. Veuillez essayer avec un autre nom.');
        } else {
          setError(result.error || 'Erreur lors de l\'inscription');
        }
      }
    } catch (err) {
      console.error('❌ Erreur inscription finale:', err);
      
      // Gestion spécifique des erreurs
      if (err.message?.includes('Email or Username are already taken')) {
        setError('Cette adresse email est déjà utilisée. Veuillez utiliser une autre adresse.');
      } else if (err.message?.includes('Failed to fetch') || err.name === 'TypeError') {
        setError('Erreur de connexion. Vérifiez votre connexion internet et réessayez.');
      } else if (err.message?.includes('NetworkError') || err.message?.includes('fetch')) {
        setError('Problème de réseau. Veuillez réessayer dans quelques instants.');
      } else {
        setError(err.message || 'Une erreur inattendue est survenue');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Validations pour chaque étape
  const validations = [
    useMemo(() => {
      return formData.firstName.trim() !== '' && 
             formData.lastName.trim() !== '' && 
             formData.email.trim() !== '' && 
             /\S+@\S+\.\S+/.test(formData.email) &&
             !emailError &&
             !isCheckingEmail &&
             emailStatus !== 'taken';
    }, [formData.firstName, formData.lastName, formData.email, emailError, isCheckingEmail, emailStatus]),
    
    useMemo(() => {
      return formData.address.trim().length >= 5 && 
             formData.city.trim() !== '' && 
             formData.postalCode.trim() !== '';
    }, [formData.address, formData.city, formData.postalCode]),
    
    useMemo(() => {
      const passwordValidation = validatePassword(formData.password);
      return passwordValidation.isValid && 
             formData.password === formData.confirmPassword;
    }, [formData.password, formData.confirmPassword]),
  ];

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-md mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="flex text-black items-center gap-4 mb-8">
          <Link href="/" className="p-2 rounded-full hover:bg-neutral-100 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-semibold">Créer un compte</h1>
        </div>

        {/* Stepper */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <CheckoutStepper 
            finalButtonText="Créer mon compte"
            steps={[
            
            // Étape 1 : Informations personnelles
            <Step key={1} isValid={validations[0]}>
              <h2 className="text-lg text-black font-semibold mb-4">Vos informations personnelles</h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <FormInput
                    id="firstName"
                    label="Prénom *"
                    type="text"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Prénom"
                  />
                  <FormInput
                    id="lastName"
                    label="Nom *"
                    type="text"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Nom"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
                    Email *
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email"
                      className={`w-full px-3 py-2 pr-10 border rounded-lg text-base text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-1 transition-colors ${
                        emailStatus === 'taken' ? 'border-red-300 focus:ring-red-500' : 
                        emailStatus === 'available' ? 'border-green-300 focus:ring-green-500' : 
                        'border-neutral-300 focus:ring-black'
                      }`}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {isCheckingEmail && (
                        <Loader2 className="w-4 h-4 animate-spin text-neutral-400" />
                      )}
                      {emailStatus === 'available' && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                      {emailStatus === 'taken' && (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  </div>
                  {emailError && (
                    <p className="text-red-500 text-sm">{emailError}</p>
                  )}
                  {emailStatus === 'available' && (
                    <p className="text-green-600 text-sm">✓ Cette adresse email est disponible</p>
                  )}
                </div>
                <FormInput
                  id="phone"
                  label="Téléphone (optionnel)"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Téléphone"
                />
              </div>
            </Step>,

            // Étape 2 : Adresse de livraison
            <Step key={2} isValid={validations[1]}>
              <h2 className="text-lg font-semibold mb-4">Votre adresse de livraison</h2>
              <div className="space-y-4">
                <FormInput
                  id="address"
                  label="Adresse *"
                  type="text"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Adresse"
                />
                <div className="flex gap-4">
                  <FormInput
                    id="postalCode"
                    label="Code postal *"
                    type="text"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    placeholder="Code postal"
                  />
                  <FormInput
                    id="city"
                    label="Ville *"
                    type="text"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Ville"
                  />
                </div>
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-neutral-700 mb-2">
                    Pays *
                  </label>
                  <select
                    id="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-base text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-black transition-colors"
                  >
                    <option value="France">France</option>
                    <option value="Maroc">Maroc</option>
                  </select>
                </div>
              </div>
            </Step>,

            // Étape 3 : Mot de passe
            <Step key={3} isValid={validations[2]}>
              <h2 className="text-lg text-black font-semibold mb-4">Sécurisez votre compte</h2>
              <div className="space-y-4">
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
                      placeholder="Au moins 8 caractères"
                      className="w-full px-3 py-2 pr-10 border border-neutral-300 rounded-lg text-base text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-black transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  
                  {/* Indicateur de force du mot de passe */}
                  {formData.password && (
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${validatePassword(formData.password).minLength ? 'bg-green-500' : 'bg-neutral-300'}`} />
                        <span className={validatePassword(formData.password).minLength ? 'text-green-600' : 'text-neutral-500'}>
                          Au moins 8 caractères
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${validatePassword(formData.password).hasLowerCase ? 'bg-green-500' : 'bg-neutral-300'}`} />
                        <span className={validatePassword(formData.password).hasLowerCase ? 'text-green-600' : 'text-neutral-500'}>
                          Au moins une minuscule
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${validatePassword(formData.password).hasUpperCase ? 'bg-green-500' : 'bg-neutral-300'}`} />
                        <span className={validatePassword(formData.password).hasUpperCase ? 'text-green-600' : 'text-neutral-500'}>
                          Au moins une majuscule
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700">
                    Confirmer le mot de passe *
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Répétez votre mot de passe"
                      className="w-full px-3 py-2 pr-10 border border-neutral-300 rounded-lg text-base text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-black transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </Step>
            
          ]} onFinalStep={handleFinalStep} />

          {/* Espace fixe pour erreur (évite le déplacement des éléments) */}
          <div className="mt-4 h-12 flex items-center justify-center">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 w-full">
                <p className="text-red-600 text-sm text-center">{error}</p>
              </div>
            )}
            {isLoading && (
              <Loader2 className="w-6 h-6 animate-spin" />
            )}
          </div>

          {/* Liens - position fixe */}
          <div className="text-center mt-6">
            <div className="text-sm text-neutral-600">
              Déjà un compte ?{' '}
              <Link href="/auth/login" className="text-black hover:underline font-medium">
                Se connecter
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}