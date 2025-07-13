// src/app/layout.js
import "./globals.css";
import { Inter } from "next/font/google";
import AppClientWrapper from "@/components/AppClientWrapper";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata = {
  title: "MUJI SCENT",
  description: "Parfums élégants et minimalistes",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="font-sans antialiased">
        <AppClientWrapper>
          {children}
        </AppClientWrapper>
      </body>
    </html>
  );
}
