import { useState, useCallback } from 'react'
import { useRouter } from 'expo-router'
import { useInfiniteQuery } from '@tanstack/react-query'
import Toast from 'react-native-toast-message'

import { getCarsList, testAPI } from '@services/api'
import { useFavoritesStore } from '@store/favoritesStore'
import { useFiltersStore } from '@store/filtersStore'
import { Car } from '@/types/car'

export default function useHomeController() {
  const router = useRouter()
  const { favorites, addFavorite, removeFavorite } = useFavoritesStore()
  const { filters, setFilter } = useFiltersStore()

  const [refreshing, setRefreshing] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('sedan')

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

  function handleFavoritePress(carId: string): void {
    if (favorites.includes(carId)) {
      removeFavorite(carId)
      Toast.show({ 
        type: 'info', 
        text1: 'Removed from favorites' 
      })
    } else {
      addFavorite(carId)
      Toast.show({ 
        type: 'success', 
        text1: 'Added to favorites' 
      })
    }
  }

  function isFavorite(carId: string): boolean {
    return favorites.includes(carId)
  }

  function navigateToSearch(): void {
    router.push('./search')
  }

  function navigateToCreateListing(): void {
    router.push('../create-listing' as any)
  }

  function handleCategorySelect(category: string): void {
    setSelectedCategory(category)
    setFilter('category', category)
  }

  return {
    cars,
    loading: isLoading,
    error: error?.message,
    refreshing,
    handleRefresh,
    handleLoadMore,
    handleCarPress,
    handleFavoritePress,
    isFavorite,
    navigateToSearch,
    navigateToCreateListing,
    handleCategorySelect,
    selectedCategory
  }
}