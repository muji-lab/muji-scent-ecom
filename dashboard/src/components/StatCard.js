// dashboard/src/components/StatCard.js - NOUVEAU COMPOSANT

import { ArrowUp } from 'lucide-react';

export default function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
      <div className="bg-black text-white p-3 rounded-full">
        <Icon className="h-6 w-6" />
      </div>
    </div>
  );
}