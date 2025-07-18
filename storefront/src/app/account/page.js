// src/app/account/page.js - Page Mon compte avec édition du profil

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import { ArrowLeft, Edit2, Save, X, User, MapPin, Phone, Mail, LogOut, Calendar, Package } from 'lucide-react';
import Link from 'next/link';
import Modal from '../../components/Modal';
import Toast from '../../components/Toast';

function ProfileSection({ title, icon: Icon, children }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100">
      <div className="flex items-center gap-3 mb-4">
        <Icon className="w-5 h-5 text-neutral-600" />
        <h2 className="text-lg font-semibold text-neutral-900">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function EditableField({ label, value, isEditing, onChange, type = 'text', placeholder }) {
  if (isEditing) {
    return (
      <div className="space-y-1">
        <label className="block text-sm font-medium text-neutral-700">{label}</label>
        <input
          type={type}
          value={value || ''}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-black transition-colors"
        />
      </div>
    );
  }
  
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-neutral-700">{label}</label>
      <p className="text-sm text-neutral-900">{value || 'Non renseigné'}</p>
    </div>
  );
}

export default function AccountPage() {
  const { user, isAuthenticated, isLoading, signOut, updateUserProfile } = useAuth();
  const router = useRouter();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showLogoutTransition, setShowLogoutTransition] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  
  const [editedUser, setEditedUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });

  // Rediriger si non connecté
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Initialiser les données utilisateur
  useEffect(() => {
    if (user) {
      setEditedUser({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        postalCode: user.postalCode || '',
        country: user.country || 'France',
      });
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setEditedUser(prev => ({ ...prev, [field]: value }));
    setError('');
    setSuccess('');
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      const result = await updateUserProfile(editedUser);
      
      if (result.success) {
        setIsEditing(false);
        setShowSuccessToast(true);
      } else {
        setError(result.error || 'Erreur lors de la mise à jour');
      }
    } catch (err) {
      setError('Une erreur inattendue est survenue');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setEditedUser({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        postalCode: user.postalCode || '',
        country: user.country || 'France',
      });
    }
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    setShowLogoutTransition(true);
    
    // Déconnexion après 2 secondes
    setTimeout(() => {
      setShowLogoutTransition(false);
      signOut();
      router.push('/');
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className="bg-neutral-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
          <p className="mt-2 text-neutral-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="bg-neutral-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="p-2 rounded-full hover:bg-neutral-100 transition-colors">
                <ArrowLeft className="w-5 h-5 text-neutral-700" />
              </Link>
              <h1 className="text-2xl font-bold text-neutral-900">Mon compte</h1>
            </div>
            
            {/* Bouton modifier uniquement si pas en édition */}
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-neutral-800 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                <span className="hidden sm:inline">Modifier</span>
              </button>
            )}
          </div>
          
          {/* Boutons d'action en mode édition - responsive */}
          {isEditing && (
            <div className="mt-4 flex flex-col sm:flex-row gap-3 sm:gap-2 sm:justify-end">
              <button
                onClick={handleCancel}
                className="flex items-center justify-center gap-2 px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors"
              >
                <X className="w-4 h-4" />
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          )}
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
        

        {/* Contenu principal - Layout bento */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Colonne gauche - Informations personnelles */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informations personnelles */}
            <ProfileSection title="Informations personnelles" icon={User}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <EditableField
                  label="Prénom"
                  value={editedUser.firstName}
                  isEditing={isEditing}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="Votre prénom"
                />
                <EditableField
                  label="Nom"
                  value={editedUser.lastName}
                  isEditing={isEditing}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Votre nom"
                />
                <EditableField
                  label="Email"
                  value={editedUser.email}
                  isEditing={false} // Email non modifiable
                  type="email"
                />
                <EditableField
                  label="Téléphone"
                  value={editedUser.phone}
                  isEditing={isEditing}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  type="tel"
                  placeholder="Votre numéro de téléphone"
                />
              </div>
            </ProfileSection>

            {/* Adresse */}
            <ProfileSection title="Adresse de livraison" icon={MapPin}>
              <div className="space-y-4">
                <EditableField
                  label="Adresse"
                  value={editedUser.address}
                  isEditing={isEditing}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Votre adresse"
                />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <EditableField
                    label="Code postal"
                    value={editedUser.postalCode}
                    isEditing={isEditing}
                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
                    placeholder="Code postal"
                  />
                  <EditableField
                    label="Ville"
                    value={editedUser.city}
                    isEditing={isEditing}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="Votre ville"
                  />
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-neutral-700">Pays</label>
                    {isEditing ? (
                      <select
                        value={editedUser.country}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm text-neutral-900 focus:outline-none focus:ring-1 focus:ring-black transition-colors"
                      >
                        <option value="France">France</option>
                        <option value="Maroc">Maroc</option>
                      </select>
                    ) : (
                      <p className="text-sm text-neutral-900">{editedUser.country || 'Non renseigné'}</p>
                    )}
                  </div>
                </div>
              </div>
            </ProfileSection>
          </div>

          {/* Colonne droite - Actions et résumé */}
          <div className="space-y-6">
            {/* Résumé du profil */}
            <div className="bg-gradient-to-br from-black to-neutral-800 rounded-xl p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  {/* Motif décoratif simple */}
                  <div className="w-6 h-6 grid grid-cols-2 gap-0.5">
                    <div className="w-2.5 h-2.5 bg-white bg-opacity-80 rounded-sm"></div>
                    <div className="w-2.5 h-2.5 bg-white bg-opacity-60 rounded-sm"></div>
                    <div className="w-2.5 h-2.5 bg-white bg-opacity-60 rounded-sm"></div>
                    <div className="w-2.5 h-2.5 bg-white bg-opacity-80 rounded-sm"></div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
                    {[editedUser.firstName, editedUser.lastName].filter(Boolean).join(' ') || 'Utilisateur'}
                  </h3>
                  <p className="text-white text-opacity-80 text-sm">{editedUser.email}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                {editedUser.city && (
                  <div className="flex items-center gap-2 text-white text-opacity-80 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>{editedUser.city}, {editedUser.country}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2 text-white text-opacity-80 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>Membre depuis {new Date(user?.createdAt || Date.now()).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</span>
                </div>
              </div>
              
              {/* Liens rapides */}
              <div className="mt-4 space-y-2">
                <Link
                  href="/account/orders"
                  className="flex items-center gap-2 text-white text-opacity-80 hover:text-opacity-100 transition-opacity text-sm"
                >
                  <Package className="w-4 h-4" />
                  <span>Mes commandes</span>
                </Link>
              </div>
            </div>

            {/* Actions */}
            <ProfileSection title="Actions" icon={LogOut}>
              <div className="space-y-3">
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Se déconnecter
                </button>
              </div>
            </ProfileSection>
          </div>
        </div>
      </div>

      {/* Modal de déconnexion */}
      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Confirmer la déconnexion"
        size="sm"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogOut className="w-8 h-8 text-red-600" />
          </div>
          
          <p className="text-neutral-600 text-sm mb-6">
            Êtes-vous sûr de vouloir vous déconnecter ?
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={() => setShowLogoutModal(false)}
              className="flex-1 px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={confirmLogout}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Se déconnecter
            </button>
          </div>
        </div>
      </Modal>

      {/* Toast de succès */}
      <Toast
        isOpen={showSuccessToast}
        onClose={() => setShowSuccessToast(false)}
        type="success"
        title="Profil mis à jour"
        message="Vos informations ont été sauvegardées avec succès."
      />

      {/* Modal de transition de déconnexion */}
      <Modal
        isOpen={showLogoutTransition}
        onClose={() => {}} // Pas de fermeture manuelle pour cette modal
        showCloseButton={false}
        size="sm"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <LogOut className="w-8 h-8 text-neutral-600" />
            </motion.div>
          </div>
          
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">
            Au revoir !
          </h3>
          <p className="text-neutral-600 text-sm mb-4">
            Vous êtes en cours de déconnexion...
          </p>
          
          <div className="flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-5 h-5 border-2 border-neutral-300 border-t-neutral-600 rounded-full"
            />
          </div>
        </div>
      </Modal>

    </div>
  );
}