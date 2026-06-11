'use client';

import { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const logoImgRef = useRef<HTMLImageElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set(badgeRef.current, { autoAlpha: 0, y: -20, scale: 0.9 });
      gsap.set(brandRef.current, { autoAlpha: 0, scale: 0.6, y: 60 });
      gsap.set(ctaRef.current, { autoAlpha: 0, y: 30 });

      // Hero entrance timeline
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.to(badgeRef.current, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        delay: 0.3,
      })
        .to(
          brandRef.current,
          {
            autoAlpha: 1,
            scale: 1,
            y: 0,
            duration: 1.4,
            ease: 'power4.out',
          },
          '-=0.4'
        )
        .to(
          ctaRef.current,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
          },
          '-=0.4'
        );

      // Tagline fade in
      if (taglineRef.current) {
        gsap.set(taglineRef.current, { autoAlpha: 0, y: 20 });
        tl.to(taglineRef.current, {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
        }, '-=0.3');
      }

      // Logo subtle floating animation
      gsap.to(brandRef.current, {
        y: -12,
        duration: 3,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: 1.5,
      });

      // Parallax on scroll - logo moves up faster
      gsap.to(brandRef.current, {
        y: -80,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
        },
      });

      // Badge subtle pulse
      gsap.to(badgeRef.current, {
        scale: 1.03,
        duration: 2,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: 2,
      });

      // Logo glow pulse effect
      gsap.to(logoImgRef.current, {
        filter: 'drop-shadow(0 0 30px rgba(227,6,19,0.6))',
        duration: 2,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: 1.8,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[#000000]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E30613]/10 via-transparent to-[#000000]" />
        <div className="n10k-pattern-diagonal absolute inset-0" />
        {/* Dual radial glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#E30613]/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-[#E30613]/3 rounded-full blur-[180px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-5 sm:px-4 max-w-5xl mx-auto pt-20 sm:pt-24">
        {/* Badge */}
        <div ref={badgeRef} className="inline-flex items-center gap-2 glass-card badge-pulse px-3 sm:px-5 py-2 sm:py-2.5 mb-6 sm:mb-8">
          <Zap className="h-3 w-3 sm:h-4 sm:w-4 text-[#E30613]" />
          <span className="text-[#E30613] text-[10px] sm:text-sm font-montserrat-extrabold tracking-[0.1em] sm:tracking-[0.15em] uppercase whitespace-nowrap">
            Nueva Colección 2026
          </span>
        </div>

        {/* Brand Logo Image */}
        <div ref={brandRef} className="mb-10 flex justify-center px-2">
          <Image
            ref={logoImgRef}
            src="/brand/logo-01-n10kcaballero-xl.webp"
            alt="N10K Caballero"
            width={1200}
            height={431}
            priority
            className="w-[200px] sm:w-[350px] md:w-[420px] lg:w-[500px] h-auto max-w-full"
            style={{
              filter: 'drop-shadow(0 0 20px rgba(227,6,19,0.4)) drop-shadow(0 4px 30px rgba(227,6,19,0.2))',
            }}
          />
        </div>

        {/* Tagline - LIVE LIMITLESS */}
        <div ref={taglineRef} className="mt-4 sm:mt-6 mb-6 sm:mb-10">
          <p className="text-gradient-red font-montserrat-black text-sm sm:text-xl md:text-2xl tracking-[0.3em] sm:tracking-[0.4em] uppercase">
            LIVE LIMITLESS
          </p>
        </div>

        {/* CTAs */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <Button
            size="lg"
            className="bg-[#E30613] hover:bg-[#ff1a22] text-white font-montserrat-black text-sm sm:text-base px-6 sm:px-8 py-5 sm:py-6 rounded-2xl tracking-[0.1em] uppercase shadow-lg shadow-[#E30613]/25 hover:shadow-[#E30613]/40 hover:scale-105 transition-all duration-300 cta-shimmer glow-ring"
            asChild
          >
            <a href="#collection">Comprar Ahora</a>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-white/20 text-white hover:bg-white/5 hover:border-[#E30613] font-montserrat-bold text-sm sm:text-base px-6 sm:px-8 py-5 sm:py-6 rounded-2xl tracking-[0.1em] uppercase hover:scale-105 transition-all duration-300"
            asChild
          >
            <a href="#new-arrivals">Ver Novedades</a>
          </Button>
        </div>
      </div>

      {/* Floating brand accent circles */}
      <div className="absolute top-[15%] right-[10%] w-2 h-2 bg-[#E30613]/30 rounded-full animate-float" style={{ animationDelay: '0.5s' }} />
      <div className="absolute top-[60%] left-[5%] w-1.5 h-1.5 bg-[#E30613]/20 rounded-full animate-float" style={{ animationDelay: '1.5s' }} />
      <div className="absolute bottom-[20%] right-[15%] w-1 h-1 bg-white/15 rounded-full animate-float" style={{ animationDelay: '2s' }} />
    </section>
  );
}
