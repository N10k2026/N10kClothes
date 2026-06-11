import { create } from "zustand";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  createdAt: string;
}

interface AuthStore {
  user: User | null;
  isAuthModalOpen: boolean;
  authMode: 'login' | 'register' | 'profile';
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  setAuthModalOpen: (open: boolean) => void;
  setAuthMode: (mode: 'login' | 'register' | 'profile') => void;
  checkSession: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isAuthModalOpen: false,
  authMode: 'login',

  login: async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      localStorage.setItem('n10k_user_id', data.user.id);
      set({ user: data.user, isAuthModalOpen: false });
      return true;
    } catch {
      return false;
    }
  },

  register: async (name: string, email: string, password: string, phone?: string) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      localStorage.setItem('n10k_user_id', data.user.id);
      set({ user: data.user, isAuthModalOpen: false });
      return true;
    } catch {
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('n10k_user_id');
    set({ user: null, isAuthModalOpen: false, authMode: 'login' });
  },

  updateProfile: (data: Partial<User>) => {
    const current = get().user;
    if (current) {
      set({ user: { ...current, ...data } });
    }
  },

  setAuthModalOpen: (open) => set({ isAuthModalOpen: open }),
  setAuthMode: (mode) => set({ authMode: mode }),

  checkSession: async () => {
    const userId = localStorage.getItem('n10k_user_id');
    if (!userId) return;
    try {
      const res = await fetch('/api/auth/me', {
        headers: { 'x-user-id': userId },
      });
      if (res.ok) {
        const data = await res.json();
        set({ user: data });
      } else {
        localStorage.removeItem('n10k_user_id');
      }
    } catch {
      localStorage.removeItem('n10k_user_id');
    }
  },
}));
