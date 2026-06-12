'use client';

import React from 'react';
import { Product, useCartStore, categories, FetchStatus, fetchGuard } from '@/lib/store';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingBag, ArrowRight, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useMouseGlow } from '@/hooks/use-scroll-animation';
import { SplitWords, BlurIn } from '@/components/n10k/TextAnimations';
import { gsap, ScrollTrigger } from '@/lib/gsap-init';

export default function ProductGrid() {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const products = useCartStore((state) => state.products);
  const productsStatus = useCartStore((state) => state.productsStatus);
  const productsError = useCartStore((state) => state.productsError);
  const fetchProducts = useCartStore((state) => state.fetchProducts);
  const setSelectedProduct = useCartStore((state) => state.setSelectedProduct);
  const setPreselectedColor = useCartStore((state) => state.setPreselectedColor);
  const setDetailOpen = useCartStore((state) => state.setDetailOpen);
  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlistItem = useCartStore((state) => state.toggleWishlistItem);
  const wishlist = useCartStore((state) => state.wishlist);
  const setWishlistOpen = useCartStore((state) => state.setWishlistOpen);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Retry handler — resets status and refetches
  const handleRetry = useCallback(() => {
    useCartStore.setState({ productsStatus: 'idle' as FetchStatus, productsError: null });
    fetchGuard.inProgress = false; // Reset guard so fetch can run again
    fetchProducts();
  }, [fetchProducts]);

  // PERF-5: Memoize filtered products
  const filteredProducts = useMemo(
    () => activeCategory === 'Todos'
      ? products
      : products.filter((p) => p.category === activeCategory),
    [products, activeCategory]
  );

  // When a specific category is selected, expand products by color
  // Each color variant becomes its own card
  const colorExpandedProducts = useMemo(() => {
    if (activeCategory === 'Todos') return [];
    return filteredProducts.flatMap((product) =>
      product.colors.map((color) => ({
        product,
        color,
        images: getImagesForColor(product, color.name),
        key: `${product.id}-${color.name}`,
      }))
    );
  }, [filteredProducts, activeCategory]);

  // PERF-5: Memoize new products
  const newProducts = useMemo(
    () => products.filter((p) => p.isNew),
    [products]
  );

  // PERF-6: Use Set for O(1) wishlist lookup — composite keys for color-specific wishlists
  const wishlistSet = useMemo(() => new Set(wishlist.map((w) => `${w.productId}|${w.colorName}`)), [wishlist]);

  const handleQuickAdd = useCallback((product: Product, colorName?: string) => {
    addItem({
      product,
      quantity: 1,
      selectedSize: product.sizes[0],
      selectedColor: colorName || product.colors[0].name,
    });
  }, [addItem]);

  const handleViewDetail = useCallback((product: Product, colorName?: string) => {
    setSelectedProduct(product);
    setPreselectedColor(colorName || null);
    setDetailOpen(true);
  }, [setSelectedProduct, setPreselectedColor, setDetailOpen]);

  const handleToggleWishlist = useCallback((productId: string, colorName: string) => {
    toggleWishlistItem(productId, colorName);
  }, [toggleWishlistItem]);

  return (
    <>
      {/* Full Collection - DARK BACKGROUND */}
      <section id="collection" className="relative py-16 sm:py-24 px-4 collection-pattern-bg overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Collection Header — Desine-style: kicker + title + description */}
          <div className="mb-12 sm:mb-16">
            {/* Kicker: small red label with line before text */}
            <BlurIn delay={0.1} duration={0.8}>
              <p className="text-[.65rem] font-montserrat-bold tracking-[.2em] uppercase text-[#E30613] mb-2 flex items-center gap-2.5">
                <span className="inline-block w-5 h-[1.5px] bg-[#E30613]" />
                Ropa de Caballero
              </p>
            </BlurIn>

            {/* Large Montserrat Black title */}
            <SplitWords
              text="Colecciones"
              tag="h2"
              className="font-montserrat-black text-white leading-[.95] mb-3 break-words"
              style={{ fontSize: 'clamp(2rem, 10vw, 5.5rem)', letterSpacing: 'clamp(0.01em, 0.04em, 0.04em)' }}
              staggerDelay={0.08}
              threshold={0.2}
            />

            {/* Description — muted, left-aligned, max-width */}
            <BlurIn delay={0.4} duration={0.8}>
              <p className="text-sm sm:text-[.88rem] text-gray-500 leading-[1.7] max-w-[380px] mb-8 font-montserrat-medium break-words hyphens-auto">
                Una selección de prendas masculinas que reflejan nuestra esencia — audaz, auténtica y hecha para el hombre que marca su propio estilo urbano.
              </p>
            </BlurIn>

            {/* Category Filters — Desine-style minimal buttons */}
            <BlurIn delay={0.5} duration={0.8}>
              <div className="flex flex-wrap gap-2.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={`px-3 sm:px-4 py-1.5 text-[.65rem] sm:text-[.7rem] font-montserrat-semibold tracking-[.08em] uppercase transition-all duration-200 cursor-pointer border ${
                      activeCategory === cat
                        ? 'bg-[#E30613] border-[#E30613] text-white'
                        : 'bg-transparent border-white/10 text-gray-500 hover:text-white hover:border-white/25'
                    }`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </BlurIn>
          </div>

          {/* Product Grid - 2 Column Orvian Cascade */}
          {productsStatus === 'loading' && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="h-8 w-8 text-[#E30613] animate-spin" />
              <p className="text-white/50 text-sm font-montserrat-medium tracking-wider">Cargando productos...</p>
            </div>
          )}

          {productsStatus === 'error' && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <AlertCircle className="h-10 w-10 text-[#E30613]" />
              <p className="text-white/70 text-sm font-montserrat-medium text-center max-w-xs">{productsError || 'Error al cargar productos'}</p>
              <button
                onClick={handleRetry}
                className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#E30613] text-white text-xs font-montserrat-bold tracking-wider uppercase hover:bg-[#c20510] transition-colors cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Reintentar
              </button>
            </div>
          )}

          {productsStatus === 'success' && filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <p className="text-white/50 text-sm font-montserrat-medium">No hay productos en esta categoría</p>
            </div>
          )}

          {productsStatus === 'success' && activeCategory === 'Todos' && filteredProducts.length > 0 && (
            <div className="grid grid-cols-2 gap-2 sm:gap-3 items-start">
              {filteredProducts.map((product, index) => {
                const colIndex = index % 2;
                const staggerOffset = colIndex * 80;

                return (
                  <MemoizedProductCard
                    key={product.id}
                    product={product}
                    index={index}
                    staggerOffset={staggerOffset}
                    colIndex={colIndex}
                    wishlistSet={wishlistSet}
                    onToggleWishlist={handleToggleWishlist}
                    onQuickAdd={handleQuickAdd}
                    onViewDetail={handleViewDetail}
                  />
                );
              })}
            </div>
          )}

          {productsStatus === 'success' && activeCategory !== 'Todos' && colorExpandedProducts.length > 0 && (
            <div className="grid grid-cols-2 gap-2 sm:gap-3 items-start">
              {colorExpandedProducts.map((item, index) => {
                const colIndex = index % 2;
                const staggerOffset = colIndex * 80;

                return (
                  <MemoizedColorProductCard
                    key={item.key}
                    product={item.product}
                    color={item.color}
                    images={item.images}
                    index={index}
                    staggerOffset={staggerOffset}
                    colIndex={colIndex}
                    isWished={wishlistSet.has(`${item.product.id}|${item.color.name}`)}
                    onToggleWishlist={handleToggleWishlist}
                    onQuickAdd={handleQuickAdd}
                    onViewDetail={handleViewDetail}
                  />
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* New Arrivals Highlight - RED BACKGROUND */}
      <MemoizedNewArrivalsSection
        newProducts={newProducts}
        onQuickAdd={handleQuickAdd}
        onViewDetail={handleViewDetail}
      />
    </>
  );
}

/** Get images for a given product and color name */
function getImagesForColor(product: Product, colorName: string): string[] {
  if (product.colorImages && product.colorImages[colorName]) {
    return product.colorImages[colorName];
  }
  return product.images.length > 0 ? product.images : [product.image];
}

function ProductCard({
  product,
  index,
  wishlistSet,
  onToggleWishlist,
  onQuickAdd,
  onViewDetail,
  staggerOffset = 0,
  colIndex = 0,
}: {
  product: Product;
  index: number;
  wishlistSet: Set<string>;
  onToggleWishlist: (productId: string, colorName: string) => void;
  onQuickAdd: (product: Product, colorName?: string) => void;
  onViewDetail: (product: Product, colorName?: string) => void;
  staggerOffset?: number;
  colIndex?: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [heartAnimating, setHeartAnimating] = useState(false);

  // GSAP entrance animation with stagger cascade offset
  useEffect(() => {
    if (!cardRef.current) return;
    gsap.set(cardRef.current, { autoAlpha: 0, y: 60 + staggerOffset });
    ScrollTrigger.create({
      trigger: cardRef.current,
      start: 'top 108%',
      once: true,
      onEnter: () => {
        gsap.to(cardRef.current, {
          autoAlpha: 1,
          y: staggerOffset,
          duration: 0.8,
          delay: colIndex * 0.1,
          ease: 'power3.out',
        });
      },
    });
  }, [index, staggerOffset, colIndex]);

  // Track selected color for image switching
  const [activeColor, setActiveColor] = useState(product.colors[0]?.name || '');

  // Derived: is the active color wished?
  const isWished = wishlistSet.has(`${product.id}|${activeColor}`);

  // Get current images based on selected color
  const currentImages = useMemo(() => getImagesForColor(product, activeColor), [product, activeColor]);

  return (
    <div
      ref={cardRef}
      className="stagger-card"
      style={{ '--stagger-offset': `${staggerOffset}px` } as React.CSSProperties}
    >
      <div
        className="group relative glass-card-strong-red gradient-border-red glass-glow overflow-hidden cursor-pointer"
        style={{ '--glow-x': '50%', '--glow-y': '50%' } as React.CSSProperties}
        onClick={() => onViewDetail(product, activeColor)}
      >
        {/* Image Area with Frosted Blur Effect */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-t-[12px] sm:rounded-t-[24px]">
          {/* Primary image - gets blurred on hover */}
          <img
            key={`primary-${activeColor}`}
            src={currentImages[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-all duration-700 ease-out sm:group-hover:brightness-50 sm:group-hover:blur-[5px]"
          />

          {/* Badges - always visible at top-left */}
          <div className="absolute top-2.5 left-2.5 sm:top-3.5 sm:left-3.5 flex flex-col gap-1.5 z-10">
            {product.isNew && (
              <Badge className="bg-[#E30613] text-white font-bold rounded-md text-[9px] sm:text-[10px] px-2 py-0.5 shadow-lg shadow-black/30">
                NUEVO
              </Badge>
            )}
            {product.isBestSeller && (
              <Badge className="bg-white/90 backdrop-blur-sm text-black font-bold rounded-md text-[9px] sm:text-[10px] px-2 py-0.5">
                TOP
              </Badge>
            )}
            {product.originalPrice && (
              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-md text-[9px] sm:text-[10px] px-2 py-0.5">
                -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
              </Badge>
            )}
          </div>

          {/* Wishlist button - top right, always visible */}
          <button
            className={`absolute top-2 right-2 sm:top-3 sm:right-3 z-10 w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${
              isWished
                ? 'bg-black/50 backdrop-blur-sm text-[#E30613] shadow-lg shadow-[#E30613]/30'
                : 'bg-black/40 backdrop-blur-sm text-white/60 hover:bg-black/60 hover:text-white'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product.id, activeColor);
              setHeartAnimating(true);
              setTimeout(() => setHeartAnimating(false), 700);
            }}
            aria-label={isWished ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          >
            {/* Burst ring animation on like */}
            {heartAnimating && isWished && (
              <span className="absolute inset-0 rounded-full border-2 border-[#E30613] heart-burst-ring" />
            )}
            <Heart
              className={`h-5 w-5 sm:h-5.5 sm:w-5.5 transition-all duration-300 ${isWished ? 'fill-[#E30613] text-[#E30613]' : ''} ${heartAnimating ? 'heart-animate' : ''}`}
            />
          </button>

          {/* ===== FROSTED GLASS OVERLAY - appears on hover ===== */}
          <div className="frost-overlay" />

          {/* Frosted content that slides in on hover */}
          <div className="frost-content">
            {/* Category */}
            <div className="frost-content-item">
              <p className="text-white/60 text-xs font-montserrat-semibold tracking-[0.25em] uppercase mb-2">
                {product.category}
              </p>
            </div>

            {/* Product name */}
            <div className="frost-content-item">
              <h3 className="text-white text-xl sm:text-2xl font-montserrat-extrabold tracking-[0.06em] text-center leading-tight mb-2">
                {product.name}
              </h3>
            </div>

            {/* Divider */}
            <div className="frost-content-item">
              <div className="frost-divider mx-auto mb-3" />
            </div>

            {/* Price */}
            <div className="frost-content-item">
              <div className="flex items-center gap-2 justify-center mb-4">
                <span className="text-2xl font-montserrat-black text-white">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-white/50 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {/* Color dots */}
            {product.colors.length > 1 && (
              <div className="frost-content-item">
                <div className="flex gap-2.5 justify-center mb-5">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      className={`w-5 h-5 rounded-full border-2 transition-all duration-200 hover:scale-125 cursor-pointer ${
                        activeColor === color.name
                          ? 'border-white scale-110 shadow-sm shadow-white/40'
                          : 'border-white/20 hover:border-white/50'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                      aria-label={`Color ${color.name}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveColor(color.name);
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="frost-content-item flex items-center gap-3">
              <button
                className="frost-pill-red flex items-center gap-2"
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickAdd(product, activeColor);
                }}
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                Ver
              </button>

              <button
                className="frost-icon-btn-red"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetail(product, activeColor);
                }}
                aria-label="Ver detalle del producto"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// PERF-8: React.memo on ProductCard
const MemoizedProductCard = React.memo(ProductCard);

/** Color-specific product card — shown when a category filter is active.
 *  Each card represents one product in one specific color. */
function ColorProductCard({
  product,
  color,
  images,
  index,
  isWished,
  onToggleWishlist,
  onQuickAdd,
  onViewDetail,
  staggerOffset = 0,
  colIndex = 0,
}: {
  product: Product;
  color: { name: string; hex: string };
  images: string[];
  index: number;
  isWished: boolean;
  onToggleWishlist: (productId: string, colorName: string) => void;
  onQuickAdd: (product: Product, colorName?: string) => void;
  onViewDetail: (product: Product, colorName?: string) => void;
  staggerOffset?: number;
  colIndex?: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [heartAnimating, setHeartAnimating] = useState(false);

  useEffect(() => {
    if (!cardRef.current) return;
    gsap.set(cardRef.current, { autoAlpha: 0, y: 60 + staggerOffset });
    ScrollTrigger.create({
      trigger: cardRef.current,
      start: 'top 108%',
      once: true,
      onEnter: () => {
        gsap.to(cardRef.current, {
          autoAlpha: 1,
          y: staggerOffset,
          duration: 0.8,
          delay: colIndex * 0.1,
          ease: 'power3.out',
        });
      },
    });
  }, [index, staggerOffset, colIndex]);

  return (
    <div
      ref={cardRef}
      className="stagger-card"
      style={{ '--stagger-offset': `${staggerOffset}px` } as React.CSSProperties}
    >
      <div
        className="group relative glass-card-strong-red gradient-border-red glass-glow overflow-hidden cursor-pointer"
        style={{ '--glow-x': '50%', '--glow-y': '50%' } as React.CSSProperties}
        onClick={() => onViewDetail(product, color.name)}
      >
        <div className="relative aspect-[4/5] overflow-hidden rounded-t-[12px] sm:rounded-t-[24px]">
          <img
            key={`primary-${color.name}`}
            src={images[0]}
            alt={`${product.name} — ${color.name}`}
            className="w-full h-full object-cover transition-all duration-700 ease-out sm:group-hover:brightness-50 sm:group-hover:blur-[5px]"
          />

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 sm:top-3.5 sm:left-3.5 flex flex-col gap-1.5 z-10">
            {product.isNew && (
              <Badge className="bg-[#E30613] text-white font-bold rounded-md text-[9px] sm:text-[10px] px-2 py-0.5 shadow-lg shadow-black/30">
                NUEVO
              </Badge>
            )}
            {product.isBestSeller && (
              <Badge className="bg-white/90 backdrop-blur-sm text-black font-bold rounded-md text-[9px] sm:text-[10px] px-2 py-0.5">
                TOP
              </Badge>
            )}
            {product.originalPrice && (
              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-md text-[9px] sm:text-[10px] px-2 py-0.5">
                -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
              </Badge>
            )}
          </div>

          {/* Wishlist button */}
          <button
            className={`absolute top-2 right-2 sm:top-3 sm:right-3 z-10 w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${
              isWished
                ? 'bg-black/50 backdrop-blur-sm text-[#E30613] shadow-lg shadow-[#E30613]/30'
                : 'bg-black/40 backdrop-blur-sm text-white/60 hover:bg-black/60 hover:text-white'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product.id, color.name);
              setHeartAnimating(true);
              setTimeout(() => setHeartAnimating(false), 700);
            }}
            aria-label={isWished ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          >
            {heartAnimating && isWished && (
              <span className="absolute inset-0 rounded-full border-2 border-[#E30613] heart-burst-ring" />
            )}
            <Heart
              className={`h-5 w-5 sm:h-5.5 sm:w-5.5 transition-all duration-300 ${isWished ? 'fill-[#E30613] text-[#E30613]' : ''} ${heartAnimating ? 'heart-animate' : ''}`}
            />
          </button>

          {/* Frosted overlay */}
          <div className="frost-overlay" />

          {/* Frosted content */}
          <div className="frost-content">
            {/* Category */}
            <div className="frost-content-item">
              <p className="text-white/60 text-xs font-montserrat-semibold tracking-[0.25em] uppercase mb-2">
                {product.category}
              </p>
            </div>

            {/* Product name + color */}
            <div className="frost-content-item">
              <h3 className="text-white text-xl sm:text-2xl font-montserrat-extrabold tracking-[0.06em] text-center leading-tight mb-1">
                {product.name}
              </h3>
              <span className="text-white/60 text-sm font-montserrat-medium capitalize">{color.name}</span>
            </div>

            {/* Divider */}
            <div className="frost-content-item">
              <div className="frost-divider mx-auto mb-3" />
            </div>

            {/* Price */}
            <div className="frost-content-item">
              <div className="flex items-center gap-2 justify-center mb-4">
                <span className="text-2xl font-montserrat-black text-white">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-white/50 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {/* Color swatch */}
            <div className="frost-content-item">
              <div className="flex items-center gap-1.5 justify-center mb-4">
                <span
                  className="w-4 h-4 rounded-full border border-white/30"
                  style={{ backgroundColor: color.hex }}
                />
                <span className="text-white/50 text-xs font-montserrat-medium capitalize">{color.name}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="frost-content-item flex items-center gap-3">
              <button
                className="frost-pill-red flex items-center gap-2"
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickAdd(product, color.name);
                }}
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                Ver
              </button>

              <button
                className="frost-icon-btn-red"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetail(product, color.name);
                }}
                aria-label="Ver detalle del producto"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const MemoizedColorProductCard = React.memo(ColorProductCard);

function NewArrivalsSection({
  newProducts,
  onQuickAdd,
  onViewDetail,
}: {
  newProducts: Product[];
  onQuickAdd: (product: Product, colorName?: string) => void;
  onViewDetail: (product: Product, colorName?: string) => void;
}) {
  return (
    <section id="new-arrivals" className="py-10 sm:py-20 px-4 novedades-bg overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6 sm:mb-12">
          <BlurIn delay={0.1} duration={0.8}>
            <p className="text-white/70 text-sm font-montserrat-bold tracking-[0.15em] mb-2">
              Lo Nuevo
            </p>
          </BlurIn>
          <SplitWords
            text="NOVEDADES"
            tag="h2"
            className="text-3xl sm:text-5xl md:text-6xl font-montserrat-black text-white tracking-[-0.02em] break-words"
            staggerDelay={0.06}
            threshold={0.2}
          />
          <BlurIn delay={0.3} duration={0.8}>
            <div className="w-20 h-1 bg-gradient-to-r from-transparent via-white/60 to-transparent mx-auto mt-4" />
          </BlurIn>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {newProducts.map((product, index) => {
            return (
              <MemoizedNewArrivalCard
                key={product.id}
                product={product}
                index={index}
                onQuickAdd={onQuickAdd}
                onViewDetail={onViewDetail}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

function NewArrivalCard({
  product,
  index,
  onQuickAdd,
  onViewDetail,
}: {
  product: Product;
  index: number;
  onQuickAdd: (product: Product, colorName?: string) => void;
  onViewDetail: (product: Product, colorName?: string) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  // GSAP entrance animation
  useEffect(() => {
    if (!cardRef.current) return;
    gsap.set(cardRef.current, { autoAlpha: 0, x: -50 });
    ScrollTrigger.create({
      trigger: cardRef.current,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        gsap.to(cardRef.current, {
          autoAlpha: 1,
          x: 0,
          duration: 0.8,
          delay: index * 0.12,
          ease: 'power3.out',
        });
      },
    });
  }, [index]);

  // Play/pause video on hover
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isHovering) {
      video.play().catch(() => {});
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [isHovering]);

  // Track selected color for image switching
  const [activeColor, setActiveColor] = useState(product.colors[0]?.name || '');
  const currentImages = useMemo(() => getImagesForColor(product, activeColor), [product, activeColor]);

  const hasVideo = !!product.video;

  return (
    <div
      ref={cardRef}
    >
      <div
        className="orvian-card group relative overflow-hidden cursor-pointer rounded-md sm:rounded-xl"
        onClick={() => onViewDetail(product, activeColor)}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Image fills the ENTIRE card - 4:5 aspect ratio */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-md sm:rounded-xl">
          {/* Static image - fades out when video plays on hover */}
          <img
            key={`primary-${activeColor}`}
            src={currentImages[0]}
            alt={product.name}
            className={`w-full h-full object-cover transition-all duration-700 ease-out ${
              hasVideo ? 'sm:group-hover:opacity-0 sm:group-hover:scale-105' : 'sm:group-hover:scale-105'
            }`}
          />

          {/* Video layer - plays on hover (desktop only) */}
          {hasVideo && (
            <video
              ref={videoRef}
              src={product.video}
              muted
              loop
              playsInline
              preload="metadata"
              className="absolute inset-0 w-full h-full object-cover opacity-0 sm:group-hover:opacity-100 transition-opacity duration-700 ease-out"
            />
          )}

          {/* NEW Badge - always visible */}
          <div className="absolute top-2.5 left-2.5 sm:top-3.5 sm:left-3.5 flex flex-col gap-1.5 z-10">
            {product.isNew && (
              <Badge className="bg-[#E30613] text-white font-bold rounded-md text-[9px] sm:text-[10px] px-2 py-0.5 shadow-lg shadow-black/30">
                NUEVO
              </Badge>
            )}
            {product.isBestSeller && (
              <Badge className="bg-white/90 backdrop-blur-sm text-black font-bold rounded-md text-[9px] sm:text-[10px] px-2 py-0.5">
                TOP
              </Badge>
            )}
            {product.originalPrice && (
              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-md text-[9px] sm:text-[10px] px-2 py-0.5">
                -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
              </Badge>
            )}
          </div>

          {/* Image count */}
          {currentImages.length > 1 && (
            <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10">
              <Badge className="bg-black/50 backdrop-blur-sm text-white font-bold rounded-lg sm:rounded-xl text-[9px] sm:text-xs px-1.5 sm:px-3 py-0.5 sm:py-1">
                {currentImages.length} fotos
              </Badge>
            </div>
          )}

          {/* ===== BOTTOM OVERLAY - hover (desktop) / always visible (mobile) ===== */}
          <div className="orvian-card-overlay" />

          {/* Info content at bottom of card */}
          <div className="orvian-card-info">
            {/* Row 1: Product name */}
            <div className="orvian-info-item">
              <h3 className="text-white text-xs sm:text-sm md:text-base font-montserrat-extrabold tracking-[0.04em] leading-tight line-clamp-1 mb-1">
                {product.name}
              </h3>
            </div>

            {/* Row 2: Price + Ver button */}
            <div className="orvian-info-item">
              <div className="flex items-center justify-between gap-1.5">
                <div className="flex flex-col min-w-0">
                  <span className="text-white text-xs sm:text-sm font-montserrat-bold leading-tight">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-white/40 text-[8px] sm:text-[10px] line-through leading-tight">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>

                <button
                  className="shrink-0 flex items-center gap-1.5 px-3 py-2 sm:px-3 sm:py-1.5 rounded-full bg-[#E30613] text-white text-[11px] sm:text-[10px] font-montserrat-bold tracking-[0.06em] uppercase transition-colors duration-200 active:bg-[#c20510] sm:hover:bg-[#c20510] cursor-pointer border-none shadow-sm shadow-[#E30613]/30"
                  onClick={(e) => {
                    e.stopPropagation();
                    onQuickAdd(product, activeColor);
                  }}
                >
                  <ShoppingBag className="h-3 w-3 sm:h-3 sm:w-3" />
                  <span>Ver</span>
                </button>
              </div>
            </div>

            {/* Row 3: Color dots + Category tag (hidden on mobile to save space) */}
            <div className="orvian-info-item hidden sm:block">
              <div className="flex items-center justify-between gap-2 mt-1.5">
                {product.colors.length > 1 && (
                  <div className="flex gap-1">
                    {product.colors.map((color) => (
                      <button
                        key={color.name}
                        className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border transition-all duration-200 hover:scale-125 cursor-pointer ${
                          activeColor === color.name
                            ? 'border-white scale-110'
                            : 'border-white/20 hover:border-white/50'
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                        aria-label={`Color ${color.name}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveColor(color.name);
                        }}
                      />
                    ))}
                  </div>
                )}

                <span className="shrink-0 px-2 py-0.5 rounded-full bg-white/15 backdrop-blur-sm text-white/80 text-[9px] sm:text-[10px] font-montserrat-bold tracking-[0.1em] uppercase">
                  {product.category}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// PERF-8: React.memo on NewArrivalCard
const MemoizedNewArrivalCard = React.memo(NewArrivalCard);

// PERF-8: React.memo on NewArrivalsSection
const MemoizedNewArrivalsSection = React.memo(NewArrivalsSection);
