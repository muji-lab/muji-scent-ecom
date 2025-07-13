'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function Collection({ products }) {
  return (
    <section className="py-16 bg-white">
      <motion.div
        className="grid grid-cols-2 md:grid-cols-5 gap-0 justify-items-center"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.3 }}
      >
        {products.map((product) => (
          <motion.div
            key={product.id}
            variants={itemVariants}
            className="w-full"
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

function ProductCard({ product }) {
  const [idx, setIdx] = useState(0);
  const [startX, setStartX] = useState(0);

  // on affiche jusqu'à 2 images, ou un placeholder si vide
  const images = product.images.length
    ? product.images.slice(0, 2)
    : ['/placeholder.png'];

  const nextImage = () => setIdx((i) => (i + 1) % images.length);
  const prevImage = () => setIdx((i) => (i - 1 + images.length) % images.length);

  return (
    <Link href={`/product/${product.slug}`} className="group text-center w-full">
      <div
        className="relative aspect-[3/4] w-full overflow-hidden bg-white"
        onTouchStart={(e) => setStartX(e.changedTouches[0].clientX)}
        onTouchEnd={(e) => {
          const delta = e.changedTouches[0].clientX - startX;
          if (delta < -50) nextImage();
          else if (delta > 50) prevImage();
        }}
      >
        <div
          className="flex transition-transform duration-500 ease-in-out h-full"
          style={{ transform: `translateX(-${idx * 100}%)` }}
        >
          {images.map((url, i) => (
            <div key={i} className="relative min-w-full h-full">
              <Image
                src={url}
                alt={`${product.title} image ${i + 1}`}
                fill
                className="object-contain bg-white"
              />
            </div>
          ))}
        </div>

        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.preventDefault();
                prevImage();
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 group"
            >
              <svg
                className="w-6 h-6 stroke-black drop-shadow-[0_0_2px_white] group-hover:scale-125 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  d="M15 18l-6-6 6-6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <button
              onClick={(e) => {
                e.preventDefault();
                nextImage();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 group"
            >
              <svg
                className="w-6 h-6 stroke-black drop-shadow-[0_0_2px_white] group-hover:scale-125 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  d="M9 6l6 6-6 6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </>
        )}
      </div>

      <div className="mt-4 text-base font-light tracking-wide text-neutral-900">
        Parfum {product.title}
      </div>
      <div className="text-base text-neutral-700 mt-1">
        {product.sizes.length
          ? `À partir de ${Math.min(
              ...product.sizes.map((s) => s.price)
            )} €`
          : `${product.price} €`}
      </div>
    </Link>
  );
}
