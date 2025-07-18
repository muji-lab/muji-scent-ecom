// src/lib/auth.js - API d'authentification pour Strapi v5

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

// Fonction pour l'inscription
export async function register(userData) {
  try {
    console.log('🔄 lib/auth - Envoi des données via API route:', {
      username: userData.username,
      email: userData.email,
      fieldsCount: Object.keys(userData).length
    });
    
    // Utiliser l'API route Next.js pour éviter les problèmes de CORS et localhost sur mobile
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    console.log('📝 lib/auth - Statut réponse API:', response.status);
    
    const data = await response.json();
    console.log('📝 lib/auth - Données reçues:', data);
    
    if (!response.ok) {
      console.error('❌ lib/auth - Erreur API:', data);
      throw new Error(data.error || 'Erreur lors de l\'inscription');
    }

    console.log('✅ lib/auth - Inscription réussie');
    return data;
  } catch (error) {
    console.error('❌ lib/auth - Erreur inscription:', error);
    throw error;
  }
}

// Fonction pour la connexion
export async function login(credentials) {
  try {
    console.log('🔄 lib/auth - Envoi des credentials via API route:', {
      identifier: credentials.identifier,
      fieldsCount: Object.keys(credentials).length
    });
    
    // Utiliser l'API route Next.js pour éviter les problèmes de CORS et localhost sur mobile
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    console.log('📝 lib/auth - Statut réponse login:', response.status);
    
    const data = await response.json();
    console.log('📝 lib/auth - Données login reçues:', data);
    
    if (!response.ok) {
      console.error('❌ lib/auth - Erreur login:', data);
      throw new Error(data.error || 'Erreur lors de la connexion');
    }

    console.log('✅ lib/auth - Connexion réussie');
    return data;
  } catch (error) {
    console.error('❌ lib/auth - Erreur connexion:', error);
    throw error;
  }
}

// Fonction pour récupérer le profil utilisateur
export async function getProfile(jwt) {
  try {
    console.log('🔄 lib/auth - Récupération du profil via API route');
    
    // Utiliser l'API route Next.js pour éviter les problèmes de CORS et localhost sur mobile
    const response = await fetch('/api/auth/profile', {
      headers: {
        'Authorization': `Bearer ${jwt}`,
      },
    });

    console.log('📝 lib/auth - Statut réponse profile:', response.status);
    
    const data = await response.json();
    console.log('📝 lib/auth - Données profile reçues:', data);
    
    if (!response.ok) {
      console.error('❌ lib/auth - Erreur profile:', data);
      throw new Error(data.error || 'Erreur lors de la récupération du profil');
    }

    console.log('✅ lib/auth - Profil récupéré avec succès');
    return data;
  } catch (error) {
    console.error('❌ lib/auth - Erreur profil:', error);
    throw error;
  }
}

// Fonction pour mettre à jour le profil utilisateur
export async function updateProfile(jwt, userData) {
  try {
    console.log('🔄 lib/auth - Mise à jour du profil via API route:', {
      fieldsCount: Object.keys(userData).length,
      fields: Object.keys(userData)
    });
    
    // Utiliser l'API route Next.js pour éviter les problèmes de CORS et localhost sur mobile
    const response = await fetch('/api/auth/update-profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`,
      },
      body: JSON.stringify(userData),
    });

    console.log('📝 lib/auth - Statut réponse update:', response.status);
    
    const data = await response.json();
    console.log('📝 lib/auth - Données update reçues:', data);
    
    if (!response.ok) {
      console.error('❌ lib/auth - Erreur update:', data);
      throw new Error(data.error || 'Erreur lors de la mise à jour du profil');
    }

    console.log('✅ lib/auth - Profil mis à jour avec succès');
    return data;
  } catch (error) {
    console.error('❌ lib/auth - Erreur mise à jour profil:', error);
    throw error;
  }
}

// Fonction pour récupérer les commandes d'un utilisateur
export async function getUserOrders(jwt, userEmail) {
  try {
    const response = await fetch(`${STRAPI_URL}/api/orders?filters[customerEmail][$eq]=${encodeURIComponent(userEmail)}&populate=*`, {
      headers: {
        'Authorization': `Bearer ${jwt}`,
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Erreur lors de la récupération des commandes');
    }

    return data;
  } catch (error) {
    console.error('Erreur commandes:', error);
    throw error;
  }
}