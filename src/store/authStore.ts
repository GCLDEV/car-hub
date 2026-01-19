import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  phone?: string
  location?: string
  cityState?: string
  isDealer?: boolean
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  token: string | null
  _hasHydrated: boolean
  login: (user: User, token: string) => void
  logout: () => void
  updateProfile: (data: Partial<User>) => void
  setToken: (token: string) => void
  setHasHydrated: (state: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      token: null,
      _hasHydrated: false,
      
      login: async (user: User, token: string) => {
        // console.log('🔑 Fazendo login:', {
        //   userId: user.id,
        //   username: user.username || user.email,
        //   tokenPreview: `${token.substring(0, 20)}...`,
        //   tokenLength: token.length
        // })
        
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
          // console.log('✅ Favoritos sincronizados após login')
        } catch (error) {
          console.warn('Failed to sync favorites after login:', error)
        }
      },
      
      logout: () => {
        // console.log('🚪 Executando logout completo...')
        
        // Clear favorites before logout
        try {
          const { useFavoritesStore } = require('./favoritesStore')
          const favoritesStore = useFavoritesStore.getState()
          favoritesStore.clearFavorites()
        } catch (error) {
          console.warn('Failed to clear favorites on logout:', error)
        }
        
        // Clear auth state
        set({ 
          user: null, 
          isAuthenticated: false,
          token: null 
        })
        
        // Force clear AsyncStorage para garantir limpeza completa
        import('@react-native-async-storage/async-storage').then(({ default: AsyncStorage }) => {
          AsyncStorage.removeItem('auth-storage').then(() => {
            // console.log('✅ AsyncStorage limpo completamente')
          })
        })
      },
      
      updateProfile: (data: Partial<User>) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null
        }))
      },
      
      setToken: (token: string) => {
        set({ token })
      },
      
      setHasHydrated: (state: boolean) => {
        set({ _hasHydrated: state })
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
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      }
    }
  )
)