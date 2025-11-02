import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useFavoritesStore } from '@store/favoritesStore'
import { useAuthStore } from '@store/authStore'
import { getUserFavorites, addToFavorites, removeFromFavorites, type FavoritesResult } from '@/services/api/favorites'
import { useMutationInvalidation } from './useQueryInvalidation'

/**
 * Custom hook for managing favorites with React Query integration
 * Provides optimistic updates and server synchronization
 */
export function useFavoritesQuery() {
  const queryClient = useQueryClient()
  const { isAuthenticated } = useAuthStore()
  const { onFavoriteAdded, onFavoriteRemoved } = useMutationInvalidation()
  const { 
    favorites: localFavorites, 
    isFavorite,
    syncFavorites,
    loading: localLoading,
    addFavorite: addFavoriteToStore,
    removeFavorite: removeFavoriteFromStore
  } = useFavoritesStore()

  // Query to fetch favorites from API
  const favoritesQuery = useQuery({
    queryKey: ['favorites'],
    queryFn: getUserFavorites,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (replaces cacheTime in newer versions)
    refetchOnWindowFocus: false
  })

  // Mutation to add favorite
  const addFavoriteMutation = useMutation({
    mutationFn: async (carId: string) => {
      await addFavoriteToStore(carId)
      return carId
    },
    onSuccess: onFavoriteAdded()
  })

  // Mutation to remove favorite
  const removeFavoriteMutation = useMutation({
    mutationFn: async (carId: string) => {
      await removeFavoriteFromStore(carId)
      return carId
    },
    onSuccess: onFavoriteRemoved()
  })

  // Sync favorites mutation
  const syncFavoritesMutation = useMutation({
    mutationFn: syncFavorites,
    onSuccess: onFavoriteAdded() // Usa a mesma invalidação que adicionar favorito
  })

  return {
    // Data
    favorites: localFavorites,
    favoritesData: favoritesQuery.data,
    
    // Loading states
    isLoading: favoritesQuery.isLoading || localLoading,
    isSyncing: syncFavoritesMutation.isPending,
    isAddingFavorite: addFavoriteMutation.isPending,
    isRemovingFavorite: removeFavoriteMutation.isPending,
    
    // Error states
    error: favoritesQuery.error || addFavoriteMutation.error || removeFavoriteMutation.error,
    
    // Actions
    addToFavorites: addFavoriteMutation.mutate,
    removeFromFavorites: removeFavoriteMutation.mutate,
    syncFavorites: syncFavoritesMutation.mutate,
    isFavorite,
    
    // Query controls
    refetch: favoritesQuery.refetch,
    isRefetching: favoritesQuery.isRefetching
  }
}