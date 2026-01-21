import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/lib/types'

interface AuthStore {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isHydrated: boolean
  setAuth: (user: User, token: string) => void
  logout: () => void
  setHydrated: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isHydrated: false,
      setAuth: (user, token) => {
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        set({ user, token, isAuthenticated: true })
      },
      logout: () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        set({ user: null, token: null, isAuthenticated: false })
      },
      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        state?.setHydrated()
      },
    }
  )
)
