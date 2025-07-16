// dashboard/next.config.mjs - VERSION AVEC UPLOADTHING AUTORISÉ

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // On garde notre autorisation pour les images qui viennent de Strapi
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
      // On garde l'autre chemin si besoin
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/visuels/**',
      },
      // === LA NOUVELLE RÈGLE EST ICI ===
      // On autorise Next.js à charger les images depuis les serveurs d'uploadthing
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: '',
        pathname: '/f/**',
      },
    ],
  },
};

export default nextConfig;
