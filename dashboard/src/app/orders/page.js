// dashboard/src/app/orders/page.js - VERSION AVEC RECHERCHE ET FILTRES

import { fetchAllOrders } from '@/lib/api';
import OrderList from '@/components/OrderList';
import SearchInput from '@/components/SearchInput';
import OrderFilters from '@/components/OrderFilters'; 

export default async function OrdersPage({ searchParams }) {
  // On attend que la promesse soit résolue (correction Next.js 15)
  const resolvedSearchParams = await searchParams;

  // On récupère TOUS les paramètres de l'URL
  const query = resolvedSearchParams?.q || '';
  const filters = {
    orderStatus: resolvedSearchParams?.orderStatus || '',
    paymentStatus: resolvedSearchParams?.paymentStatus || '',
  };
  
  let orders = [];
  try {
    // On passe l'objet complet à notre fonction API
    orders = await fetchAllOrders({ query, filters });
  } catch (err) {
    return <div className="p-4 text-red-600 bg-red-100 rounded-md">Erreur: Impossible de charger les commandes.</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Commandes</h1>
      </div>
      
      {/* On place les composants de recherche et de filtres */}
      <SearchInput />
      <OrderFilters />
      
      <OrderList orders={orders} />
    </div>
  );
}