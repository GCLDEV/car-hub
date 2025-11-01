import { useState, useCallback, useMemo } from 'react'
import { useRouter } from 'expo-router'
import { useInfiniteQuery } from '@tanstack/react-query'
import Toast from 'react-native-toast-message'

import { getCarsList, testAPI } from '@services/api'
import { useFavoritesStore } from '@store/favoritesStore'
import { useFiltersStore } from '@store/filtersStore'
import { useModalStore } from '@store/modalStore'
import { useOfflineCacheStore } from '@store/offlineCacheStore'
import { useAuthStore } from '@store/authStore'
import { useOptimizedCarQuery } from '@hooks/useOptimizedCarQuery'
import useNetworkController from './useNetworkController'
import useAuthGuard from '@hooks/useAuthGuard'
import { useCarCacheManager } from '@hooks/useCarCacheManager'
import { Car } from '@/types/car'

export default function useHomeController() {
  const router = useRouter()
  const { user } = useAuthStore()
  // Favorites are now handled directly by the FavoriteButton component
  const { filters, setFilter, clearFilters, activeFiltersCount } = useFiltersStore()
  const { setModal } = useModalStore()
  const { addToOfflineQueue } = useOfflineCacheStore()
  const { isOnline, isConnected, hasOfflineQueue } = useNetworkController()
  const { checkAuth } = useAuthGuard()
  const { invalidateCarListings, prefetchPopularCars } = useCarCacheManager()

  const [refreshing, setRefreshing] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    refetch,
    isFetchingNextPage,
    isRefetching
  } = useInfiniteQuery({
    queryKey: ['cars', filters],
    queryFn: async ({ pageParam = 1 }) => {
      return await getCarsList({ ...filters, page: pageParam })
    },
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.hasNext ? lastPage.pagination.page + 1 : undefined
    },
    initialPageParam: 1,
    
    // ✨ Configurações otimizadas para tempo real
    staleTime: 30 * 1000,             // 30 segundos - mais agressivo para dados frescos
    gcTime: 15 * 60 * 1000,           // 15 minutos em memória
    refetchOnWindowFocus: true,       // Atualiza quando volta ao app
    refetchOnMount: true,             // Busca dados frescos ao montar
    refetchOnReconnect: true,         // Atualiza quando reconecta à internet
    
    // 🔥 Polling super inteligente baseado na atividade
    refetchInterval: (query) => {
      const hour = new Date().getHours()
      const isBusinessHours = hour >= 8 && hour <= 20
      
      // Se tem dados recentemente carregados, polling mais frequente
      const recentlyLoaded = query.state.data && Date.now() - (query.state.dataUpdatedAt || 0) < 60000
      
      if (isBusinessHours) {
        return recentlyLoaded ? 45 * 1000 : 2 * 60 * 1000  // 45s ou 2min
      } else {
        return recentlyLoaded ? 2 * 60 * 1000 : 8 * 60 * 1000  // 2min ou 8min
      }
    },
    
    // Só polling quando app está ativo
    refetchIntervalInBackground: false,
    
    // 🚀 Retry inteligente
    retry: (failureCount, error: any) => {
      // Não retry em erro 404 ou 401
      if (error?.response?.status === 404 || error?.response?.status === 401) {
        return false
      }
      // Retry até 3 vezes para outros erros
      return failureCount < 3
    },
    
    // Delay progressivo entre retries
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })

  // Filtrar carros para excluir os do próprio usuário
  const cars = useMemo(() => {
    const allCars = data?.pages.flatMap((page: any) => page.results) ?? []
    
    // Se não está logado, mostra todos os carros
    if (!user?.id) {
      return allCars
    }
    
    // Filtrar carros que NÃO são do usuário atual (comparação robusta)
    const filteredCars = allCars.filter(car => {
      if (!car?.seller?.id) {
        return true // Mantém carros sem seller definido
      }
      
      // Comparar convertendo ambos para string para garantir
      const isOwn = String(car.seller.id) === String(user.id)
      
      return !isOwn
    })
    
    return filteredCars
  }, [data, user?.id])

  async function handleRefresh(): Promise<void> {
    setRefreshing(true)
    
    try {
      // Invalidar dados relacionados para garantir atualização completa
      await invalidateCarListings()
      await refetch()
      
      // Prefetch dados populares para melhorar navegação
      prefetchPopularCars()
      
    } catch (error) {
      // Silently handle errors
    } finally {
      setRefreshing(false)
    }
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

  function openFiltersModal(): void {
    setModal({
      type: 'filters',
      title: 'Filter Cars',
      filtersData: filters,
      onApplyFilters: (appliedFilters) => {
        // Aplicar os filtros recebidos do modal
        const filtersToApply = {
          brand: appliedFilters.brand,
          yearFrom: appliedFilters.yearMin,
          yearTo: appliedFilters.yearMax,
          priceFrom: appliedFilters.priceMin,
          priceTo: appliedFilters.priceMax,
          fuelType: appliedFilters.fuelType,
          transmission: appliedFilters.transmission,
          kmTo: appliedFilters.maxKm
        }
        
        // Aplicar cada filtro no store
        Object.entries(filtersToApply).forEach(([key, value]) => {
          if (value !== undefined && value !== '') {
            setFilter(key as keyof typeof filtersToApply, value)
          }
        })
        
        // Mostrar feedback do número de filtros ativos
        const activeFiltersCount = Object.values(filtersToApply).filter(v => v !== undefined && v !== '').length
        
        Toast.show({
          type: 'success',
          text1: 'Filters applied',
          text2: activeFiltersCount > 0 ? `${activeFiltersCount} filters active` : 'All filters cleared'
        })
      }
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

  function handleClearFilters(): void {
    if (activeFiltersCount === 0) {
      Toast.show({
        type: 'info',
        text1: 'No active filters',
        text2: 'There are no filters to clear'
      })
      return
    }

    setModal({
      type: 'confirm',
      title: 'Clear all filters?',
      confirmText: 'Clear Filters',
      cancelText: 'Cancel',
      action: () => {
        clearFilters()
        setSelectedCategory('all')
        
        Toast.show({
          type: 'success',
          text1: 'Filters cleared',
          text2: 'All filters have been removed'
        })
      }
    })
  }

  // Estatísticas úteis
  const totalCarsFromAPI = data?.pages.flatMap((page: any) => page.results).length ?? 0
  const filteredOutCount = totalCarsFromAPI - cars.length

  return {
    cars,
    loading: isLoading,
    error: error?.message,
    refreshing,
    handleRefresh,
    handleLoadMore,
    handleCarPress,
    navigateToSearch,
    openFiltersModal,
    handleClearFilters,
    handleCategorySelect,
    selectedCategory,
    activeFiltersCount,
    
    // ✨ Estados avançados para UI em tempo real
    isFetchingNextPage,         // Carregando mais carros
    isRefetching,               // Atualizando dados em background
    hasNextPage,                // Tem mais páginas para carregar
    
    // Estatísticas
    totalCarsFromAPI,
    filteredOutCount,
    
    // Offline state
    isOnline,
    isConnected,
    hasOfflineQueue,
    
    // 🚀 Cache management
    invalidateCarListings,
  }
}