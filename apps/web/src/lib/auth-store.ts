import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi, tokenStorage } from './api';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
}

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loadProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      isAuthenticated: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const data = await authApi.login(email, password);
          set({
            user: data.user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (err) {
          set({ isLoading: false });
          throw err;
        }
      },

      register: async (name, email, password) => {
        set({ isLoading: true });
        try {
          const data = await authApi.register(name, email, password);
          set({
            user: data.user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (err) {
          set({ isLoading: false });
          throw err;
        }
      },

      logout: () => {
        authApi.logout();
        set({ user: null, isAuthenticated: false });
      },

      loadProfile: async () => {
        if (!tokenStorage.getAccess()) return;
        try {
          const profile = await authApi.getProfile();
          if (profile) {
            set({ user: profile, isAuthenticated: true });
          } else {
            set({ user: null, isAuthenticated: false });
            tokenStorage.clear();
          }
        } catch {
          set({ user: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: 'srm-auth',
      partialize: (state: AuthState) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    },
  ),
);
