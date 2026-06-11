'use client';

import { useCartStore, Product, selectTotalItems } from '@/lib/store';
import { useAuthStore } from '@/lib/auth-store';
import { ShoppingCart, Menu, X, Search, User, Heart } from 'lucide-react';
import { useState, useEffect, useRef, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

export default function Header() {
  // Zustand selectors — subscribe only to what we need
  const setOpen = useCartStore((state) => state.setOpen);
  const wishlist = useCartStore((state) => state.wishlist);
  const setWishlistOpen = useCartStore((state) => state.setWishlistOpen);
  const products = useCartStore((state) => state.products);
  const setSelectedProduct = useCartStore((state) => state.setSelectedProduct);
  const setDetailOpen = useCartStore((state) => state.setDetailOpen);

  const user = useAuthStore((state) => state.user);
  const setAuthModalOpen = useAuthStore((state) => state.setAuthModalOpen);
  const setAuthMode = useAuthStore((state) => state.setAuthMode);
  const logout = useAuthStore((state) => state.logout);

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const headerRef = useRef<HTMLElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  // Derived: use selector for totalItems (PERF-9)
  const totalItems = useCartStore(selectTotalItems);

  // Filter products based on search query
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return products.filter((p: Product) =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.colors.some((c) => c.name.toLowerCase().includes(q))
    ).slice(0, 6);
  }, [searchQuery, products]);

  const handleCloseSearch = () => {
    setSearchOpen(false);
    setSearchQuery('');
  };

  // Focus input when search opens
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Close search on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        handleCloseSearch();
      }
    };
    if (searchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchOpen]);

  // Close search on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleCloseSearch();
    };
    if (searchOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen]);

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setDetailOpen(true);
    handleCloseSearch();
  };

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Inicio', href: '#hero' },
    { label: 'Colección', href: '#collection' },
    { label: 'Novedades', href: '#new-arrivals' },
    { label: 'Nosotros', href: '#about' },
    { label: 'Contacto', href: '#contact' },
  ];

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleAccountClick = () => {
    setMenuOpen(false);
    if (user) {
      setAuthMode('profile');
    } else {
      setAuthMode('login');
    }
    setAuthModalOpen(true);
  };

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#000000]/95 backdrop-blur-md shadow-lg shadow-[#E30613]/5'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <a
            href="#hero"
            className="flex items-center gap-2 group"
            onClick={(e) => { e.preventDefault(); handleNavClick('#hero'); }}
          >
            <Image
              src="/brand/logo-2-n10kcaballero.webp"
              alt="N10K Caballero"
              width={400}
              height={132}
              className="h-9 sm:h-11 w-auto object-contain group-hover:drop-shadow-[0_0_8px_rgba(227,6,19,0.5)] transition-all duration-300"
              priority
            />
          </a>

          {/* Desktop Nav */}
          <nav aria-label="Menú principal" className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                className="text-sm font-montserrat-bold text-gray-300 hover:text-[#E30613] transition-colors tracking-[0.08em]"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search */}
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-300 hover:text-[#E30613] hover:bg-transparent"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Buscar"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Account */}
            <Button
              variant="ghost"
              size="icon"
              className="relative text-gray-300 hover:text-[#E30613] hover:bg-transparent"
              onClick={handleAccountClick}
              aria-label="Cuenta"
            >
              {user ? (
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#E30613] to-[#ff4d4f] flex items-center justify-center">
                  <span className="text-[10px] font-black text-white">{user.name.charAt(0).toUpperCase()}</span>
                </div>
              ) : (
                <User className="h-5 w-5" />
              )}
            </Button>

            {/* Wishlist */}
            <Button
              variant="ghost"
              size="icon"
              className="relative text-gray-300 hover:text-[#E30613] hover:bg-transparent"
              onClick={() => setWishlistOpen(true)}
              aria-label="Favoritos"
            >
              <Heart className="h-5 w-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#E30613] text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse-red">
                  {wishlist.length}
                </span>
              )}
            </Button>

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="relative text-gray-300 hover:text-[#E30613] hover:bg-transparent"
              onClick={() => setOpen(true)}
              aria-label="Carrito"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#E30613] text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse-red">
                  {totalItems}
                </span>
              )}
            </Button>

            {/* Mobile menu */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-gray-300 hover:text-[#E30613] hover:bg-transparent"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Search bar + Results */}
        {searchOpen && (
          <div ref={searchContainerRef} className="pb-4 animate-slide-up relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                ref={searchInputRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nombre, categoría, color..."
                className="pl-10 pr-10 bg-[#1A1A1A] border-[#E30613]/30 text-white placeholder:text-gray-500 focus:border-[#E30613] rounded-xl"
              />
              <button
                onClick={handleCloseSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors cursor-pointer"
                aria-label="Cerrar búsqueda"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Search Results Dropdown */}
            {searchQuery.trim() && (
              <div className="absolute left-0 right-0 mt-2 bg-[#1A1A1A]/98 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50 max-h-[400px] overflow-y-auto">
                {searchResults.length > 0 ? (
                  <div className="py-2">
                    <p className="px-4 py-2 text-xs font-montserrat-bold tracking-[0.15em] text-gray-500 uppercase">
                      {searchResults.length} resultado{searchResults.length > 1 ? 's' : ''}
                    </p>
                    {searchResults.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleSelectProduct(product)}
                        className="w-full flex items-center gap-4 px-4 py-3 hover:bg-white/5 transition-colors cursor-pointer text-left"
                      >
                        <img
                          src={product.images[0] || product.image}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-montserrat-extrabold truncate">{product.name}</p>
                          <p className="text-gray-500 text-xs font-montserrat-bold tracking-wider uppercase">{product.category}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-[#E30613] text-sm font-montserrat-extrabold">${product.price.toFixed(2)}</p>
                          {product.isNew && (
                            <span className="text-[9px] font-montserrat-bold tracking-wider text-white/50 uppercase">Nuevo</span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-gray-500 text-sm font-montserrat-medium">No encontramos resultados para</p>
                    <p className="text-white text-sm font-montserrat-bold mt-1">"{searchQuery}"</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#000000]/98 backdrop-blur-lg border-t border-white/5 animate-slide-up">
          <nav className="flex flex-col px-6 py-4 gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                className="text-base font-montserrat-bold text-gray-300 hover:text-[#E30613] transition-colors py-3 border-b border-white/5 tracking-[0.08em]"
              >
                {link.label}
              </a>
            ))}
            {/* Account in mobile menu */}
            <button
              onClick={handleAccountClick}
              className="flex items-center gap-3 text-base font-montserrat-bold text-gray-300 hover:text-[#E30613] transition-colors py-3 tracking-[0.08em]"
            >
              <User className="h-5 w-5" />
              {user ? 'Mi Cuenta' : 'Iniciar Sesión'}
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
