'use client';

import { Instagram, Facebook, Twitter, Mail, MapPin, Phone } from 'lucide-react';
import { useRef, useEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!footerRef.current) return;

    const ctx = gsap.context(() => {
      const cols = footerRef.current!.querySelectorAll('.footer-col');
      gsap.set(cols, { autoAlpha: 0, y: 20 });

      ScrollTrigger.create({
        trigger: footerRef.current,
        start: 'top 90%',
        once: true,
        onEnter: () => {
          gsap.to(cols, {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power3.out',
          });
        },
      });

      const bottomBar = footerRef.current!.querySelector('.footer-bottom');
      if (bottomBar) {
        gsap.set(bottomBar, { autoAlpha: 0 });
        ScrollTrigger.create({
          trigger: bottomBar,
          start: 'top 95%',
          once: true,
          onEnter: () => {
            gsap.to(bottomBar, {
              autoAlpha: 1,
              duration: 0.8,
              ease: 'power2.out',
            });
          },
        });
      }
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} id="contact" className="bg-[#E30613] pt-4 sm:pt-10 pb-2 sm:pb-6 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Mobile: Compact layout */}
        <div className="sm:hidden mb-2">
          {/* Row 1: Logo + Social */}
          <div className="footer-col flex items-center justify-between mb-3">
            <Image
              src="/brand/logo-3-n10kcaballero.webp"
              alt="N10K Caballero"
              width={300}
              height={449}
              className="h-7 w-auto object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.15)]"
            />
            <div className="flex gap-1.5">
              <a
                href="https://www.instagram.com/n10kstore?igsh=MXZmM284YWx1MXBjbA=="
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 bg-black/15 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-white hover:bg-black/30 transition-all duration-300 rounded-lg"
                aria-label="Instagram"
              >
                <Instagram className="h-3 w-3" />
              </a>
              <a
                href="#"
                className="w-7 h-7 bg-black/15 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-white hover:bg-black/30 transition-all duration-300 rounded-lg"
                aria-label="Facebook"
              >
                <Facebook className="h-3 w-3" />
              </a>
              <a
                href="#"
                className="w-7 h-7 bg-black/15 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-white hover:bg-black/30 transition-all duration-300 rounded-lg"
                aria-label="Twitter"
              >
                <Twitter className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* Row 2: Contact info */}
          <div className="footer-col mb-2">
            <h4 className="text-white font-montserrat-extrabold text-[10px] tracking-[0.1em] mb-1.5">Contacto</h4>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-white/60">
              <span className="flex items-center gap-1">
                <Mail className="h-2.5 w-2.5" />
                <a href="mailto:info@nutrition10k.com" className="hover:text-white transition-colors">info@nutrition10k.com</a>
              </span>
              <span className="flex items-center gap-1">
                <Phone className="h-2.5 w-2.5" />
                <a href="https://wa.me/584122880228?text=Hola%20N10K%2C%20quiero%20información" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">+58 412-2880228</a>
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-2.5 w-2.5" />
                Caracas, Venezuela
              </span>
            </div>
          </div>

          {/* Row 3: Payment methods inline */}
          <div className="footer-col">
            <div className="flex items-center gap-2">
              <span className="text-white/40 text-[9px] uppercase tracking-wider">Pago:</span>
              <div className="flex gap-1">
                {['Visa', 'MC', 'PayPal', 'Zelle'].map((method) => (
                  <div
                    key={method}
                    className="bg-black/15 backdrop-blur-sm px-1.5 py-0.5 text-[9px] text-white/70 font-bold rounded"
                  >
                    {method}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Desktop: Compact centered layout */}
        <div className="hidden sm:flex sm:flex-row sm:items-start sm:justify-between sm:gap-10 mb-8">
          {/* Brand + Social */}
          <div className="footer-col">
            <div className="flex items-center gap-3 mb-3">
              <Image
                src="/brand/logo-3-n10kcaballero.webp"
                alt="N10K Caballero"
                width={300}
                height={449}
                className="h-12 w-auto object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.15)]"
              />
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-3">
              Ropa masculina urbana y deportiva. Streetwear con actitud.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/n10kstore?igsh=MXZmM284YWx1MXBjbA=="
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-black/15 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-white hover:bg-black/30 transition-all duration-300 rounded-lg"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-black/15 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-white hover:bg-black/30 transition-all duration-300 rounded-lg"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-black/15 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-white hover:bg-black/30 transition-all duration-300 rounded-lg"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <h4 className="text-white font-montserrat-extrabold text-sm tracking-[0.1em] mb-4">
              Contacto
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-white/60 mt-0.5 flex-shrink-0" />
                <a
                  href="mailto:info@nutrition10k.com"
                  className="text-white/60 text-sm hover:text-white transition-colors duration-300"
                >
                  info@nutrition10k.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-white/60 mt-0.5 flex-shrink-0" />
                <a href="https://wa.me/584122880228?text=Hola%20N10K%2C%20quiero%20información" target="_blank" rel="noopener noreferrer" className="text-white/60 text-sm hover:text-white transition-colors duration-300">+58 412-2880228</a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-white/60 mt-0.5 flex-shrink-0" />
                <span className="text-white/60 text-sm">Caracas, Venezuela</span>
              </li>
            </ul>

            <div className="mt-4">
              <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Métodos de Pago</p>
              <div className="flex gap-2">
                {['Visa', 'MC', 'PayPal', 'Zelle'].map((method) => (
                  <div
                    key={method}
                    className="bg-black/15 backdrop-blur-sm px-2.5 py-1 text-[10px] text-white/70 font-bold rounded"
                  >
                    {method}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="footer-bottom border-t border-white/15 pt-2 sm:pt-4 flex flex-col sm:flex-row items-center justify-between gap-1 sm:gap-4">
          <p className="text-white/40 text-[10px] sm:text-xs">
            &copy; {new Date().getFullYear()} N10K. Todos los derechos reservados.
          </p>
          <p className="text-white/30 text-[10px] sm:text-xs tracking-wider uppercase font-montserrat-bold">
            Caballero
          </p>
        </div>
      </div>
    </footer>
  );
}
