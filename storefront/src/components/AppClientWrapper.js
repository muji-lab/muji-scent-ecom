// src/components/AppClientWrapper.js
'use client';
import Navbar from "./Navbar";
import AddToCartPanel from "./AddToCartPanel";
import CartPanel from "./CartPanel";
import { AuthProvider } from "../contexts/AuthContext";

export default function AppClientWrapper({ children }) {
  return (
    <AuthProvider>
      <Navbar />
      {children}
      <AddToCartPanel />
      <CartPanel />
    </AuthProvider>
  );
}
