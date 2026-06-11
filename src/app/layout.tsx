import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import LoadingScreen from "@/components/n10k/LoadingScreen";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "N10K | Ropa de Caballero",
  description: "N10K - Ropa masculina urbana y deportiva. Descubre nuestra colección de streetwear para caballero con estilo audaz y sin límites.",
  keywords: ["N10K", "ropa de caballero", "streetwear", "moda urbana masculina", "ropa deportiva masculina"],
  authors: [{ name: "N10K" }],
  icons: {
    icon: [
      { url: '/brand/Icon_Mascota.png', sizes: '64x64', type: 'image/png' },
    ],
    apple: '/brand/Icon_Mascota.png',
  },
  other: {
    "font-display": "swap",
  },
  openGraph: {
    title: "N10K | Ropa de Caballero",
    description: "Ropa masculina urbana y deportiva. Caballero.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning className="dark">
      <body
        className={`${montserrat.variable} antialiased bg-background text-foreground`}
      >
        <LoadingScreen />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
