import { useState, useEffect } from 'react'
import { useRouter } from 'expo-router'
import { useInfiniteQuery } from '@tanstack/react-query'
import Toast from 'react-native-toast-message'

import { searchCars } from '@services/api/cars'
import { useFavoritesStore } from '@store/favoritesStore'
import { useFiltersStore } from '@store/filtersStore'
import { useModalStore } from '@store/modalStore'
import { useDebounce } from '@hooks/useDebounce'

export default function useSearchController() {
  const router = useRouter()
  // Favorites are now handled directly by the FavoriteButton component
  const { filters } = useFiltersStore()
  const { setModal } = useModalStore()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [hasSearched, setHasSearched] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  
  // Sugestões populares de busca
  const popularSearches = [
    'Toyota Corolla', 'Honda Civic', 'Volkswagen Jetta', 
    'BMW X1', 'Mercedes C180', 'Audi A3',
    'Ford EcoSport', 'Hyundai HB20', 'Chevrolet Onix'
  ]
  
  const debouncedSearchQuery = useDebounce(searchQuery, 500) // Aumentar debounce para evitar muitas requisições

  const {
    data,
    isLoading: loading,
    error,
    fetchNextPage,
    hasNextPage,
    refetch,
    isFetchingNextPage,
    isRefetching
  } = useInfiniteQuery({
    queryKey: ['search-cars', debouncedSearchQuery, filters],
    queryFn: async ({ pageParam = 1 }) => {
      if (!debouncedSearchQuery.trim()) {
        return { results: [], hasMore: false }
      }
      
      const result = await searchCars(debouncedSearchQuery, {
        ...filters,
        page: pageParam as number
      })
      return result
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: any, pages) => {
      return lastPage.hasMore ? pages.length + 1 : undefined
    },
    enabled: !!debouncedSearchQuery.trim(), // Busca automaticamente quando tem texto
    
    // ✨ Configurações otimizadas para busca em tempo real
    staleTime: 1 * 60 * 1000,             // 1 minuto - dados de busca ficam obsoletos mais rápido
    gcTime: 5 * 60 * 1000,                // 5 minutos em memória
    refetchOnWindowFocus: true,           // Atualiza quando volta ao app
    refetchOnReconnect: true,             // Atualiza quando reconecta
    
    // 🚀 Polling apenas se tem resultados e está em horário ativo
    refetchInterval: (query) => {
      const hour = new Date().getHours()
      const isBusinessHours = hour >= 8 && hour <= 20
      const hasResults = query.state.data?.pages.some((page: any) => page.results.length > 0)
      
      // Só faz polling se tem resultados e está em horário comercial
      if (hasResults && isBusinessHours) {
        return 3 * 60 * 1000  // 3 minutos
      }
      return false  // Não faz polling fora do horário ou sem resultados
    },
    
    refetchIntervalInBackground: false,
    
    // Retry inteligente
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404) return false
      return failureCount < 2  // Menos retries para busca
    },
    
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 15000),
  })

  // Controlar estado hasSearched
  useEffect(() => {
    if (!debouncedSearchQuery.trim()) {
      // Quando apaga o texto, limpa os resultados e volta ao estado inicial
      setHasSearched(false)
    }
  }, [debouncedSearchQuery])

  // Marcar hasSearched apenas quando a busca é executada com sucesso
  useEffect(() => {
    if (data && debouncedSearchQuery.trim()) {
      setHasSearched(true)
    }
  }, [data, debouncedSearchQuery])

  const searchResults = data?.pages.flatMap((page: any) => page.results) ?? []

  async function handleRefresh() {
    if (!debouncedSearchQuery.trim()) return
    
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }

  function handleLoadMore() {
    if (hasNextPage) {
      fetchNextPage()
    }
  }

  function handleCarPress(carId: string) {
    router.push(`/car/${carId}` as any)
  }

  // Favorites are now handled directly by the FavoriteButton component

  function showSearchModal(modalData: {
    query: string
    resultsCount: number
    hasError?: boolean
    isEmpty?: boolean
  }) {
    setModal({
      type: 'search',
      searchData: {
        query: modalData.query,
        resultsCount: modalData.resultsCount,
        suggestions: popularSearches,
        hasError: modalData.hasError || false,
        isEmpty: modalData.isEmpty || false
      },
      onSuggestionSelect: (suggestion: string) => {
        setSearchQuery(suggestion)
        setHasSearched(true)
      }
    })
  }

  async function applyFilters() {
    if (!searchQuery.trim()) {
      showSearchModal({
        query: '',
        resultsCount: 0,
        hasError: false,
        isEmpty: true
      })
      return
    }
    
    setHasSearched(true)
    try {
      await refetch()
      
      // Após a busca, verificar os resultados e mostrar modal se necessário
      const currentResults = searchResults
      if (currentResults.length === 0) {
        showSearchModal({
          query: searchQuery,
          resultsCount: 0,
          hasError: false,
          isEmpty: true
        })
      } else {
        // Mostrar toast de sucesso em vez do modal quando há resultados
        Toast.show({
          type: 'success',
          text1: `${currentResults.length} cars found`,
          text2: `Showing results for "${searchQuery}"`
        })
      }
    } catch (error) {
      showSearchModal({
        query: searchQuery,
        resultsCount: 0,
        hasError: true,
        isEmpty: false
      })
    }
  }

  function clearSearch() {
    setSearchQuery('')
    setHasSearched(false)
  }

  function handleSearchChange(newQuery: string) {
    setSearchQuery(newQuery)
    // Se está apagando tudo, limpa imediatamente
    if (!newQuery.trim()) {
      setHasSearched(false)
    }
  }

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    loading,
    error: error?.message,
    refreshing,
    hasSearched,
    handleRefresh,
    handleLoadMore,
    handleCarPress,
    applyFilters,
    clearSearch,
    showSearchModal,
    popularSearches
  }
}