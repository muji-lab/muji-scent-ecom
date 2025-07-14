'use client';

import Image from "next/image";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section id="hero" className="relative w-full h-screen bg-white overflow-hidden">
      {/* Mobile Image */}
      <div className="block md:hidden relative w-full h-full">
        <Image
          src="/visuels/gamme_mobile.webp"
          alt="MUJI SCENT mobile"
          fill
          className="object-cover object-bottom"
          priority
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="absolute bottom-8 w-full flex justify-center px-4"
        >
          <a href="#collection" className="text-black font-libre font-light text-base sm:text-lg text-center animate-pulse">
            Découvrez la gamme ↓
          </a>
        </motion.div>
      </div>

      {/* Desktop Image */}
      <div className="hidden md:block relative w-full h-full">
        <motion.div
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src="/visuels/gamme_parfums_1.webp"
            alt="MUJI SCENT desktop"
            fill
            className="object-cover object-center"
            priority
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute inset-x-0 bottom-[8%] flex justify-center px-4"
        >
          <a href="#collection" className="text-white font-libre font-light text-lg lg:text-xl text-center animate-pulse">
            Découvrez la gamme ↓
          </a>
        </motion.div>
      </div>
    </section>
  );
}
