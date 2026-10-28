import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      setSession: (token, user) => set({ token, user }),
      setUser: (user) => set((s) => ({ user: { ...s.user, ...user } })),
      logout: () => set({ token: null, user: null }),
    }),
    { name: 'funval-auth' }
  )
)

export const isAdmin = (user) => String(user?.role || '').toLowerCase() === 'admin'
