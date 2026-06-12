'use client';

import { useEffect, useRef } from 'react';

export default function InteractiveBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0.5, y: 0.5 });
  const currentPos = useRef({ x: 0.5, y: 0.5 });
  const rafRef = useRef<number>(0);
  const isVisibleRef = useRef(true);

  // Refs for DOM elements we'll manipulate directly
  const layer1Ref = useRef<HTMLDivElement>(null);
  const layer2Ref = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX / window.innerWidth;
      mousePos.current.y = e.clientY / window.innerHeight;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mousePos.current.x = e.touches[0].clientX / window.innerWidth;
        mousePos.current.y = e.touches[0].clientY / window.innerHeight;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  // Animation loop using refs + direct DOM manipulation (no setState!)
  useEffect(() => {
    const lerp = (start: number, end: number, factor: number) =>
      start + (end - start) * factor;

    const animate = () => {
      // Pause animation when not visible to save CPU/RAM
      if (!isVisibleRef.current) {
        rafRef.current = 0;
        return;
      }

      const prev = currentPos.current;
      const target = mousePos.current;

      const x = lerp(prev.x, target.x, 0.03);
      const y = lerp(prev.y, target.y, 0.03);
      currentPos.current = { x, y };

      // Calculate parallax offsets
      const offsetX = (x - 0.5) * 40;
      const offsetY = (y - 0.5) * 40;
      const scale = 1.15 + (x - 0.5) * 0.05;
      const glowX = x * 100;
      const glowY = y * 100;

      // Direct DOM updates — no React re-render
      if (layer1Ref.current) {
        layer1Ref.current.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
      }
      if (layer2Ref.current) {
        layer2Ref.current.style.transform = `translate(${-offsetX * 0.5}px, ${-offsetY * 0.5}px) scale(1.2)`;
      }
      if (glowRef.current) {
        glowRef.current.style.left = `${glowX}%`;
        glowRef.current.style.top = `${glowY}%`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    // Use IntersectionObserver to pause animation when off-screen
    if (containerRef.current) {
      const io = new IntersectionObserver(
        ([entry]) => {
          isVisibleRef.current = entry.isIntersecting;
          // Resume animation loop when becoming visible again
          if (entry.isIntersecting && !rafRef.current) {
            rafRef.current = requestAnimationFrame(animate);
          }
        },
        { threshold: 0 }
      );
      io.observe(containerRef.current);

      // Start animation
      rafRef.current = requestAnimationFrame(animate);

      return () => {
        io.disconnect();
        cancelAnimationFrame(rafRef.current);
      };
    }

    // Fallback: start animation even without observer
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {/* Main background image with blur + parallax */}
      <div
        ref={layer1Ref}
        className="absolute inset-0"
        style={{
          willChange: 'transform',
        }}
      >
        <img
          src="/brand/bg-n10k.webp"
          alt=""
          className="w-full h-full object-cover"
          loading="eager"
          style={{
            filter: 'blur(3px) brightness(0.3) saturate(1.3)',
          }}
        />
      </div>

      {/* Secondary layer — lightweight CSS gradient parallax (replaces heavy blurred image) */}
      <div
        ref={layer2Ref}
        className="absolute inset-0"
        style={{
          willChange: 'transform',
          background: 'radial-gradient(ellipse at 50% 50%, rgba(227,6,19,0.04) 0%, transparent 60%)',
          mixBlendMode: 'overlay',
        }}
      />

      {/* Mouse-following red glow */}
      <div
        ref={glowRef}
        className="absolute"
        style={{
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(227,30,36,0.12) 0%, rgba(227,30,36,0.04) 40%, transparent 70%)',
          willChange: 'left, top',
        }}
      />

      {/* Dark overlay to ensure content readability */}
      <div className="absolute inset-0 bg-[#000000]/60" />

      {/* Subtle vignette effect */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(10,10,10,0.8) 100%)',
        }}
      />
    </div>
  );
}
