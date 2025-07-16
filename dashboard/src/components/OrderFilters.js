// dashboard/src/components/OrderFilters.js - VERSION EN ANGLAIS

'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export default function OrderFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleFilterChange = (filterName, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(filterName, value);
    } else {
      params.delete(filterName);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6">
      <div>
        <label htmlFor="orderStatus" className="block text-sm font-medium text-gray-700 mb-1">Order Status</label>
        <select
          id="orderStatus"
          value={searchParams.get('orderStatus') || ''}
          onChange={(e) => handleFilterChange('orderStatus', e.target.value)}
          className="w-full sm:w-48 border-gray-300 rounded-lg shadow-sm focus:border-black focus:ring-black"
        >
          <option value="">All</option>
          <option value="new">New</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      <div>
        <label htmlFor="paymentStatus" className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
        <select
          id="paymentStatus"
          value={searchParams.get('paymentStatus') || ''}
          onChange={(e) => handleFilterChange('paymentStatus', e.target.value)}
          className="w-full sm:w-48 border-gray-300 rounded-lg shadow-sm focus:border-black focus:ring-black"
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>
    </div>
  );
}