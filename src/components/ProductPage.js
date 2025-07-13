// src/components/ProductPage.js

'use client';

import Image from 'next/image';
import { useState } from 'react';
import { motion } from 'framer-motion';
import useCartStore from '@/store/useCartStore';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';

export default function ProductPage({ product }) {
  const [selectedSize, setSelectedSize] = useState(
    product.sizes?.[0]?.label || '100ml'
  );
  const [accordions, setAccordions] = useState({ 'Livraison & Retours': false });
  const [index, setIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);
  const addToCart = useCartStore((state) => state.addToCart);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const nextImage = () => setIndex((prev) => (prev + 1) % product.images.length);
  const prevImage = () =>
    setIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  const handleTouchStart = (e) =>
    setTouchStartX(e.changedTouches[0].clientX);
  const handleTouchEnd = (e) => {
    const delta = e.changedTouches[0].clientX - touchStartX;
    if (delta < -50) nextImage();
    else if (delta > 50) prevImage();
  };
  const toggleAccordion = (section) => {
    setAccordions((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const currentPrice =
    product.sizes?.find((s) => s.label === selectedSize)?.price ||
    product.price;

  return (
    <div className="relative w-full">
      <motion.div
        className="flex flex-col lg:flex-row"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Slider d'images */}
        <div className="w-full lg:w-1/2 sticky top-0 h-[60vh] lg:h-screen z-0">
          <div
            className="relative w-full h-full overflow-hidden bg-white"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="flex transition-transform duration-500 ease-in-out h-full"
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {product.images.map((url, i) => (
                <div key={i} className="relative min-w-full h-full">
                  <Image
                    src={url}
                    alt={`${product.title} image ${i + 1}`}
                    fill
                    className="object-contain bg-white"
                    priority={i === 0}
                  />
                </div>
              ))}
            </div>

            {product.images.length > 1 && (
              <>
                <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 group" aria-label="Image précédente">
                  <svg className="w-6 h-6 stroke-black drop-shadow-[0_0_2px_white] group-hover:scale-125 transition-transform" fill="none" viewBox="0 0 24 24">
                    <path d="M15 18l-6-6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 group" aria-label="Image suivante">
                  <svg className="w-6 h-6 stroke-black drop-shadow-[0_0_2px_white] group-hover:scale-125 transition-transform" fill="none" viewBox="0 0 24 24">
                    <path d="M9 6l6 6-6 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Contenu */}
        <motion.div
          className="w-full lg:w-1/2 px-4 md:px-8 py-6 lg:py-12 bg-white z-10"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-xs text-neutral-500 mb-1">
            Réf. {product.id.toString().toUpperCase()}
          </p>
          <h1 className="text-2xl font-semibold mb-2 text-black">
            {product.title}
          </h1>
          <p className="text-lg font-medium text-black mb-6">
            {currentPrice} €
          </p>

          {/* Boutons de taille */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-6">
              <p className="text-sm text-neutral-600 mb-2">Taille</p>
              <div className="flex gap-3">
                {product.sizes.map((option) => (
                  <button
                    key={option.label}
                    className={`px-4 py-2 border text-sm rounded-md ${
                      selectedSize === option.label
                        ? 'bg-black text-white border-black'
                        : 'border-neutral-300 text-black hover:bg-neutral-100'
                    }`}
                    onClick={() => setSelectedSize(option.label)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Encadré « Gravure » */}
          <div className="border border-pink-200 bg-pink-50 rounded-md p-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-16 shrink-0">
                <Image
                  src={product.images[0]}
                  alt="Gravure"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-black">
                  Gravure de flacon
                </p>
                <p className="text-xs text-neutral-600">
                  Offert – avec vos initiales ou une date
                </p>
              </div>
            </div>
          </div>

          {/* Ajouter au panier */}
          <button
            className="w-full py-3 bg-black text-white rounded-full text-center text-sm font-medium mb-4 hover:bg-neutral-800"
            onClick={() => addToCart(product, selectedSize)}
          >
            Ajouter au panier
          </button>

          {/* Conseil sur-mesure */}
          <button className="w-full py-3 border border-black text-black rounded-full text-center text-sm font-medium mb-8 hover:bg-neutral-100">
            Bénéficier de conseils sur-mesure
          </button>

          {/* Section Description */}
          {product.description && product.description.length > 0 && (
            <div className="mb-6 border-b pb-4">
              <div 
                className={`relative text-neutral-700 text-sm leading-relaxed whitespace-pre-line transition-all duration-500 ease-in-out ${isDescriptionExpanded ? 'max-h-[1000px]' : 'max-h-24 overflow-hidden'}`}
              >
                <BlocksRenderer content={product.description} />
                {!isDescriptionExpanded && <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white to-transparent" />}
              </div>
              <button 
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                className="text-sm font-medium text-black mt-2 hover:underline"
              >
                {isDescriptionExpanded ? 'Voir moins' : 'Voir plus'}
              </button>
            </div>
          )}

          {/* Accordéon restant */}
          <div className="border-b">
            <button
              className="w-full text-left py-3 text-sm font-medium text-black flex justify-between items-center"
              onClick={() => toggleAccordion('Livraison & Retours')}
            >
              Livraison & Retours
              <span>{accordions['Livraison & Retours'] ? '−' : '+'}</span>
            </button>
            {accordions['Livraison & Retours'] && (
              <div className="pb-3 text-sm text-neutral-600">
                Livraison standard en 3 à 5 jours ouvrés. Retours gratuits sous 30 jours.
              </div>
            )}
          </div>

        </motion.div>
      </motion.div>
    </div>
  );
}