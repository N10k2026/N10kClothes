'use client';

import { useCartStore, Product } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import React from 'react';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useMemo } from 'react';

/** Get images for a given product and color name */
function getImagesForColor(product: Product, colorName: string): string[] {
  if (product.colorImages && product.colorImages[colorName]) {
    return product.colorImages[colorName];
  }
  return product.images.length > 0 ? product.images : [product.image];
}

const WishlistSidebar = function WishlistSidebar() {
  // Zustand selectors — subscribe only to what we need
  const wishlist = useCartStore((state) => state.wishlist);
  const isWishlistOpen = useCartStore((state) => state.isWishlistOpen);
  const setWishlistOpen = useCartStore((state) => state.setWishlistOpen);
  const removeWishlistItem = useCartStore((state) => state.removeWishlistItem);
  const clearWishlist = useCartStore((state) => state.clearWishlist);
  const addItem = useCartStore((state) => state.addItem);
  const setSelectedProduct = useCartStore((state) => state.setSelectedProduct);
  const setPreselectedColor = useCartStore((state) => state.setPreselectedColor);
  const setDetailOpen = useCartStore((state) => state.setDetailOpen);
  const products = useCartStore((state) => state.products);

  // Look up full product objects from wishlist items (product+color pairs)
  const wishlistEntries = useMemo(() => {
    const productMap = new Map(products.map((p) => [p.id, p]));
    return wishlist
      .map((w) => {
        const product = productMap.get(w.productId);
        if (!product) return null;
        return { product, colorName: w.colorName };
      })
      .filter(Boolean) as { product: Product; colorName: string }[];
  }, [wishlist, products]);

  return (
    <Sheet open={isWishlistOpen} onOpenChange={setWishlistOpen}>
      <SheetContent side="left" className="w-full sm:max-w-md bg-[#000000] border-r border-white/10 p-0 flex flex-col">
        <SheetHeader className="p-6 pb-4 border-b border-white/5">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-white font-black tracking-wider flex items-center gap-3">
              <Heart className="h-5 w-5 text-[#E30613]" />
              FAVORITOS
              <span className="text-sm text-[#E30613] font-bold">({wishlist.length})</span>
            </SheetTitle>
            <SheetDescription className="sr-only">Lista de favoritos</SheetDescription>
          </div>
        </SheetHeader>

        {/* Wishlist Items */}
        {wishlist.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6">
            <div className="w-20 h-20 bg-[#1A1A1A] rounded-full flex items-center justify-center mb-4">
              <Heart className="h-8 w-8 text-gray-600" />
            </div>
            <p className="text-gray-400 font-bold text-lg mb-1.5">No tienes favoritos aún</p>
            <p className="text-gray-600 text-sm text-center mb-6">
              <span className="block">Explora nuestras colecciones y</span>
              <span className="block">guarda las prendas que más te gusten</span>
            </p>
            <Button
              className="bg-[#E30613] hover:bg-[#ff2d34] text-white font-bold text-sm px-6 py-2.5 rounded-full tracking-wide"
              onClick={() => setWishlistOpen(false)}
              asChild
            >
              <a href="#collection">Colección</a>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {wishlistEntries.map((entry) => {
                const { product, colorName } = entry;
                const colorObj = product.colors.find((c) => c.name === colorName);
                const colorImages = getImagesForColor(product, colorName);
                const displayImage = colorImages[0] || product.image;

                return (
                  <div
                    key={`${product.id}-${colorName}`}
                    className="flex gap-4 bg-[#1A1A1A] p-3 border border-white/5 group hover:border-[#E30613]/20 transition-colors"
                  >
                    {/* Product image */}
                    <div
                      className="w-20 h-24 flex-shrink-0 overflow-hidden cursor-pointer"
                      onClick={() => {
                        setWishlistOpen(false);
                        setSelectedProduct(product);
                        setPreselectedColor(colorName);
                        setDetailOpen(true);
                      }}
                    >
                      <img
                        src={displayImage}
                        alt={`${product.name} — ${colorName}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Product info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-white line-clamp-1">
                            {product.name}
                          </h4>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {product.category}
                          </p>
                          {/* Color indicator */}
                          {colorObj && (
                            <div className="flex items-center gap-1.5 mt-2">
                              <span
                                className="w-3 h-3 rounded-full border border-white/20"
                                style={{ backgroundColor: colorObj.hex }}
                              />
                              <span className="text-[10px] text-gray-400 capitalize">{colorName}</span>
                            </div>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-gray-500 hover:text-[#E30613] -mt-1 -mr-1"
                          onClick={() => removeWishlistItem(product.id, colorName)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-black text-white">
                            ${product.price.toFixed(2)}
                          </span>
                          {product.originalPrice && (
                            <span className="text-[10px] text-white/40 line-through">
                              ${product.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>

                        {/* Quick add to cart — uses the specific color */}
                        <button
                          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#E30613]/15 backdrop-blur-sm text-[#E30613] text-[10px] font-montserrat-bold tracking-[0.08em] uppercase transition-all duration-300 hover:bg-[#E30613] hover:text-white cursor-pointer border border-[#E30613]/20 hover:border-[#E30613]/60"
                          onClick={() => {
                            addItem({
                              product,
                              quantity: 1,
                              selectedSize: product.sizes[0],
                              selectedColor: colorName,
                            });
                          }}
                        >
                          <ShoppingBag className="h-2.5 w-2.5" />
                          Agregar
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="border-t border-white/5 p-6 space-y-4 bg-[#0D0D0D]">
              <Button
                className="w-full bg-[#E30613] hover:bg-[#ff2d34] text-white font-black text-base py-6 rounded-none tracking-wider uppercase shadow-lg shadow-[#E30613]/20"
                onClick={() => {
                  // Add all wishlist items to cart with their specific colors
                  wishlistEntries.forEach((entry) => {
                    addItem({
                      product: entry.product,
                      quantity: 1,
                      selectedSize: entry.product.sizes[0],
                      selectedColor: entry.colorName,
                    });
                  });
                  setWishlistOpen(false);
                }}
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                Agregar Todo al Carrito
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>

              <Button
                variant="outline"
                className="w-full border-white/10 text-gray-400 hover:text-white hover:border-white/30 font-montserrat-bold rounded-none"
                onClick={() => setWishlistOpen(false)}
              >
                Seguir Explorando
              </Button>

              <button
                className="w-full text-center text-xs text-gray-600 hover:text-[#E30613] transition-colors"
                onClick={clearWishlist}
              >
                Vaciar Favoritos
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default React.memo(WishlistSidebar);
