import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  phone?: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  token: string | null
  login: (user: User, token: string) => void
  logout: () => void
  updateProfile: (data: Partial<User>) => void
  setToken: (token: string) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      token: null,
      
      login: async (user: User, token: string) => {
        set({ 
          user, 
          isAuthenticated: true,
          token 
        })
        
        // Sync favorites after successful login
        try {
          const { useFavoritesStore } = await import('./favoritesStore')
          const favoritesStore = useFavoritesStore.getState()
          await favoritesStore.syncFavorites()
        } catch (error) {
          console.warn('Failed to sync favorites after login:', error)
        }
      },
      
      logout: () => {
        // Clear favorites before logout
        try {
          const { useFavoritesStore } = require('./favoritesStore')
          const favoritesStore = useFavoritesStore.getState()
          favoritesStore.clearFavorites()
        } catch (error) {
          console.warn('Failed to clear favorites on logout:', error)
        }
        
        set({ 
          user: null, 
          isAuthenticated: false,
          token: null 
        })
      },
      
      updateProfile: (data: Partial<User>) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null
        }))
      },
      
      setToken: (token: string) => {
        set({ token })
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        token: state.token,
      }),
    }
  )
)