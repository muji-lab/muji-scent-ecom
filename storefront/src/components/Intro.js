'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Intro() {
  return (
    <section className="w-full flex flex-col md:flex-row h-auto md:h-[1000px] overflow-hidden">
      {/* Image */}
      <motion.div
        className="relative w-full md:w-full h-[300px] md:h-full"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <Image
          src="/visuels/sunset_scene_large.webp"
          alt="MUJI SCENT ambiance"
          fill
          className="object-cover"
          priority
        />
      </motion.div>

      {/* Texte */}
      <motion.div
        className="w-full md:w-[40%] bg-white flex items-center px-6 py-8 md:px-12"
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
      >
        <div className="font-libre text-neutral-900 space-y-4">
          <h2 className="text-2xl md:text-4xl font-semibold">
            MUJI SCENT — L’essence d’une élégance libre
          </h2>

          <p>
            Née à Paris, MUJI SCENT incarne une vision contemporaine de la parfumerie de créateur.
            À la croisée de l'avant-garde et du raffinement, la maison célèbre les émotions légères et les atmosphères solaires.
          </p>

          <p>
            Chaque fragrance est une échappée sensorielle, une parenthèse de fraîcheur où les agrumes vibrent,
            les herbes rares s’épanouissent, et les bois subtils murmurent à fleur de peau.
          </p>

          <p>
            Qu’il s’agisse d’un matin calme au bord d’un lac ou d’une nuit vibrante au rythme d’une fête intime,
            MUJI SCENT sublime ces instants que l’on chérit.
          </p>

          <p>
            Une écriture olfactive fraîche, lumineuse et toujours élégante — pour celles et ceux qui vivent l’été comme un état d’esprit.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
