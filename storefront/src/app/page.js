// src/app/page.js
import Hero from '../components/Hero';
import Collection from '../components/Collection';
import Intro from '../components/Intro';
import IntroMirror from '../components/IntroMirror';
import Footer from '../components/Footer';
import { fetchAllProducts } from '../lib/api';

export default async function Home() {
  // appel Strapi côté serveur
  const products = await fetchAllProducts();

  return (
    <>
      <Hero />
      <Collection products={products} />
      <Intro />
      <IntroMirror />
      <Footer />
    </>
  );
}
