import { create } from 'zustand';
import type { UserProfile } from '../types';

interface AuthState {
  token: string | null;
  organisationId: string | null;
  user: UserProfile | null;
  setAuth: (token: string, organisationId?: string) => void;
  setUser: (user: UserProfile | null) => void;
  logout: () => void;
}

export const authStore = create<AuthState>((set) => ({
  token: null,
  organisationId: null,
  user: null,
  setAuth: (token, organisationId) =>
    set({ token, organisationId: organisationId ?? null }),
  setUser: (user) => set({ user }),
  logout: () => set({ token: null, organisationId: null, user: null }),
}));

if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).__authStore = authStore;
}
