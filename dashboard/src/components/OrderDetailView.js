// dashboard/src/components/OrderDetailView.js - VERSION RESPONSIVE

'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'long',
    timeStyle: 'medium',
  }).format(new Date(dateString));
}

export default function OrderDetailView({ order }) {
  if (!order) {
    return <div>Commande introuvable.</div>;
  }

  // Calcul du sous-total, des frais de port et du total
  const subtotal = order.items?.reduce((acc, item) => acc + item.price * item.quantity, 0) || 0;
  // Exemple de frais de port fixes, à adapter si nécessaire
  const shippingCost = 0; 
  const total = subtotal + shippingCost;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/orders" className="p-2 rounded-full hover:bg-neutral-200 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl md:text-2xl font-bold">Commande {order.customOrderId || 'N/A'}</h1>
          <p className="text-sm text-neutral-500">
            Passée le {formatDate(order.createdAt)}
          </p>
        </div>
      </div>
      
      {/* ======================= GRILLE RESPONSIVE ======================= */}
      {/* 1 colonne sur mobile, 3 colonnes sur grand écran (lg) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        
        {/* --- COLONNE PRINCIPALE (prend 2/3 de la largeur sur grand écran) --- */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Articles commandés ({order.items?.length || 0})</h2>
            <div className="space-y-4">
              {order.items?.map((item, index) => (
                <div key={index} className="flex items-start gap-4 border-b last:border-b-0 pb-4 last:pb-0">
                  <div className="relative w-16 h-16 border rounded-md bg-neutral-100 shrink-0">
                    {item.image && <Image src={item.image} alt={item.title} fill className="object-contain p-1" />}
                  </div>
                  <div className="flex-grow">
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-sm text-neutral-500">Taille: {item.size}</p>
                    <p className="text-sm text-neutral-500 md:hidden mt-1">{item.quantity} x {item.price.toFixed(2)} €</p>
                  </div>
                  <div className="text-sm text-neutral-500 hidden md:block">{item.quantity} x {item.price.toFixed(2)} €</div>
                  <div className="font-semibold text-right">{(item.quantity * item.price).toFixed(2)} €</div>
                </div>
              ))}
            </div>
            {/* --- Section Total --- */}
            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-between text-sm"><span>Sous-total</span><span>{subtotal.toFixed(2)} €</span></div>
              <div className="flex justify-between text-sm"><span>Livraison</span><span>{shippingCost.toFixed(2)} €</span></div>
              <div className="flex justify-between font-bold mt-2"><span>Total</span><span>{total.toFixed(2)} €</span></div>
            </div>
          </div>
          
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Actions</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="px-4 py-2 bg-black text-white rounded-md text-sm font-medium hover:bg-neutral-800 w-full sm:w-auto">Marquer comme expédiée</button>
              <button className="px-4 py-2 bg-neutral-200 text-neutral-800 rounded-md text-sm font-medium hover:bg-neutral-300 w-full sm:w-auto">Imprimer le bon</button>
            </div>
          </div>
        </div>
        
        {/* --- COLONNE SECONDAIRE (prend 1/3 de la largeur sur grand écran) --- */}
        <div className="space-y-6">
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Client</h2>
            <p className="font-medium">{order.firstName} {order.lastName}</p>
            <a href={`mailto:${order.customerEmail}`} className="text-sm text-blue-600 hover:underline break-all">{order.customerEmail}</a>
          </div>
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Adresse de livraison</h2>
            <p className="text-sm leading-relaxed text-neutral-700 whitespace-pre-line">{order.shippingAddress}</p>
          </div>
        </div>
        
      </div>
    </div>
  );
}