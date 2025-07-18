
'use client';

import Link from "next/link";
import { Menu, Search, User, ShoppingBag, Heart, LogOut } from "lucide-react";
import useCartStore from "../store/useCartStore";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import LogoutModal from "./LogoutModal";
import ContactModal from "./ContactModal";

export default function Navbar() {
const items = useCartStore((state) => state.items);
const openCartPanel = useCartStore((state) => state.openCartPanel);
  const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);
  
  
  const { user, isAuthenticated, signOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLogoutTransition, setShowLogoutTransition] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const router = useRouter();

  return (
    <nav className="relative w-full px-4 md:px-10 py-6 border-b border-gray-200 bg-white text-black flex items-center justify-between">
      
      {/* Gauche */}
      <div className="flex items-center gap-4 text-sm">
        <button className="flex items-center gap-1 cursor-pointer">
          <Menu className="w-5 h-5" />
          <span>Menu</span>
        </button>
        <Search className="w-5 h-5" />
        <input
          type="text"
          placeholder="Que recherchez-vous ?"
          className="hidden md:inline-block text-sm px-2 py-1 border border-gray-300 rounded"
        />
      </div>

      {/* Logo centré */}
      <Link
        href="/"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-lg md:text-3xl tracking-wider font-light"
      >
        MUJI SCENT
      </Link>

      {/* Droite */}
      <div className="flex items-center gap-4 text-sm">
        <button 
          onClick={() => setShowContactModal(true)}
          className="hidden md:inline hover:underline"
        >
          Contactez-nous
        </button>
        
        {/* Menu utilisateur */}
        <div className="relative">
          {isAuthenticated ? (
            <>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-1 p-1 rounded-full hover:bg-neutral-100 transition-colors"
                aria-label="Menu utilisateur"
              >
                <User className="w-5 h-5" />
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-neutral-200 rounded-lg shadow-lg py-2 z-50">
                  <div className="px-4 py-2 border-b border-neutral-200">
                    <p className="text-sm font-medium">{user?.username}</p>
                    <p className="text-xs text-neutral-500">{user?.email}</p>
                  </div>
                  <Link
                    href="/account"
                    className="block px-4 py-2 text-sm hover:bg-neutral-100 transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Mon compte
                  </Link>
                  <Link
                    href="/account/orders"
                    className="block px-4 py-2 text-sm hover:bg-neutral-100 transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Mes commandes
                  </Link>
                  <hr className="my-2" />
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      setShowLogoutTransition(true);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-neutral-100 transition-colors flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Se déconnecter
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-1 p-1 rounded-full hover:bg-neutral-100 transition-colors"
                aria-label="Menu utilisateur"
              >
                <User className="w-5 h-5" />
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-neutral-200 rounded-lg shadow-lg py-2 z-50">
                  <div className="px-4 py-3 border-b border-neutral-200">
                    <p className="text-sm font-medium text-neutral-900">Bienvenue !</p>
                  </div>
                  <Link
                    href="/auth/login"
                    className="block px-4 py-2 text-sm hover:bg-neutral-100 transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Connexion
                  </Link>
                  <Link
                    href="/auth/register"
                    className="block px-4 py-2 text-sm hover:bg-neutral-100 transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Créer un compte
                  </Link>
                </div>
              )}
            </>
          )}
        </div>

        {/* Panier cliquable */}
<button onClick={openCartPanel} className="relative z-[999]" aria-label="Voir le panier">
          <ShoppingBag className="w-5 h-5" />
          {totalQuantity > 0 && (
            <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
              {totalQuantity}
            </span>
          )}
        </button>
      </div>
      
      {/* Modal de déconnexion globale */}
      <LogoutModal
        isOpen={showLogoutTransition}
        onLogout={() => {
          signOut();
          // Attendre que la modal se ferme avant de naviguer
          setTimeout(() => {
            setShowLogoutTransition(false);
            window.location.href = '/';
          }, 1800);
        }}
      />
      
      {/* Modal de contact */}
      <ContactModal 
        isOpen={showContactModal} 
        onClose={() => setShowContactModal(false)} 
      />
      
    </nav>
  );
}
