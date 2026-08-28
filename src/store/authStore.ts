import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';
import { authApi } from '../api/client';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<boolean>;
  adminLogin: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, fullName: string, phone?: string) => Promise<boolean>;
  loginWithGoogle: (data?: { email?: string; full_name?: string }) => Promise<boolean>;
  logout: () => void;
  fetchMe: () => Promise<void>;
  updateProfile: (data: { full_name?: string; phone?: string; saved_addresses?: string[] }) => Promise<boolean>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const res = await authApi.login({ email, password });
          set({
            user: res.user,
            token: res.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return true;
        } catch (err: any) {
          const message = err.response?.data?.message || 'Failed to authenticate';
          set({ error: message, isLoading: false });
          return false;
        }
      },

      adminLogin: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const res = await authApi.adminLogin({ email, password });
          set({
            user: res.user,
            token: res.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return true;
        } catch (err: any) {
          const message = err.response?.data?.message || 'Master Administrator authentication failed';
          set({ error: message, isLoading: false });
          return false;
        }
      },

      register: async (email, password, fullName, phone) => {
        set({ isLoading: true, error: null });
        try {
          const res = await authApi.register({
            email,
            password,
            full_name: fullName,
            phone,
          });
          set({
            user: res.user,
            token: res.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return true;
        } catch (err: any) {
          const message = err.response?.data?.message || 'Failed to create account';
          set({ error: message, isLoading: false });
          return false;
        }
      },

      loginWithGoogle: async (customData) => {
        set({ isLoading: true, error: null });
        try {
          const email = customData?.email || 'alex.morgan@gmail.com';
          const full_name = customData?.full_name || 'Alex Morgan';
          const res = await authApi.loginWithGoogle({ email, full_name });
          set({
            user: res.user,
            token: res.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return true;
        } catch (err: any) {
          const message = err.response?.data?.message || 'Failed to sign in with Google';
          set({ error: message, isLoading: false });
          return false;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      fetchMe: async () => {
        const token = get().token;
        if (!token) return;

        try {
          const user = await authApi.getMe();
          set({ user, isAuthenticated: true });
        } catch {
          // Token invalid or expired
          get().logout();
        }
      },

      updateProfile: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const user = await authApi.updateProfile(data);
          set({ user, isLoading: false });
          return true;
        } catch (err: any) {
          const message = err.response?.data?.message || 'Failed to update profile';
          set({ error: message, isLoading: false });
          return false;
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'apsara-auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
