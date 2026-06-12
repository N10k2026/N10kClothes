import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  /** Images grouped by color name. Key = color name, Value = array of image paths */
  colorImages?: Record<string, string[]>;
  sizes: string[];
  colors: { name: string; hex: string }[];
  description: string;
  isNew?: boolean;
  isBestSeller?: boolean;
  /** Product video URL for hover/preview playback */
  video?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface WishlistItem {
  productId: string;
  colorName: string;
}

export const categories = ["Todos", "Hoodies", "Suéters", "Franelas", "Shorts"];

// Guard to prevent concurrent fetch calls (mutable object so importers can modify)
export const fetchGuard = { inProgress: false };

export type FetchStatus = 'idle' | 'loading' | 'success' | 'error';

interface CartStore {
  items: CartItem[];
  products: Product[];
  productsStatus: FetchStatus;
  productsError: string | null;
  isOpen: boolean;
  isDetailOpen: boolean;
  selectedProduct: Product | null;
  preselectedColor: string | null;
  setOpen: (open: boolean) => void;
  setDetailOpen: (open: boolean) => void;
  setSelectedProduct: (product: Product | null) => void;
  setPreselectedColor: (color: string | null) => void;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
  fetchProducts: () => Promise<void>;
  // Wishlist state — stores product+color pairs
  wishlist: WishlistItem[];
  isWishlistOpen: boolean;
  setWishlistOpen: (open: boolean) => void;
  toggleWishlistItem: (productId: string, colorName: string) => void;
  removeWishlistItem: (productId: string, colorName: string) => void;
  clearWishlist: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      products: [],
      productsStatus: 'idle' as FetchStatus,
      productsError: null,
      isOpen: false,
      isDetailOpen: false,
      selectedProduct: null,
      preselectedColor: null,
      setOpen: (open) => set({ isOpen: open }),
      setDetailOpen: (open) => set({ isDetailOpen: open }),
      setSelectedProduct: (product) => set({ selectedProduct: product }),
      setPreselectedColor: (color) => set({ preselectedColor: color }),
      addItem: (item) => {
        const items = get().items;
        const existing = items.find(
          (i) =>
            i.product.id === item.product.id &&
            i.selectedSize === item.selectedSize &&
            i.selectedColor === item.selectedColor
        );
        if (existing) {
          set({
            items: items.map((i) =>
              i.product.id === item.product.id &&
              i.selectedSize === item.selectedSize &&
              i.selectedColor === item.selectedColor
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          });
        } else {
          set({ items: [...items, item] });
        }
      },
      removeItem: (productId, size, color) => {
        set({
          items: get().items.filter(
            (i) =>
              !(i.product.id === productId &&
                i.selectedSize === size &&
                i.selectedColor === color)
          ),
        });
      },
      updateQuantity: (productId, size, color, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, size, color);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.product.id === productId &&
            i.selectedSize === size &&
            i.selectedColor === color
              ? { ...i, quantity }
              : i
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: () => get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
      // Wishlist implementation — product+color pairs
      wishlist: [],
      isWishlistOpen: false,
      setWishlistOpen: (open) => set({ isWishlistOpen: open }),
      toggleWishlistItem: (productId, colorName) => {
        const current = get().wishlist;
        const existing = current.find((w) => w.productId === productId && w.colorName === colorName);
        if (existing) {
          set({ wishlist: current.filter((w) => !(w.productId === productId && w.colorName === colorName)) });
        } else {
          set({ wishlist: [...current, { productId, colorName }] });
        }
      },
      removeWishlistItem: (productId, colorName) => {
        set({ wishlist: get().wishlist.filter((w) => !(w.productId === productId && w.colorName === colorName)) });
      },
      clearWishlist: () => set({ wishlist: [] }),
      fetchProducts: async () => {
        const state = get();
        if (state.productsStatus === 'success' || fetchGuard.inProgress) return; // Already loaded or in progress
        fetchGuard.inProgress = true;
        set({ productsStatus: 'loading', productsError: null });

        const MAX_RETRIES = 3;
        const RETRY_DELAY = 1500;

        for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
          try {
            const res = await fetch('/api/products');

            // Handle non-JSON responses (e.g., server returning HTML error pages)
            const contentType = res.headers.get('content-type') || '';
            if (!contentType.includes('application/json')) {
              if (attempt < MAX_RETRIES) {
                await new Promise(r => setTimeout(r, RETRY_DELAY * attempt));
                continue;
              }
              throw new Error('El servidor no está disponible. Intenta de nuevo más tarde.');
            }

            if (!res.ok) {
              const errorData = await res.json().catch(() => null);
              const msg = errorData?.error || `Error del servidor (${res.status})`;
              throw new Error(msg);
            }

            const data = await res.json();
            set({ products: data, productsStatus: 'success', productsError: null });
            fetchGuard.inProgress = false;
            return;
          } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Error desconocido';
            if (attempt < MAX_RETRIES) {
              await new Promise(r => setTimeout(r, RETRY_DELAY * attempt));
              continue;
            }
            console.error('Failed to fetch products after retries:', message);
            set({ productsStatus: 'error', productsError: message });
          }
        }

        fetchGuard.inProgress = false;
      },
    }),
    {
      name: 'n10k-store', // localStorage key
      storage: createJSONStorage(() => localStorage),
      // Only persist cart items and wishlist — not UI state or products
      partialize: (state) => ({
        items: state.items,
        wishlist: state.wishlist,
      }),
    }
  )
);

/** Derived selector: total cart item count */
export const selectTotalItems = (state: CartStore) =>
  state.items.reduce((sum, i) => sum + i.quantity, 0);

/** Derived selector: wishlist as a Set of composite keys for O(1) lookups */
export const selectWishlistSet = (state: CartStore) =>
  new Set(state.wishlist.map((w) => `${w.productId}|${w.colorName}`));
