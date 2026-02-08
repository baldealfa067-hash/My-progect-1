import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "BissauFood - Digitalize seu Restaurante",
  description: "A plataforma completa para gestão de restaurantes na Guiné-Bissau. Cardápio digital, gestão de pedidos e relatórios em tempo real.",
};

import { CartProvider } from "@/components/CartContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body
        className={`${outfit.variable} font-sans antialiased`}
      >
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
