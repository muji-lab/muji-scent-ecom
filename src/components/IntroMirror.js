'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function IntroMirror() {
  return (
    <section className="w-full flex h-auto md:h-[1000px] flex-col-reverse md:flex-row items-stretch overflow-hidden">
      {/* Texte à gauche */}
      <motion.div
        className="w-full md:w-2/5 flex items-center bg-white p-6 md:p-16 font-libre"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
          <div className="font-libre text-neutral-900 space-y-4">

          <h2 className="text-2xl md:text-4xl font-semibold">
            MUJI SCENT — Pour chaque moment
          </h2>
          <p>
            MUJI SCENT imagine des parfums pour chaque facette de votre quotidien.
            Qu’il s’agisse d’un rendez-vous important, d’un week-end improvisé ou d’une soirée qui compte, nos fragrances s’adaptent à votre rythme et révèlent l’humeur de l’instant.
          </p>
          <p>
            Notes fraîches, boisées ou solaires… Notre palette olfactive offre la liberté de choisir l’émotion que vous souhaitez transmettre.
          </p>
          <p>
            MUJI SCENT — des parfums pour accompagner l’essentiel : vous.
          </p>
        </div>
      </motion.div>

      {/* Image à droite */}
      <motion.div
        className="w-full md:w-3/5 h-[300px] md:h-auto relative"
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
      >
        <div className="relative w-full h-full">
          <Image
            src="/visuels/malette.webp"
            alt="Valise avec parfums MUJI SCENT"
            layout="fill"
            className="object-cover"
            priority
          />
        </div>
      </motion.div>
    </section>
  );
}
