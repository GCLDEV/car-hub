import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface FavoritesState {
  favorites: string[]
  addFavorite: (id: string) => void
  removeFavorite: (id: string) => void
  isFavorite: (id: string) => boolean
  clearFavorites: () => void
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      
      addFavorite: (id: string) => {
        set((state) => ({
          favorites: [...state.favorites, id]
        }))
      },
      
      removeFavorite: (id: string) => {
        set((state) => ({
          favorites: state.favorites.filter(fav => fav !== id)
        }))
      },
      
      isFavorite: (id: string) => {
        return get().favorites.includes(id)
      },
      
      clearFavorites: () => {
        set({ favorites: [] })
      }
    }),
    {
      name: 'favorites-storage',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
)