// dashboard/src/components/OrderList.js - VERSION FINALE ET CORRECTE

'use client'; // Ce composant a besoin d'interactivité (useState)

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
  return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(dateString));
}

function StatusBadge({ status, type }) {
  const baseStyle = 'px-2 py-0.5 text-xs font-medium rounded-full capitalize';
  let colors = 'bg-gray-100 text-gray-700';
  if (type === 'payment') {
    if (status === 'paid') colors = 'bg-green-100 text-green-700';
    if (status === 'pending') colors = 'bg-yellow-100 text-yellow-700';
  } else if (type === 'order') {
    if (status === 'new' || status === "en attente") colors = 'bg-blue-100 text-blue-700';
    if (status === 'shipped') colors = 'bg-teal-100 text-teal-700';
  }
  return <span className={`${baseStyle} ${colors}`}>{status || 'inconnu'}</span>;
}

export default function OrderList({ orders }) {
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const handleToggle = (orderId) => {
    setExpandedOrderId(prevId => (prevId === orderId ? null : orderId));
  };

  if (!orders || orders.length === 0) {
    return <div className="p-8 text-center text-neutral-500 bg-white rounded-lg shadow-md">Aucune commande pour le moment.</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* VUE DESKTOP */}
      <div className="hidden md:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-neutral-50">
            <tr>
              <th className="p-4 font-semibold text-neutral-600">Commande</th>
              <th className="p-4 font-semibold text-neutral-600">Date</th>
              <th className="p-4 font-semibold text-neutral-600">Client</th>
              <th className="p-4 font-semibold text-neutral-600">Paiement</th>
              <th className="p-4 font-semibold text-neutral-600">Statut</th>
              <th className="p-4 font-semibold text-neutral-600 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const imageUrl = getStrapiImageUrl(order.items?.[0]?.image);
              return (
                <tr key={order.id} className="border-b last:border-b-0 hover:bg-neutral-50 transition-colors">
                  <td className="p-4">
                    <Link href={`/orders/${order.customOrderId}`} className="flex items-center gap-3 group">
                      <div className="w-10 h-10 rounded-md bg-neutral-100 border relative shrink-0">
                        {imageUrl && <Image src={imageUrl} alt={order.items[0]?.title || 'Image du produit'} fill className="object-contain p-1" sizes="40px" />}
                      </div>
                      <div>
                        <div className="font-mono text-xs text-blue-600 group-hover:underline">{order.customOrderId || 'N/A'}</div>
                        <div className="text-xs text-neutral-500">{order.items?.length || 0} article(s)</div>
                      </div>
                    </Link>
                  </td>
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

      {/* VUE MOBILE */}
      <div className="md:hidden divide-y divide-neutral-200">
        {orders.map((order) => (
          <div key={order.id}>
            <div className="p-4 cursor-pointer" onClick={() => handleToggle(order.id)}>
              <div className="flex justify-between items-start mb-2"><p className="font-mono text-sm font-semibold text-blue-600">{order.customOrderId || 'N/A'}</p><p className="font-bold text-lg">{typeof order.totalAmount === 'number' ? `${order.totalAmount.toFixed(2)} €` : 'N/A'}</p></div>
              <p className="text-sm text-neutral-600">{order.firstName} {order.lastName}</p>
            </div>
            <AnimatePresence>
              {expandedOrderId === order.id && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="p-4 border-t border-dashed bg-neutral-50"><h4 className="text-xs font-bold uppercase text-neutral-500 mb-2">Articles</h4>{order.items?.map((item, index) => (<div key={index} className="flex justify-between items-center text-sm mb-1"><span>{item.title} ({item.size}) x {item.quantity}</span><span className="font-medium">{(item.price * item.quantity).toFixed(2)} €</span></div>))}<Link href={`/orders/${order.customOrderId}`} className="mt-4 inline-block w-full text-center py-2 bg-black text-white rounded-md text-sm font-medium">Gérer la commande</Link></div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}