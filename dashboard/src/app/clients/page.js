// dashboard/src/app/clients/page.js - Page de gestion des utilisateurs

import Link from 'next/link';
import { fetchUsers } from '@/lib/api';
import { Mail, Phone, MapPin, Calendar, Edit } from 'lucide-react';

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  return new Intl.DateTimeFormat('fr-FR', { 
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(new Date(dateString));
}

function UserCard({ user }) {
  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Nom non renseigné';
  const address = user.address && user.city 
    ? `${user.address}, ${user.postalCode} ${user.city}` 
    : 'Adresse non renseignée';

  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-neutral-900">{fullName}</h3>
          <p className="text-sm text-neutral-500">ID: {user.id}</p>
        </div>
        <Link 
          href={`/clients/${user.id}`}
          className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
        >
          <Edit className="w-4 h-4" />
        </Link>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center gap-3 text-sm">
          <Mail className="w-4 h-4 text-neutral-500" />
          <span className="text-neutral-700">{user.email}</span>
        </div>
        
        {user.phone && (
          <div className="flex items-center gap-3 text-sm">
            <Phone className="w-4 h-4 text-neutral-500" />
            <span className="text-neutral-700">{user.phone}</span>
          </div>
        )}
        
        <div className="flex items-center gap-3 text-sm">
          <MapPin className="w-4 h-4 text-neutral-500" />
          <span className="text-neutral-700">{address}</span>
        </div>
        
        <div className="flex items-center gap-3 text-sm">
          <Calendar className="w-4 h-4 text-neutral-500" />
          <span className="text-neutral-700">Inscrit le {formatDate(user.createdAt)}</span>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-neutral-100">
        <div className="flex items-center justify-between">
          <span className="text-sm text-neutral-500">Pays</span>
          <span className="text-sm font-medium text-neutral-700">{user.country || 'Non renseigné'}</span>
        </div>
      </div>
    </div>
  );
}

export default async function ClientsPage() {
  const users = await fetchUsers();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Gestion des Clients</h1>
        <div className="text-sm text-neutral-600">
          {users.length} client{users.length !== 1 ? 's' : ''} enregistré{users.length !== 1 ? 's' : ''}
        </div>
      </div>

      {users.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="text-neutral-500 mb-4">
            <Mail className="w-16 h-16 mx-auto mb-4 text-neutral-300" />
            <p className="text-lg font-medium">Aucun client enregistré</p>
            <p className="text-sm mt-2">Les clients apparaîtront ici après leur inscription sur le site.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      )}
    </div>
  );
}