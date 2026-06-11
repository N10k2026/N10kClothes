'use client';

import React, { useMemo, useCallback } from 'react';
import { useCartStore, selectTotalItems } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Minus, Plus, ShoppingBag, Trash2, MessageCircle } from 'lucide-react';

const CartSidebar = function CartSidebar() {
  // Zustand selectors — subscribe only to what we need
  const items = useCartStore((state) => state.items);
  const isOpen = useCartStore((state) => state.isOpen);
  const setOpen = useCartStore((state) => state.setOpen);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);

  // Derived selector for totalItems (PERF-9)
  const totalItems = useCartStore(selectTotalItems);
  const totalPrice = useMemo(() => items.reduce((sum, i) => sum + i.product.price * i.quantity, 0), [items]);
  const shipping = totalPrice > 50 ? 0 : 4.99;
  const finalTotal = totalPrice + shipping;

  // WhatsApp number (country code + number, no + or spaces)
  const WHATSAPP_NUMBER = '584122880228';

  // Build WhatsApp message from cart
  const buildWhatsAppMessage = useCallback(() => {
    const lines = items.map((item, i) => {
      const subtotal = (item.product.price * item.quantity).toFixed(2);
      return `${i + 1}. *${item.product.name}*\n   Talla: ${item.selectedSize} | Color: ${item.selectedColor}\n   Cant: ${item.quantity} x $${item.product.price.toFixed(2)} = *$${subtotal}*`;
    });

    const shippingText = shipping === 0 ? 'GRATIS' : `$${shipping.toFixed(2)}`;

    const message = [
      `*NUEVO PEDIDO - N10K Clothes*`,
      ``,
      lines.join('\n\n'),
      ``,
      `----------------------------`,
      `Subtotal: $${totalPrice.toFixed(2)}`,
      `Envio: ${shippingText}`,
      `*Total: $${finalTotal.toFixed(2)}*`,
      ``,
      `Gracias por comprar con N10K!`,
    ].join('\n');

    return encodeURIComponent(message);
  }, [items, totalPrice, shipping, finalTotal]);

  const handleWhatsAppCheckout = useCallback(() => {
    const message = buildWhatsAppMessage();
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  }, [buildWhatsAppMessage]);

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="w-full sm:max-w-md bg-[#000000] border-l border-white/10 p-0 flex flex-col">
        <SheetHeader className="p-6 pb-4 border-b border-white/5">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-white font-black tracking-wider flex items-center gap-3">
              <ShoppingBag className="h-5 w-5 text-[#E30613]" />
              CARRITO
              <span className="text-sm text-[#E30613] font-bold">({totalItems})</span>
            </SheetTitle>
            <SheetDescription className="sr-only">Carrito de compras</SheetDescription>
          </div>
        </SheetHeader>

        {/* Cart Items */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6">
            <div className="w-20 h-20 bg-[#1A1A1A] rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="h-8 w-8 text-gray-600" />
            </div>
            <p className="text-gray-400 font-bold text-lg mb-2">Tu carrito está vacío</p>
            <p className="text-gray-600 text-sm text-center mb-6">
              Explora nuestra colección y encuentra tu próximo look N10K
            </p>
            <Button
              className="bg-[#E30613] hover:bg-[#ff2d34] text-white font-montserrat-bold rounded-none"
              onClick={() => setOpen(false)}
              asChild
            >
              <a href="#collection">Ver Colección</a>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                  className="flex gap-4 bg-[#1A1A1A] p-3 border border-white/5"
                >
                  <div className="w-20 h-24 flex-shrink-0 overflow-hidden">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-white line-clamp-1">
                          {item.product.name}
                        </h4>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {item.selectedSize} · {item.selectedColor}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-gray-500 hover:text-[#E30613] -mt-1 -mr-1"
                        onClick={() =>
                          removeItem(item.product.id, item.selectedSize, item.selectedColor)
                        }
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-white/10">
                        <button
                          className="h-7 w-7 flex items-center justify-center text-gray-400 hover:text-white"
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.selectedSize,
                              item.selectedColor,
                              item.quantity - 1
                            )
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-white text-xs font-bold">
                          {item.quantity}
                        </span>
                        <button
                          className="h-7 w-7 flex items-center justify-center text-gray-400 hover:text-white"
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.selectedSize,
                              item.selectedColor,
                              item.quantity + 1
                            )
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <span className="text-sm font-black text-white">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="border-t border-white/5 p-6 space-y-4 bg-[#0D0D0D]">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-white font-bold">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Envío</span>
                  <span className={`font-bold ${shipping === 0 ? 'text-green-500' : 'text-white'}`}>
                    {shipping === 0 ? 'GRATIS' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-[10px] text-gray-600">
                    Envío gratis en compras mayores a $50.00
                  </p>
                )}
                <Separator className="bg-white/10" />
                <div className="flex justify-between">
                  <span className="text-white font-bold text-lg">Total</span>
                  <span className="text-[#E30613] font-black text-xl">${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              <Button
                className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-base py-6 rounded-none tracking-wider uppercase shadow-lg shadow-[#25D366]/20 transition-all duration-300 hover:scale-[1.02]"
                onClick={handleWhatsAppCheckout}
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Pedir por WhatsApp
              </Button>

              <Button
                variant="outline"
                className="w-full border-white/10 text-gray-400 hover:text-white hover:border-white/30 font-montserrat-bold rounded-none"
                onClick={() => setOpen(false)}
              >
                Seguir Comprando
              </Button>

              <button
                className="w-full text-center text-xs text-gray-600 hover:text-[#E30613] transition-colors"
                onClick={clearCart}
              >
                Vaciar Carrito
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default React.memo(CartSidebar);
