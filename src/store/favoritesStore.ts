import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { addToFavorites, removeFromFavorites, getUserFavorites } from '@/services/api/favorites'
import { useOfflineCacheStore } from './offlineCacheStore'
import { useNetworkStore } from './networkStore'
import Toast from 'react-native-toast-message'

interface FavoritesState {
  // Local state for quick access (array of car IDs)
  favorites: string[]
  loading: boolean
  error: string | null
  
  // Actions
  addFavorite: (carId: string) => Promise<void>
  removeFavorite: (carId: string) => Promise<void>
  isFavorite: (carId: string) => boolean
  syncFavorites: () => Promise<void>
  clearFavorites: () => void
  setFavorites: (favorites: string[]) => void
  
  // Internal state management
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      loading: false,
      error: null,
      
      // Add car to favorites (API + optimistic update)
      addFavorite: async (carId: string) => {
        const { favorites, setLoading, setError } = get()
        const networkState = useNetworkStore.getState()
        
        // Optimistic update
        if (!favorites.includes(carId)) {
          set(state => ({
            favorites: [...state.favorites, carId]
          }))
        }
        
        // If offline, add to queue and show toast
        if (!networkState.isConnected || !networkState.isInternetReachable) {
          const offlineStore = useOfflineCacheStore.getState()
          offlineStore.addToOfflineQueue({
            type: 'favorite',
            data: { carId }
          })
          
          Toast.show({
            type: 'info',
            text1: 'Added to favorites',
            text2: 'Will sync when back online'
          })
          return
        }
        
        setLoading(true)
        setError(null)
        
        try {
          await addToFavorites(carId)
          
          Toast.show({
            type: 'success',
            text1: 'Added to favorites',
            text2: 'Car saved to your favorites'
          })
        } catch (error: any) {
          // Revert optimistic update on error
          set(state => ({
            favorites: state.favorites.filter(id => id !== carId)
          }))
          
          const errorMessage = error.message || 'Failed to add to favorites'
          setError(errorMessage)
          
          Toast.show({
            type: 'error',
            text1: 'Failed to add favorite',
            text2: errorMessage
          })
        } finally {
          setLoading(false)
        }
      },
      
      // Remove car from favorites (API + optimistic update)
      removeFavorite: async (carId: string) => {
        const { favorites, setLoading, setError } = get()
        const networkState = useNetworkStore.getState()
        
        // Optimistic update
        set(state => ({
          favorites: state.favorites.filter(id => id !== carId)
        }))
        
        // If offline, add to queue and show toast
        if (!networkState.isConnected || !networkState.isInternetReachable) {
          const offlineStore = useOfflineCacheStore.getState()
          offlineStore.addToOfflineQueue({
            type: 'unfavorite',
            data: { carId }
          })
          
          Toast.show({
            type: 'info',
            text1: 'Removed from favorites',
            text2: 'Will sync when back online'
          })
          return
        }
        
        setLoading(true)
        setError(null)
        
        try {
          await removeFromFavorites(carId)
          
          Toast.show({
            type: 'success',
            text1: 'Removed from favorites',
            text2: 'Car removed from your favorites'
          })
        } catch (error: any) {
          // Revert optimistic update on error
          if (!favorites.includes(carId)) {
            set(state => ({
              favorites: [...state.favorites, carId]
            }))
          }
          
          const errorMessage = error.message || 'Failed to remove from favorites'
          setError(errorMessage)
          
          Toast.show({
            type: 'error',
            text1: 'Failed to remove favorite',
            text2: errorMessage
          })
        } finally {
          setLoading(false)
        }
      },
      
      // Check if car is in favorites
      isFavorite: (carId: string) => {
        return get().favorites.includes(carId)
      },
      
      // Sync favorites with API (used on app startup and network reconnection)
      syncFavorites: async () => {
        const { setLoading, setError, setFavorites } = get()
        
        setLoading(true)
        setError(null)
        
        try {
          const favoritesResult = await getUserFavorites()
          const favoriteIds = favoritesResult.results.map(fav => fav.car.id)
          setFavorites(favoriteIds)
        } catch (error: any) {
          const errorMessage = error.message || 'Failed to sync favorites'
          setError(errorMessage)
          
          // Only show toast if it's not a "no auth" error
          if (!errorMessage.includes('authenticated')) {
            Toast.show({
              type: 'error',
              text1: 'Failed to sync favorites',
              text2: errorMessage
            })
          }
        } finally {
          setLoading(false)
        }
      },
      
      // Clear all favorites (usually on logout)
      clearFavorites: () => {
        set({ favorites: [], error: null })
      },
      
      // Internal state setters
      setFavorites: (favorites: string[]) => {
        set({ favorites })
      },
      
      setLoading: (loading: boolean) => {
        set({ loading })
      },
      
      setError: (error: string | null) => {
        set({ error })
      }
    }),
    {
      name: 'favorites-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist the favorites array, not loading/error states
      partialize: (state) => ({ favorites: state.favorites })
    }
  )
)