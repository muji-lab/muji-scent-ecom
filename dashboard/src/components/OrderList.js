// dashboard/src/components/OrderList.js - VERSION COHÉRENTE EN ANGLAIS

'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const getStrapiImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
  return `${strapiUrl}${url}`;
};

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(dateString));
}

function StatusBadge({ status, type }) {
  const baseStyle = 'px-2 py-1 text-xs font-semibold rounded-full capitalize';
  let colors = 'bg-gray-100 text-gray-800';

  if (type === 'payment') {
    if (status === 'paid') colors = 'bg-green-100 text-green-800';
    if (status === 'pending') colors = 'bg-yellow-100 text-yellow-800';
  } else if (type === 'order') {
    if (status === 'new' || status === "en attente") colors = 'bg-blue-100 text-blue-800'; // "en attente" est une valeur possible dans le code de la V1, on la garde par sécurité
    if (status === 'shipped') colors = 'bg-teal-100 text-teal-800';
  }
  // === CORRECTION : "inconnu" devient "unknown" ===
  return <span className={`${baseStyle} ${colors}`}>{status || 'unknown'}</span>;
}

export default function OrderList({ orders }) {
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const handleToggle = (orderId) => {
    setExpandedOrderId(prevId => (prevId === orderId ? null : orderId));
  };

  if (!orders || orders.length === 0) {
    // Message si aucun résultat après une recherche/filtre
    const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const hasFilters = searchParams && (searchParams.get('q') || searchParams.get('orderStatus') || searchParams.get('paymentStatus'));
    const message = hasFilters ? "Aucune commande ne correspond à vos critères." : "Aucune commande pour le moment.";
    
    return <div className="text-center text-neutral-500 py-12 bg-white rounded-lg shadow-md">{message}</div>;
  }

  // Le reste du composant ne change pas...
  return (
    <>
      <div className="hidden md:block bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-neutral-50">
            <tr><th className="p-4 font-semibold text-neutral-600">Commande</th><th className="p-4 font-semibold text-neutral-600">Date</th><th className="p-4 font-semibold text-neutral-600">Client</th><th className="p-4 font-semibold text-neutral-600">Paiement</th><th className="p-4 font-semibold text-neutral-600">Statut</th><th className="p-4 font-semibold text-neutral-600 text-right">Total</th></tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const imageUrl = getStrapiImageUrl(order.items?.[0]?.image);
              return (
                <tr key={order.id} className="border-b last:border-b-0 hover:bg-neutral-50 transition-colors">
                  <td className="p-4"><Link href={`/orders/${order.customOrderId}`} className="flex items-center gap-3 group"><div className="w-10 h-10 rounded-md bg-neutral-100 border relative shrink-0">{imageUrl && <Image src={imageUrl} alt={order.items[0]?.title || 'Image du produit'} fill className="object-contain p-1" sizes="40px" />}</div><div><div className="font-mono text-xs text-blue-600 group-hover:underline">{order.customOrderId || 'N/A'}</div><div className="text-xs text-neutral-500">{order.items?.length || 0} article(s)</div></div></Link></td>
                  <td className="p-4 text-neutral-600">{formatDate(order.createdAt)}</td>
                  <td className="p-4"><div className="font-medium">{order.firstName} {order.lastName}</div><div className="text-xs text-neutral-500">{order.customerEmail}</div></td>
                  <td className="p-4"><StatusBadge status={order.paymentStatus} type="payment" /></td>
                  <td className="p-4"><StatusBadge status={order.orderStatus} type="order" /></td>
                  <td className="p-4 text-right font-semibold">{typeof order.totalAmount === 'number' ? `${order.totalAmount.toFixed(2)} €` : 'N/A'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="md:hidden bg-white rounded-lg shadow-md divide-y divide-neutral-200">
        {orders.map((order) => (
          <div key={order.id}><div className="p-4 cursor-pointer" onClick={() => handleToggle(order.id)}><div className="flex justify-between items-start mb-2"><div className="flex-1 min-w-0"><p className="font-mono text-sm font-semibold truncate">{order.customOrderId || 'N/A'}</p><p className="text-sm text-neutral-600 truncate">{order.firstName} {order.lastName}</p></div><p className="font-bold text-lg whitespace-nowrap pl-2">{typeof order.totalAmount === 'number' ? `${order.totalAmount.toFixed(2)} €` : 'N/A'}</p></div><div className="flex justify-between items-center text-xs text-neutral-500"><span className="truncate">{formatDate(order.createdAt)}</span><div className="flex items-center gap-2 flex-shrink-0 pl-2"><StatusBadge status={order.paymentStatus} type="payment" /><StatusBadge status={order.orderStatus} type="order" /></div></div></div><AnimatePresence>{expandedOrderId === order.id && (<motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden"><div className="p-4 border-t border-dashed bg-neutral-50"><h4 className="text-xs font-bold uppercase text-neutral-500 mb-2">Articles</h4>{order.items?.map((item, index) => (<div key={index} className="flex justify-between items-center text-sm mb-1"><span>{item.title} ({item.size}) x {item.quantity}</span><span className="font-medium">{(item.price * item.quantity).toFixed(2)} €</span></div>))}<Link href={`/orders/${order.customOrderId}`} className="mt-4 inline-block w-full text-center py-2 bg-black text-white rounded-md text-sm font-medium">Gérer la commande</Link></div></motion.div>)}</AnimatePresence></div>
        ))}
      </div>
    </>
  );
}