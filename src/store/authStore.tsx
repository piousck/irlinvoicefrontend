import React, { createContext, useContext, useEffect, useState } from 'react';
import { create } from 'zustand';
import type { UserProfile } from '../types';
import { getMe } from '../api/auth';
import { registerAuthStore } from '../api/client';

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
  setAuth: (token, organisationId) => set({ token, organisationId: organisationId ?? null }),
  setUser: (user) => set({ user }),
  logout: () => set({ token: null, organisationId: null, user: null }),
}));

// Register the auth store getter with the API client
registerAuthStore(() => ({
  token: authStore.getState().token,
  organisationId: authStore.getState().organisationId,
  logout: authStore.getState().logout,
}));

const AuthContext = createContext<{ ready: boolean }>({ ready: false });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ready, setReady] = useState(false);
  const setUser = authStore((s) => s.setUser);

  useEffect(() => {
    const init = async () => {
      try {
        const token = authStore.getState().token;
        if (token) {
          const me = await getMe();
          setUser(me);
          authStore.getState().setAuth(token, me.organisation_id);
        }
      } catch {
        authStore.getState().logout();
      } finally {
        setReady(true);
      }
    };
    void init();
  }, [setUser]);

  return <AuthContext.Provider value={{ ready }}>{children}</AuthContext.Provider>;
};

export const useAuthReady = () => useContext(AuthContext).ready;
