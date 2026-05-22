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

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  organisationId: null,
  user: null,
  setAuth: (token, organisationId) =>
    set({ token, organisationId: organisationId ?? null }),
  setUser: (user) => set({ user }),
  logout: () => set({ token: null, organisationId: null, user: null }),
}));
