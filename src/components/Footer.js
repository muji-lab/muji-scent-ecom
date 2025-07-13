'use client';

import Link from "next/link";

export default function Footer() {
  return (
<footer className="bg-white border-t border-neutral-200 text-sm text-neutral-700 font-light font-libre">
  <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
    
    {/* Marque / Description */}
    <div>
      <h4 className="font-semibold text-neutral-900 mb-2">MUJI SCENT</h4>
      <p className="text-neutral-600 text-sm">
        Parfums élégants et intemporels. Créés pour révéler votre essence.
      </p>
    </div>

    {/* Navigation */}
    <div>
      <h4 className="font-semibold text-neutral-900 mb-2">Navigation</h4>
      <ul className="space-y-1">
        <li><a href="/" className="hover:underline">Accueil</a></li>
        <li><a href="#collection" className="hover:underline">Collection</a></li>
        <li><a href="/contact" className="hover:underline">Contact</a></li>
      </ul>
    </div>

    {/* Infos légales */}
    <div>
      <h4 className="font-semibold text-neutral-900 mb-2">Informations</h4>
      <ul className="space-y-1">
        <li><a href="/policies/legal" className="hover:underline">Mentions légales</a></li>
        <li><a href="/policies/privacy-policy" className="hover:underline">Confidentialité</a></li>
        <li><a href="/policies/refund-policy" className="hover:underline">Retour & Remboursement</a></li>
      </ul>
    </div>

    {/* Newsletter */}
    <div>
      <h4 className="font-semibold text-neutral-900 mb-2">Newsletter</h4>
      <p className="text-neutral-600 text-sm mb-2">
        Recevez nos dernières nouveautés et offres exclusives.
      </p>
      <form className="flex">
        <input
          type="email"
          placeholder="Votre e-mail"
          className="w-full px-3 py-2 border border-neutral-300 rounded-l-md text-sm focus:outline-none"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-black text-white text-sm rounded-r-md hover:bg-neutral-800"
        >
          OK
        </button>
      </form>
    </div>
  </div>

  {/* Bas de page avec logo centré */}
  <div className="border-t border-neutral-200 py-6 text-center">
    <p className="text-lg md:text-2xl font-normal tracking-wide text-neutral-900">
      MUJI SCENT
    </p>
    <p className="mt-1 text-xs text-neutral-500">
      © {new Date().getFullYear()} Tous droits réservés.
    </p>
  </div>
</footer>

  );
}
