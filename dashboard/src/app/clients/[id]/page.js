// dashboard/src/app/clients/[id]/page.js - Page de détail et édition d'un client

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Edit2, X, Mail, Phone, MapPin, Calendar, User } from 'lucide-react';

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  return new Intl.DateTimeFormat('fr-FR', { 
    dateStyle: 'long',
    timeStyle: 'short'
  }).format(new Date(dateString));
}

function InfoSection({ title, icon: Icon, children }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-3 mb-4">
        <Icon className="w-5 h-5 text-neutral-600" />
        <h2 className="text-lg font-semibold text-neutral-900">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function EditableField({ label, value, isEditing, onChange, type = 'text', placeholder, disabled = false }) {
  if (isEditing && !disabled) {
    return (
      <div className="space-y-1">
        <label className="block text-sm font-medium text-neutral-700">{label}</label>
        <input
          type={type}
          value={value || ''}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-500 transition-colors"
        />
      </div>
    );
  }
  
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-neutral-700">{label}</label>
      <p className="text-sm text-neutral-900 py-2">{value || 'Non renseigné'}</p>
    </div>
  );
}

export default function ClientDetailPage({ params }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
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

  // Charger les données du client
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${params.id}`);
        if (!response.ok) {
          throw new Error('Utilisateur non trouvé');
        }
        const userData = await response.json();
        setUser(userData);
        setEditedUser({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || '',
          phone: userData.phone || '',
          address: userData.address || '',
          city: userData.city || '',
          postalCode: userData.postalCode || '',
          country: userData.country || 'France',
        });
      } catch (err) {
        setError('Erreur lors du chargement des données utilisateur');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [params.id]);

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
      const response = await fetch(`/api/users/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedUser),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour');
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      setSuccess('Profil mis à jour avec succès !');
      setIsEditing(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Erreur lors de la mise à jour');
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-600 mx-auto"></div>
          <p className="mt-2 text-neutral-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Utilisateur non trouvé</p>
        <Link href="/clients" className="text-blue-600 hover:underline mt-2 inline-block">
          Retour à la liste des clients
        </Link>
      </div>
    );
  }

  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Nom non renseigné';

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/clients" className="p-2 rounded-lg hover:bg-neutral-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-neutral-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">{fullName}</h1>
            <p className="text-sm text-neutral-600">ID: {user.id}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              Modifier
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors"
              >
                <X className="w-4 h-4" />
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-600 text-sm">{success}</p>
        </div>
      )}

      {/* Contenu principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Informations personnelles */}
        <div className="lg:col-span-2">
          <InfoSection title="Informations personnelles" icon={User}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <EditableField
                label="Prénom"
                value={editedUser.firstName}
                isEditing={isEditing}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder="Prénom"
              />
              <EditableField
                label="Nom"
                value={editedUser.lastName}
                isEditing={isEditing}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder="Nom"
              />
              <EditableField
                label="Email"
                value={editedUser.email}
                isEditing={false} // Email non modifiable
                disabled={true}
                type="email"
              />
              <EditableField
                label="Téléphone"
                value={editedUser.phone}
                isEditing={isEditing}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                type="tel"
                placeholder="Numéro de téléphone"
              />
            </div>
          </InfoSection>

          {/* Adresse */}
          <div className="mt-6">
            <InfoSection title="Adresse" icon={MapPin}>
              <div className="space-y-4">
                <EditableField
                  label="Adresse"
                  value={editedUser.address}
                  isEditing={isEditing}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Adresse complète"
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    placeholder="Ville"
                  />
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-neutral-700">Pays</label>
                    {isEditing ? (
                      <select
                        value={editedUser.country}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-500 transition-colors"
                      >
                        <option value="France">France</option>
                        <option value="Maroc">Maroc</option>
                      </select>
                    ) : (
                      <p className="text-sm text-neutral-900 py-2">{editedUser.country || 'Non renseigné'}</p>
                    )}
                  </div>
                </div>
              </div>
            </InfoSection>
          </div>
        </div>

        {/* Informations système */}
        <div>
          <InfoSection title="Informations système" icon={Calendar}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Date d'inscription</label>
                <p className="text-sm text-neutral-900">{formatDate(user.createdAt)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Dernière mise à jour</label>
                <p className="text-sm text-neutral-900">{formatDate(user.updatedAt)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Statut</label>
                <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                  Actif
                </span>
              </div>
            </div>
          </InfoSection>
        </div>
      </div>
    </div>
  );
}