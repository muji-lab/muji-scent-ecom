// dashboard/src/app/layout.js - VERSION RESPONSIVE AVEC MENU MOBILE

// On a besoin de 'useState' pour gérer l'ouverture/fermeture du menu,
// donc on déclare le layout comme un composant client.
'use client';

import { useState } from 'react';
import './globals.css';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { Package, ShoppingCart, Users, Menu, X } from 'lucide-react';

const inter = Inter({ subsets: ['latin'] });

// Le composant pour les liens de navigation reste le même
function NavLink({ href, icon: Icon, children, onClick }) {
  return (
    <Link href={href} onClick={onClick} className="flex items-center gap-3 px-3 py-2 rounded-lg text-neutral-200 hover:bg-neutral-700 hover:text-white transition-colors">
      <Icon className="w-5 h-5" />
      <span>{children}</span>
    </Link>
  );
}

export default function RootLayout({ children }) {
  // État pour savoir si le menu mobile est ouvert ou fermé
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <html lang="fr">
      {/* On empêche le scroll de la page quand le menu mobile est ouvert */}
      <body className={`${inter.className} ${isMobileMenuOpen ? 'overflow-hidden' : ''}`}>
        <div className="min-h-screen flex">
          
          {/* ======================= BARRE LATÉRALE (SIDEBAR) ======================= */}
          {/* Sur grand écran (md et plus) : toujours visible */}
          {/* Sur petit écran : cachée par défaut */}
          <aside className="w-64 bg-neutral-800 text-white p-4 flex-col hidden md:flex">
            <div className="text-xl font-bold mb-8">ADMIN MUJI SCENT</div>
            <nav className="flex flex-col gap-2">
              <NavLink href="/orders" icon={ShoppingCart}>Commandes</NavLink>
              <NavLink href="/products" icon={Package}>Produits</NavLink>
              <NavLink href="/clients" icon={Users}>Clients</NavLink> {/* Corrigé de /customers à /clients */}
            </nav>
            <div className="mt-auto text-xs text-neutral-400">
              © {new Date().getFullYear()} Muji Lab
            </div>
          </aside>
          
          {/* ======================= MENU MOBILE SUPERPOSÉ ======================= */}
          {/* S'affiche uniquement si isMobileMenuOpen est true */}
          {isMobileMenuOpen && (
            <div className="md:hidden fixed inset-0 bg-neutral-800 text-white z-50 p-4 flex flex-col">
               <div className="flex justify-between items-center mb-8">
                <div className="text-xl font-bold">ADMIN MUJI SCENT</div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <nav className="flex flex-col gap-4">
                {/* On passe la fonction pour fermer le menu au clic sur un lien */}
                <NavLink href="/orders" icon={ShoppingCart} onClick={() => setIsMobileMenuOpen(false)}>Commandes</NavLink>
                <NavLink href="/products" icon={Package} onClick={() => setIsMobileMenuOpen(false)}>Produits</NavLink>
                <NavLink href="/clients" icon={Users} onClick={() => setIsMobileMenuOpen(false)}>Clients</NavLink>
              </nav>
            </div>
          )}

          {/* ======================= CONTENU PRINCIPAL ======================= */}
          <main className="flex-1 bg-neutral-100 text-neutral-900 flex flex-col">
            {/* --- HEADER MOBILE --- */}
            <header className="md:hidden flex items-center p-4 bg-white border-b">
              <button onClick={() => setIsMobileMenuOpen(true)} className="p-2">
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="font-bold ml-4">Gestion</h1>
            </header>
            
            {/* Le contenu de la page s'affiche ici */}
            <div className="p-4 md:p-8 flex-1">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}