/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/visuels/**',
      },
    ],
  },
};

// LA CORRECTION : On utilise la syntaxe ES Module 'export default'
// au lieu de l'ancienne syntaxe 'module.exports'
export default nextConfig;