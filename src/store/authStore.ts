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
      
      login: (user: User, token: string) => {
        set({ 
          user, 
          isAuthenticated: true,
          token 
        })
      },
      
      logout: () => {
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