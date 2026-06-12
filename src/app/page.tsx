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

          <AboutSection />

          {/* Section Divider */}
          <div className="section-divider max-w-4xl mx-auto my-0" />

          <NewsletterSection />
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
