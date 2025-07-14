// dashboard/src/app/orders/page.js - VERSION REFACTORISÉE ET PROPRE

import { fetchAllOrders } from '@/lib/api';
import OrderList from '@/components/OrderList'; // On importe notre composant d'affichage

export default async function OrdersPage() {
  let orders = [];
  try {
    // La page ne fait qu'une seule chose : récupérer les données.
    orders = await fetchAllOrders();
  } catch (err) {
    return <div className="p-4 text-red-600 bg-red-100 rounded-md">Erreur: Impossible de charger les commandes.</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Gestion des Commandes</h1>
      {/* Elle passe ensuite les données au composant qui sait comment les afficher. */}
      <OrderList orders={orders} />
    </div>
  );
}