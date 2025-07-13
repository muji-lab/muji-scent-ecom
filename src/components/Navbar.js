
'use client';

import Link from "next/link";
import { Menu, Search, User, ShoppingBag, Heart } from "lucide-react";
import useCartStore from "@/store/useCartStore";

export default function Navbar() {
const items = useCartStore((state) => state.items);
const openCartPanel = useCartStore((state) => state.openCartPanel);
  const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);

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
        <Link href="/contact" className="hidden md:inline hover:underline">
          Contactez-nous
        </Link>
        <Heart className="w-5 h-5" />
        <User className="w-5 h-5" />

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
    </nav>
  );
}
