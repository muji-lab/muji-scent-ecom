// src/app/account/orders/page.js - Page Mes commandes

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, Calendar, CreditCard, Truck, CheckCircle, Clock, XCircle } from 'lucide-react';
import Link from 'next/link';

function EmptyState() {
  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Package className="w-10 h-10 text-neutral-400" />
      </div>
      <h3 className="text-lg font-semibold text-neutral-900 mb-2">
        Aucune commande pour le moment
      </h3>
      <p className="text-neutral-600 text-sm mb-6 max-w-md mx-auto">
        Vous n'avez pas encore passé de commande. Découvrez notre collection de parfums et passez votre première commande !
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full hover:bg-neutral-800 transition-colors"
      >
        <Package className="w-4 h-4" />
        Découvrir nos parfums
      </Link>
    </div>
  );
}

function OrderStatusBadge({ status }) {
  const statusConfig = {
    pending: { 
      icon: Clock, 
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      label: 'En attente'
    },
    processing: { 
      icon: Package, 
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      label: 'En cours'
    },
    shipped: { 
      icon: Truck, 
      color: 'bg-purple-100 text-purple-800 border-purple-200',
      label: 'Expédié'
    },
    delivered: { 
      icon: CheckCircle, 
      color: 'bg-green-100 text-green-800 border-green-200',
      label: 'Livré'
    },
    cancelled: { 
      icon: XCircle, 
      color: 'bg-red-100 text-red-800 border-red-200',
      label: 'Annulé'
    }
  };

  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </div>
  );
}

function OrderCard({ order }) {
  const orderDate = new Date(order.createdAt).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const totalAmount = order.totalAmount || 0;
  const orderItems = order.items || [];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-neutral-900 mb-1">
            Commande #{order.customOrderId || order.id}
          </h3>
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <Calendar className="w-4 h-4" />
            <span>{orderDate}</span>
          </div>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {/* Items aperçu */}
      <div className="mb-4">
        <p className="text-sm text-neutral-600 mb-2">
          {orderItems.length} article{orderItems.length > 1 ? 's' : ''}
        </p>
        <div className="flex -space-x-2">
          {orderItems.slice(0, 3).map((item, index) => (
            <div
              key={index}
              className="w-12 h-12 bg-neutral-100 rounded-lg border-2 border-white flex items-center justify-center"
            >
              {item.image ? (
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <Package className="w-6 h-6 text-neutral-400" />
              )}
            </div>
          ))}
          {orderItems.length > 3 && (
            <div className="w-12 h-12 bg-neutral-100 rounded-lg border-2 border-white flex items-center justify-center">
              <span className="text-xs text-neutral-600">+{orderItems.length - 3}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
        <div className="flex items-center gap-2 text-sm text-neutral-600">
          <CreditCard className="w-4 h-4" />
          <span>{totalAmount.toFixed(2)}€</span>
        </div>
        <Link
          href={`/account/orders/${order.id}`}
          className="text-sm text-black hover:underline font-medium"
        >
          Voir détails
        </Link>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [error, setError] = useState('');

  // Rediriger si non connecté
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Charger les commandes
  useEffect(() => {
    if (isAuthenticated && user?.email) {
      fetchOrders();
    }
  }, [isAuthenticated, user]);

  const fetchOrders = async () => {
    try {
      setIsLoadingOrders(true);
      setError('');
      
      // Utiliser l'API route pour récupérer les commandes
      const response = await fetch('/api/orders', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des commandes');
      }

      const data = await response.json();
      setOrders(data || []);
    } catch (err) {
      console.error('Erreur chargement commandes:', err);
      setError('Impossible de charger vos commandes');
    } finally {
      setIsLoadingOrders(false);
    }
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
        <div className="flex items-center gap-4 mb-8">
          <Link href="/account" className="p-2 rounded-full hover:bg-neutral-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-neutral-700" />
          </Link>
          <h1 className="text-2xl font-bold text-neutral-900">Mes commandes</h1>
        </div>

        {/* Contenu */}
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600 text-sm">{error}</p>
            <button
              onClick={fetchOrders}
              className="mt-2 text-sm text-red-700 hover:underline"
            >
              Réessayer
            </button>
          </div>
        ) : null}

        {isLoadingOrders ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
            <p className="mt-2 text-neutral-600">Chargement de vos commandes...</p>
          </div>
        ) : orders.length === 0 ? (
          <EmptyState />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid gap-6">
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}