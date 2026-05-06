import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'client' | 'lawyer' | 'admin' | 'super-admin' | null;

interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phoneNumber?: string;
  bio?: string;
  specialization?: string;
  barId?: string;
}

interface SelectedCase {
  _id: string;
  caseCode: string;
}

interface AuthState {
  user: User | null;
  token: string | null; // ✅ keep this
  isAuthenticated: boolean;

  selectedCase: SelectedCase | null;

  isHydrated: boolean;

  setSelectedCase: (data: SelectedCase | null) => void;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (updatedFields: Partial<User>) => void;

  isAdmin: () => boolean;
  isLawyer: () => boolean;
  isClient: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      selectedCase: null,
      isHydrated: false,

      setSelectedCase: (data) => set({ selectedCase: data }),

      // ✅ LOGIN
      setAuth: (user, token) => {
        set({
          user,
          token, // 🔥 IMPORTANT: store token here
          isAuthenticated: true,
        });
      },

      // ✅ LOGOUT
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          selectedCase: null,
        });
      },

      updateUser: (updatedFields) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedFields } : null,
        })),

      isAdmin: () => {
        const role = get().user?.role;
        return role === 'admin' || role === 'super-admin';
      },

      isLawyer: () => get().user?.role === 'lawyer',
      isClient: () => get().user?.role === 'client',
    }),
    {
      name: 'legalease-auth-storage',

      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),

      onRehydrateStorage: () => (state, error) => {
        if (!error) {
          useAuthStore.setState({ isHydrated: true });
        }
      },
    }
  )
);