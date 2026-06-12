'use client';

import { useCartStore, Product } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { X, ShoppingBag, Heart, Minus, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';

export default function ProductDetail() {
  const isDetailOpen = useCartStore((state) => state.isDetailOpen);
  const setDetailOpen = useCartStore((state) => state.setDetailOpen);
  const selectedProduct = useCartStore((state) => state.selectedProduct);
  const preselectedColor = useCartStore((state) => state.preselectedColor);
  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlistItem = useCartStore((state) => state.toggleWishlistItem);
  const wishlist = useCartStore((state) => state.wishlist);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [heartAnimating, setHeartAnimating] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showDescription, setShowDescription] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  const handleOpen = useCallback((open: boolean) => {
    setDetailOpen(open);
    if (open && selectedProduct) {
      setSelectedSize(selectedProduct.sizes[0]);
      setQuantity(1);
      setHeartAnimating(false);
      setActiveImageIndex(0);
      setShowDescription(false);
    }
  }, [setDetailOpen, selectedProduct]);

  // When the detail opens or preselectedColor changes, set the active color
  useEffect(() => {
    if (isDetailOpen && selectedProduct) {
      setSelectedColor(preselectedColor || selectedProduct.colors[0].name); // eslint-disable-line react-hooks/set-state-in-effect -- sync local state with store-driven dialog open
    }
  }, [isDetailOpen, selectedProduct, preselectedColor]);

  const handleAddToCart = useCallback(() => {
    if (!selectedProduct || !selectedSize || !selectedColor) return;
    addItem({
      product: selectedProduct,
      quantity,
      selectedSize,
      selectedColor,
    });
    setDetailOpen(false);
  }, [selectedProduct, selectedSize, selectedColor, quantity, addItem, setDetailOpen]);

  // Long press handlers for description overlay
  const handleTouchStart = useCallback(() => {
    longPressTimer.current = setTimeout(() => {
      setShowDescription(true);
    }, 400);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    setShowDescription(false);
  }, []);

  const handleMouseDown = useCallback(() => {
    longPressTimer.current = setTimeout(() => {
      setShowDescription(true);
    }, 400);
  }, []);

  const handleMouseUp = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    setShowDescription(false);
  }, []);

  // Get images for the currently selected color
  const currentImages = useMemo(() => {
    if (!selectedProduct) return [];
    if (selectedProduct.colorImages && selectedColor && selectedProduct.colorImages[selectedColor]) {
      return selectedProduct.colorImages[selectedColor];
    }
    return selectedProduct.images.length > 0 ? selectedProduct.images : [selectedProduct.image];
  }, [selectedProduct, selectedColor]);

  // Reset image index when color changes
  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    setActiveImageIndex(0);
  };

  // Keyboard navigation for gallery
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!selectedProduct || !isDetailOpen) return;
    if (e.key === 'ArrowLeft') {
      setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : currentImages.length - 1));
    } else if (e.key === 'ArrowRight') {
      setActiveImageIndex((prev) => (prev < currentImages.length - 1 ? prev + 1 : 0));
    }
  }, [selectedProduct, isDetailOpen, currentImages.length]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!selectedProduct) return null;

  const isWished = selectedProduct ? wishlist.some((w) => w.productId === selectedProduct.id && w.colorName === selectedColor) : false;

  return (
    <Dialog open={isDetailOpen} onOpenChange={handleOpen}>
      <DialogContent className="!max-w-6xl !w-[98vw] !h-[95vh] !flex !flex-col bg-[#000000]/98 backdrop-blur-xl border-white/10 !p-0 !gap-0 overflow-hidden rounded-3xl">
        <DialogTitle className="sr-only">{selectedProduct.name}</DialogTitle>
        <DialogDescription className="sr-only">{selectedProduct.description}</DialogDescription>

        {/* ===== MOBILE LAYOUT (vertical stack) ===== */}
        <div className="flex flex-col h-full overflow-y-auto md:hidden [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
          {/* Title + Close + Heart */}
          <div className="flex items-center justify-between gap-3 px-5 pt-5 pb-2">
            <div className="flex-1 min-w-0">
              <p className="text-[#E30613] text-[10px] font-montserrat-bold tracking-[0.15em] uppercase mb-0.5">
                {selectedProduct.category}
              </p>
              <h2 className="text-xl font-montserrat-extrabold text-white tracking-[-0.01em] leading-tight truncate">
                {selectedProduct.name}
              </h2>
            </div>
            <button
              className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${
                isWished
                  ? 'bg-white/5 border border-[#E30613]/40 text-[#E30613] shadow-lg shadow-[#E30613]/30'
                  : 'bg-white/5 border border-white/10 text-white/40 hover:text-[#E30613] hover:border-[#E30613]/30'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                toggleWishlistItem(selectedProduct.id, selectedColor);
                setHeartAnimating(true);
                setTimeout(() => setHeartAnimating(false), 700);
              }}
              aria-label={isWished ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            >
              {heartAnimating && isWished && (
                <span className="absolute inset-0 rounded-full border-2 border-[#E30613] heart-burst-ring" />
              )}
              <Heart className={`h-4 w-4 transition-all duration-300 ${isWished ? 'fill-[#E30613] text-[#E30613]' : ''} ${heartAnimating ? 'heart-animate' : ''}`} />
            </button>
            <button
              onClick={() => setDetailOpen(false)}
              className="flex-shrink-0 w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-all duration-300 cursor-pointer"
              aria-label="Cerrar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3 px-5 pb-3">
            <span className="text-2xl font-montserrat-extrabold text-white">
              ${selectedProduct.price.toFixed(2)}
            </span>
            {selectedProduct.originalPrice && (
              <>
                <span className="text-sm text-gray-500 line-through">
                  ${selectedProduct.originalPrice.toFixed(2)}
                </span>
                <Badge className="bg-[#E30613] text-white rounded-lg font-bold text-[10px]">
                  -{Math.round(((selectedProduct.originalPrice - selectedProduct.price) / selectedProduct.originalPrice) * 100)}% OFF
                </Badge>
              </>
            )}
            {selectedProduct.isNew && (
              <Badge className="bg-[#E30613] text-white font-bold rounded-lg text-[9px] px-2 py-0.5">NUEVO</Badge>
            )}
          </div>

          {/* Color Selection */}
          <div className="px-5 pb-3">
            <p className="text-xs font-montserrat-bold text-white tracking-[0.06em] mb-1.5">
              Color: <span className="text-[#E30613]">{selectedColor}</span>
            </p>
            <div className="flex gap-2.5">
              {selectedProduct.colors.map((color) => (
                <button
                  key={color.name}
                  className={`relative w-8 h-8 rounded-full border-2 transition-all duration-300 cursor-pointer ${
                    selectedColor === color.name
                      ? 'border-[#E30613] scale-110 shadow-lg shadow-[#E30613]/25'
                      : 'border-white/20 hover:border-white/50 hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.hex }}
                  onClick={() => handleColorChange(color.name)}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div className="px-5 pb-3">
            <p className="text-xs font-montserrat-bold text-white tracking-[0.06em] mb-1.5">
              Talla: <span className="text-[#E30613]">{selectedSize}</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedProduct.sizes.map((size) => (
                <button
                  key={size}
                  className={`min-w-[36px] h-9 px-2.5 text-xs font-bold uppercase rounded-lg transition-all duration-300 cursor-pointer ${
                    selectedSize === size
                      ? 'bg-[#E30613] text-white border-[#E30613] shadow-lg shadow-[#E30613]/20'
                      : 'bg-transparent text-gray-400 border border-white/20 hover:border-[#E30613] hover:text-white'
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity + Subtotal */}
          <div className="px-5 pb-4">
            <p className="text-xs font-montserrat-bold text-white tracking-[0.06em] mb-1.5">
              Cantidad
            </p>
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-white/20 rounded-lg overflow-hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:text-[#E30613] hover:bg-transparent h-9 w-9 cursor-pointer"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-3.5 w-3.5" />
                </Button>
                <span className="w-10 text-center text-white font-bold text-sm">
                  {quantity}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:text-[#E30613] hover:bg-transparent h-9 w-9 cursor-pointer"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>
              <span className="text-gray-500 text-xs">
                Subtotal: <span className="text-white font-bold">${(selectedProduct.price * quantity).toFixed(2)}</span>
              </span>
            </div>
          </div>

          {/* Images */}
          <div className="relative bg-[#0A0A0A]">
            {/* Main Image with long-press for description */}
            <div
              className="relative aspect-[4/5] overflow-hidden select-none"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onTouchCancel={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <img
                key={`main-${selectedColor}-${activeImageIndex}`}
                src={currentImages[activeImageIndex] || currentImages[0]}
                alt={`${selectedProduct.name} ${selectedColor} - imagen ${activeImageIndex + 1}`}
                className="w-full h-full object-contain transition-transform duration-700 ease-out pointer-events-none"
              />

              {/* Description overlay — gradient from bottom to top, appears on long press */}
              <div
                className={`absolute inset-x-0 bottom-0 transition-opacity duration-300 pointer-events-none ${
                  showDescription ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div className="bg-gradient-to-t from-black/90 via-black/70 to-transparent pt-16 pb-6 px-5">
                  <p className="text-white text-xs leading-relaxed font-montserrat-medium">
                    {selectedProduct.description}
                  </p>
                </div>
              </div>

              {/* Navigation arrows */}
              {currentImages.length > 1 && (
                <>
                  <button
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-[#E30613]/80 transition-all duration-300 cursor-pointer z-10"
                    onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : currentImages.length - 1))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-[#E30613]/80 transition-all duration-300 cursor-pointer z-10"
                    onClick={() => setActiveImageIndex((prev) => (prev < currentImages.length - 1 ? prev + 1 : 0))}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </>
              )}

              {/* Image counter */}
              {currentImages.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full z-10">
                  {activeImageIndex + 1} / {currentImages.length}
                </div>
              )}
            </div>

            {/* Thumbnail strip */}
            {currentImages.length > 1 && (
              <div className="flex gap-2 px-3 py-2.5 bg-[#0A0A0A] overflow-x-auto justify-center">
                {currentImages.map((img, idx) => (
                  <button
                    key={`thumb-${selectedColor}-${idx}`}
                    className={`relative flex-shrink-0 w-12 h-15 rounded-lg overflow-hidden transition-all duration-300 cursor-pointer ${
                      activeImageIndex === idx
                        ? 'ring-2 ring-[#E30613] scale-105 shadow-lg shadow-[#E30613]/20'
                        : 'ring-1 ring-white/10 opacity-50 hover:opacity-100 hover:ring-white/30'
                    }`}
                    onClick={() => setActiveImageIndex(idx)}
                  >
                    <img
                      src={img}
                      alt={`Miniatura ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Add to Cart — below images */}
          <div className="p-4 bg-[#0A0A0A]">
            <Button
              className="w-full bg-[#E30613] hover:bg-[#ff2d34] text-white font-montserrat-bold text-sm py-4 rounded-2xl tracking-[0.06em] shadow-lg shadow-[#E30613]/25 transition-all duration-300 hover:scale-[1.02] whitespace-nowrap cursor-pointer"
              onClick={handleAddToCart}
              disabled={!selectedSize || !selectedColor}
            >
              <ShoppingBag className="h-5 w-5 mr-2 flex-shrink-0" />
              Add to Cart
            </Button>
          </div>
        </div>

        {/* ===== DESKTOP LAYOUT (side-by-side) ===== */}
        <div className="hidden md:flex md:flex-row h-full overflow-hidden">
          {/* LEFT: Product Info */}
          <div className="md:w-[45%] flex flex-col overflow-y-auto p-6 md:p-8 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
            {/* Category */}
            <p className="text-[#E30613] text-xs font-montserrat-bold tracking-[0.15em] uppercase mb-1">
              {selectedProduct.category}
            </p>

            {/* Title + Heart + Close */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <h2 className="text-2xl sm:text-3xl font-montserrat-extrabold text-white tracking-[-0.01em] leading-tight">
                {selectedProduct.name}
              </h2>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${
                    isWished
                      ? 'bg-white/5 border border-[#E30613]/40 text-[#E30613] shadow-lg shadow-[#E30613]/30'
                      : 'bg-white/5 border border-white/10 text-white/40 hover:text-[#E30613] hover:border-[#E30613]/30'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlistItem(selectedProduct.id, selectedColor);
                    setHeartAnimating(true);
                    setTimeout(() => setHeartAnimating(false), 700);
                  }}
                  aria-label={isWished ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                >
                  {heartAnimating && isWished && (
                    <span className="absolute inset-0 rounded-full border-2 border-[#E30613] heart-burst-ring" />
                  )}
                  <Heart className={`h-5 w-5 transition-all duration-300 ${isWished ? 'fill-[#E30613] text-[#E30613]' : ''} ${heartAnimating ? 'heart-animate' : ''}`} />
                </button>
                <button
                  onClick={() => setDetailOpen(false)}
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-all duration-300 cursor-pointer"
                  aria-label="Cerrar"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl font-montserrat-extrabold text-white">
                ${selectedProduct.price.toFixed(2)}
              </span>
              {selectedProduct.originalPrice && (
                <>
                  <span className="text-lg text-gray-500 line-through">
                    ${selectedProduct.originalPrice.toFixed(2)}
                  </span>
                  <Badge className="bg-[#E30613] text-white rounded-xl font-bold text-xs">
                    -{Math.round(((selectedProduct.originalPrice - selectedProduct.price) / selectedProduct.originalPrice) * 100)}% OFF
                  </Badge>
                </>
              )}
            </div>

            {/* Badges */}
            <div className="flex gap-2 mb-4">
              {selectedProduct.isNew && (
                <Badge className="bg-[#E30613] text-white font-bold rounded-lg text-[10px] px-2.5 py-0.5">NUEVO</Badge>
              )}
              {selectedProduct.isBestSeller && (
                <Badge className="bg-white/90 text-black font-bold rounded-lg text-[10px] px-2.5 py-0.5">TOP VENTAS</Badge>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-400 text-sm leading-relaxed mb-5 font-montserrat-medium">
              {selectedProduct.description}
            </p>

            {/* Color Selection */}
            <div className="mb-4">
              <p className="text-sm font-montserrat-bold text-white tracking-[0.06em] mb-2">
                Color: <span className="text-[#E30613]">{selectedColor}</span>
              </p>
              <div className="flex gap-3">
                {selectedProduct.colors.map((color) => (
                  <button
                    key={color.name}
                    className={`relative w-9 h-9 rounded-full border-2 transition-all duration-300 cursor-pointer ${
                      selectedColor === color.name
                        ? 'border-[#E30613] scale-110 shadow-lg shadow-[#E30613]/25'
                        : 'border-white/20 hover:border-white/50 hover:scale-105'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    onClick={() => handleColorChange(color.name)}
                    title={color.name}
                  >

                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-4">
              <p className="text-sm font-montserrat-bold text-white tracking-[0.06em] mb-2">
                Talla: <span className="text-[#E30613]">{selectedSize}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedProduct.sizes.map((size) => (
                  <button
                    key={size}
                    className={`min-w-[40px] h-10 px-3 text-sm font-bold uppercase rounded-xl transition-all duration-300 cursor-pointer ${
                      selectedSize === size
                        ? 'bg-[#E30613] text-white border-[#E30613] shadow-lg shadow-[#E30613]/20'
                        : 'bg-transparent text-gray-400 border border-white/20 hover:border-[#E30613] hover:text-white'
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity + Subtotal */}
            <div className="mb-6">
              <p className="text-sm font-montserrat-bold text-white tracking-[0.06em] mb-2">
                Cantidad
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-white/20 rounded-xl overflow-hidden">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:text-[#E30613] hover:bg-transparent h-10 w-10 cursor-pointer"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center text-white font-bold">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:text-[#E30613] hover:bg-transparent h-10 w-10 cursor-pointer"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-gray-500 text-sm">
                  Subtotal: <span className="text-white font-bold">${(selectedProduct.price * quantity).toFixed(2)}</span>
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT: Images + Add to Cart */}
          <div className="md:w-[55%] flex flex-col h-full bg-[#0A0A0A]">
            {/* Main Image */}
            <div className="relative flex-1 min-h-0 overflow-hidden">
              <img
                key={`main-${selectedColor}-${activeImageIndex}`}
                src={currentImages[activeImageIndex] || currentImages[0]}
                alt={`${selectedProduct.name} ${selectedColor} - imagen ${activeImageIndex + 1}`}
                className="w-full h-full object-contain transition-transform duration-700 ease-out"
              />

              {/* Navigation arrows */}
              {currentImages.length > 1 && (
                <>
                  <button
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-[#E30613]/80 transition-all duration-300 hover:scale-110 cursor-pointer"
                    onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : currentImages.length - 1))}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-[#E30613]/80 transition-all duration-300 hover:scale-110 cursor-pointer"
                    onClick={() => setActiveImageIndex((prev) => (prev < currentImages.length - 1 ? prev + 1 : 0))}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}

              {/* Image counter */}
              {currentImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  {activeImageIndex + 1} / {currentImages.length}
                </div>
              )}
            </div>

            {/* Thumbnail strip */}
            {currentImages.length > 1 && (
              <div className="flex gap-2 p-3 bg-[#0A0A0A] overflow-x-auto justify-center">
                {currentImages.map((img, idx) => (
                  <button
                    key={`thumb-${selectedColor}-${idx}`}
                    className={`relative flex-shrink-0 w-16 h-20 rounded-lg overflow-hidden transition-all duration-300 cursor-pointer ${
                      activeImageIndex === idx
                        ? 'ring-2 ring-[#E30613] scale-105 shadow-lg shadow-[#E30613]/20'
                        : 'ring-1 ring-white/10 opacity-50 hover:opacity-100 hover:ring-white/30'
                    }`}
                    onClick={() => setActiveImageIndex(idx)}
                  >
                    <img
                      src={img}
                      alt={`Miniatura ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Add to Cart — below images */}
            <div className="p-5 bg-[#0A0A0A]">
              <Button
                className="w-full bg-[#E30613] hover:bg-[#ff2d34] text-white font-montserrat-bold text-sm sm:text-base py-4 rounded-2xl tracking-[0.06em] shadow-lg shadow-[#E30613]/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-[#E30613]/30 whitespace-nowrap cursor-pointer"
                onClick={handleAddToCart}
                disabled={!selectedSize || !selectedColor}
              >
                <ShoppingBag className="h-5 w-5 mr-2 flex-shrink-0" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
