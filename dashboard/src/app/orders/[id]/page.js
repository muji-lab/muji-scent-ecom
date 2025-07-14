// dashboard/src/app/orders/[id]/page.js - LA VERSION CORRECTE (Merci à toi !)

import { fetchOrderById } from '@/lib/api';
import OrderDetailView from '@/components/OrderDetailView';

export default async function OrderDetailPageWrapper({ params }) {
  // LA SOLUTION : On attend que la promesse 'params' soit résolue
  // avant d'essayer de lire ses propriétés.
  const { id } = await params;

  let order = null;
  let error = null;

  try {
    order = await fetchOrderById(id);
  } catch (err) {
    console.error(`Erreur lors de la récupération de la commande ${id}:`, err);
    error = "Impossible de charger les détails de la commande.";
  }

  if (error || !order) {
    return (
      <div className="p-4 text-red-600 bg-red-100 rounded-md">
        {error || "Commande introuvable."}
      </div>
    );
  }

  return <OrderDetailView order={order} />;
}