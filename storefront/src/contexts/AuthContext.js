// src/contexts/AuthContext.js - Contexte d'authentification pour Strapi v5

'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { register, login, getProfile, updateProfile } from '../lib/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Vérifier si l'utilisateur est connecté au chargement
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('jwt');
        if (token) {
          const profile = await getProfile(token);
          setUser(profile);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification:', error);
        localStorage.removeItem('jwt');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Fonction d'inscription
  const signUp = async (userData) => {
    try {
      console.log('🔄 AuthContext - Tentative d\'inscription...');
      const response = await register(userData);
      console.log('📝 AuthContext - Réponse Strapi:', response);
      
      const { jwt, user } = response;
      
      if (!jwt || !user) {
        console.error('❌ AuthContext - JWT ou user manquant:', { jwt: !!jwt, user: !!user });
        return { success: false, error: 'Réponse invalide du serveur' };
      }
      
      localStorage.setItem('jwt', jwt);
      setUser(user);
      setIsAuthenticated(true);
      
      console.log('✅ AuthContext - Inscription réussie');
      return { success: true, user };
    } catch (error) {
      console.error('❌ AuthContext - Erreur inscription:', error);
      return { success: false, error: error.message };
    }
  };

  // Fonction de connexion
  const signIn = async (credentials) => {
    try {
      const response = await login(credentials);
      const { jwt, user } = response;
      
      localStorage.setItem('jwt', jwt);
      setUser(user);
      setIsAuthenticated(true);
      
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Fonction de déconnexion
  const signOut = () => {
    localStorage.removeItem('jwt');
    setUser(null);
    setIsAuthenticated(false);
  };

  // Fonction pour obtenir le token
  const getToken = () => {
    return localStorage.getItem('jwt');
  };

  // Fonction pour mettre à jour le profil
  const updateUserProfile = async (userData) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Utilisateur non connecté');
      }
      
      const updatedUser = await updateProfile(token, userData);
      setUser(updatedUser);
      
      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Erreur mise à jour profil:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    signUp,
    signIn,
    signOut,
    getToken,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};