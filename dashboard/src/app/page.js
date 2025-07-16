// dashboard/src/app/page.js - VERSION BENTO UI

import Link from 'next/link';
import { fetchTodaysOrders, fetchOrdersToShip } from '@/lib/api';
import StatCard from '@/components/StatCard';
import { DollarSign, ShoppingBag, Truck } from 'lucide-react';

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium' }).format(new Date(dateString));
}

export default async function DashboardPage() {
  // On récupère toutes les données nécessaires en parallèle
  const [todaysOrders, ordersToShip] = await Promise.all([
    fetchTodaysOrders(),
    fetchOrdersToShip(4), // On veut les 4 plus urgentes
  ]);

  // On calcule les statistiques
  const todaysRevenue = todaysOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const todaysOrdersCount = todaysOrders.length;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Tableau de Bord</h1>

      {/* --- Grille Principale (Bento) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* --- Cartes de Statistiques --- */}
        <StatCard title="CA Aujourd'hui" value={`${todaysRevenue.toFixed(2)} €`} icon={DollarSign} />
        <StatCard title="Commandes Aujourd'hui" value={todaysOrdersCount} icon={ShoppingBag} />
        <StatCard title="À Expédier" value={ordersToShip.length} icon={Truck} />

        {/* --- Colonne des Commandes à Expédier --- */}
        <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
          <h2 className="font-bold mb-4">Commandes à Expédier</h2>
          <div className="space-y-4">
            {ordersToShip.length > 0 ? (
              ordersToShip.map(order => (
                <Link href={`/orders/${order.customOrderId}`} key={order.id} className="block p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{order.customOrderId}</p>
                      <p className="text-sm text-gray-500">{order.firstName} {order.lastName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{order.totalAmount.toFixed(2)} €</p>
                      <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-gray-500 text-sm text-center py-4">Aucune commande à expédier. Bravo !</p>
            )}
          </div>
        </div>

        {/* --- Colonne des Dernières Commandes --- */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="font-bold mb-4">Dernières 24h</h2>
           <div className="space-y-4">
            {todaysOrders.slice(0, 5).map(order => ( // On affiche les 5 dernières d'aujourd'hui
              <div key={order.id} className="text-sm">
                <p className="font-medium">{order.firstName} {order.lastName} a commandé.</p>
                <p className="text-gray-500">Total: {order.totalAmount.toFixed(2)} €</p>
              </div>
            ))}
            {todaysOrders.length === 0 && <p className="text-gray-500 text-sm">Aucune activité pour l'instant.</p>}
          </div>
        </div>
        
      </div>
    </div>
  );
}