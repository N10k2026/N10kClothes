'use client';

import { useEffect } from 'react';
import Header from '@/components/n10k/Header';
import HeroSection from '@/components/n10k/HeroSection';
import ProductGrid from '@/components/n10k/ProductGrid';
import ProductDetail from '@/components/n10k/ProductDetail';
import CartSidebar from '@/components/n10k/CartSidebar';
import WishlistSidebar from '@/components/n10k/WishlistSidebar';
import AboutSection from '@/components/n10k/AboutSection';
import NewsletterSection from '@/components/n10k/NewsletterSection';
import Footer from '@/components/n10k/Footer';
import InteractiveBackground from '@/components/n10k/InteractiveBackground';
import FloatingNavBar from '@/components/n10k/FloatingNavBar';
import AuthModal from '@/components/n10k/AuthModal';
import { Marquee } from '@/components/n10k/TextAnimations';
import dynamic from 'next/dynamic';

// Lazy-load Plasma WebGL component — requires client-side only
const Plasma = dynamic(() => import('@/components/n10k/Plasma'), {
  ssr: false,
  loading: () => null,
});
import { useAuthStore } from '@/lib/auth-store';

export default function Home() {
  const checkSession = useAuthStore((state) => state.checkSession);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  return (
    <div className="min-h-screen flex flex-col bg-[#000000] relative">
      {/* Accessibility: Skip Link */}
      <a href="#main-content" className="skip-link">Saltar al contenido principal</a>

      {/* Interactive blur background - behind everything */}
      <InteractiveBackground />

      {/* Content layer - above the background */}
      <div className="relative z-10 flex flex-col min-h-screen pb-20">
        <Header />
        <main id="main-content" className="flex-1">
          <HeroSection />

          {/* Marquee 1: Between Hero and Collection - RED banner */}
          <section className="py-1.5 sm:py-7 bg-[#E30613] relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-[0.04] pointer-events-none"
              style={{
                backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(0,0,0,0.15) 20px, rgba(0,0,0,0.15) 21px)`,
              }}
            />
            <Marquee
              texts={['N10K', 'CABALLERO', 'LIMITLESS']}
              speed={80}
              separator="✦"
            />
          </section>

          <ProductGrid />

          {/* Marquee 2: Between New Arrivals and About - BLACK banner */}
          <section className="py-1.5 sm:py-7 bg-[#000000] border-y border-white/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#E30613]/5 via-transparent to-[#E30613]/5 pointer-events-none" />
            <Marquee
              texts={['N10K', 'ROPA MASCULINA', 'STYLE']}
              speed={70}
              reverse
              separator="◆"
            />
          </section>

          {/* Red glow container — extends Plasma across About + Newsletter */}
          <div className="relative overflow-hidden">
            {/* Shared Plasma background across both sections */}
            <div className="absolute inset-0 z-0">
              <Plasma
                color="#E30613"
                speed={0.5}
                direction="forward"
                scale={1.6}
                opacity={0.55}
                mouseInteractive={true}
              />
            </div>
            {/* Red glow gradient overlay spanning both sections */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#000000]/80 via-[#000000]/30 to-[#000000]/60 pointer-events-none z-[1]" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#E30613]/8 via-transparent to-[#E30613]/8 pointer-events-none z-[1]" />
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-[#E30613]/6 rounded-full blur-[200px] pointer-events-none z-[1]" />

            <div className="relative z-[2]">
              <AboutSection />
              <NewsletterSection />
            </div>
          </div>
        </main>
        <Footer />
      </div>

      {/* Floating bottom navigation bar */}
      <FloatingNavBar />

      {/* Modals */}
      <ProductDetail />
      <CartSidebar />
      <WishlistSidebar />
      <AuthModal />
    </div>
  );
}
