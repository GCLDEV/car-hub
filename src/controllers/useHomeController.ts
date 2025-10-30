import { useState, useCallback } from 'react'
import { useRouter } from 'expo-router'
import { useInfiniteQuery } from '@tanstack/react-query'
import Toast from 'react-native-toast-message'

import { getCarsList, testAPI } from '@services/api'
import { useFavoritesStore } from '@store/favoritesStore'
import { useFiltersStore } from '@store/filtersStore'
import { useOfflineCacheStore } from '@store/offlineCacheStore'
import { useOptimizedCarQuery } from '@hooks/useOptimizedCarQuery'
import useNetworkController from './useNetworkController'
import useAuthGuard from '@hooks/useAuthGuard'
import { Car } from '@/types/car'

export default function useHomeController() {
  const router = useRouter()
  // Favorites are now handled directly by the FavoriteButton component
  const { filters, setFilter } = useFiltersStore()
  const { addToOfflineQueue } = useOfflineCacheStore()
  const { isOnline, isConnected, hasOfflineQueue } = useNetworkController()
  const { checkAuth } = useAuthGuard()

  const [refreshing, setRefreshing] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    refetch
  } = useInfiniteQuery({
    queryKey: ['cars', filters],
    queryFn: async ({ pageParam = 1 }) => {
      return await getCarsList({ ...filters, page: pageParam })
    },
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.hasNext ? lastPage.pagination.page + 1 : undefined
    },
    initialPageParam: 1,
    
    // ✨ Configurações otimizadas para performance + real-time
    staleTime: 2 * 60 * 1000,        // 2 minutos cache
    gcTime: 10 * 60 * 1000,          // 10 minutos em memória
    refetchOnWindowFocus: true,       // Atualiza quando volta ao app
    refetchOnMount: true,             // Busca dados frescos ao montar
    
    // Polling inteligente baseado na hora
    refetchInterval: () => {
      const hour = new Date().getHours()
      // Horário comercial (9h-18h): mais movimento
      if (hour >= 9 && hour <= 18) {
        return 3 * 60 * 1000  // 3 minutos
      }
      // Fora do horário: menos movimento
      return 10 * 60 * 1000   // 10 minutos
    },
    
    // Só polling quando app está ativo
    refetchIntervalInBackground: false,
  })

  const cars = data?.pages.flatMap(page => page.results) ?? []

  async function handleRefresh(): Promise<void> {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }

  function handleLoadMore(): void {
    if (hasNextPage) {
      fetchNextPage()
    }
  }

  function handleCarPress(carId: string): void {
    router.push(`/car/${carId}` as any)
  }

  // Favorites are now handled directly by the FavoriteButton component

  function navigateToSearch(): void {
    router.push('./search')
  }

  function navigateToCreateListing(): void {
    checkAuth(() => {
      router.push('./create-listing' as any)
    })
  }

  function handleCategorySelect(category: string): void {
    setSelectedCategory(category)
    
    // If "all" is selected, clear category filter, otherwise set the specific category
    if (category === 'all') {
      setFilter('category', undefined)
    } else {
      setFilter('category', category)
    }
  }

  return {
    cars,
    loading: isLoading,
    error: error?.message,
    refreshing,
    handleRefresh,
    handleLoadMore,
    handleCarPress,
    navigateToSearch,
    navigateToCreateListing,
    handleCategorySelect,
    selectedCategory,
    // Offline state
    isOnline,
    isConnected,
    hasOfflineQueue
  }
}