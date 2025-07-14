// src/components/AppClientWrapper.js
'use client';
import Navbar from "./Navbar";
import AddToCartPanel from "./AddToCartPanel";
import CartPanel from "./CartPanel";

export default function AppClientWrapper({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <AddToCartPanel />
      <CartPanel />
    </>
  );
}
