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

  // Filtrar carros para excluir os do próprio usuário
  const cars = useMemo(() => {
    const allCars = data?.pages.flatMap(page => page.results) ?? []
    
    // Se não está logado, mostra todos os carros
    if (!user?.id) {
      console.log('🔍 Usuário não logado, mostrando todos os carros:', allCars.length)
      return allCars
    }
    
    // Log resumido para debug
    console.log('🔍 Filtro de carros:', { 
      userId: user.id, 
      totalCars: allCars.length,
      firstCarSeller: allCars[0]?.seller?.id 
    })
    
    // Filtrar carros que NÃO são do usuário atual (comparação robusta)
    const filteredCars = allCars.filter(car => {
      if (!car?.seller?.id) {
        console.warn('⚠️ Carro sem seller.id:', car)
        return true // Mantém carros sem seller definido
      }
      
      // Comparar convertendo ambos para string para garantir
      const isOwn = String(car.seller.id) === String(user.id)
      
      // Log apenas se for próprio carro (para debug)
      if (isOwn) {
        console.log('🚫 Removendo carro próprio:', car.title)
      }
      
      return !isOwn
    })
    
    console.log('✅ Carros filtrados:', {
      total: allCars.length,
      filtrados: filteredCars.length,
      removidos: allCars.length - filteredCars.length
    })
    
    // Log adicional se nenhum carro for mostrado
    if (filteredCars.length === 0 && allCars.length > 0) {
      console.warn('⚠️ NENHUM CARRO SENDO EXIBIDO!')
      console.log('🔍 Verificar se todos os carros são do próprio usuário')
      allCars.forEach((car, index) => {
        console.log(`Carro ${index + 1}:`, {
          title: car.title,
          sellerId: car.seller?.id,
          sellerName: car.seller?.name,
          isOwn: String(car.seller?.id) === String(user.id)
        })
      })
    }
    
    return filteredCars
  }, [data, user?.id])

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
  const totalCarsFromAPI = data?.pages.flatMap(page => page.results).length ?? 0
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
    // Estatísticas
    totalCarsFromAPI,
    filteredOutCount,
    // Offline state
    isOnline,
    isConnected,
    hasOfflineQueue
  }
}