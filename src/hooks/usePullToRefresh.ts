import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import Toast from 'react-native-toast-message'

interface RefreshOptions {
  queryKeys?: string[][]
  onRefresh?: () => Promise<void>
  showSuccessToast?: boolean
  successMessage?: string
  showErrorToast?: boolean
}

export function usePullToRefresh(options: RefreshOptions = {}) {
  const {
    queryKeys = [],
    onRefresh,
    showSuccessToast = true,
    successMessage = 'Data refreshed',
    showErrorToast = true
  } = options

  const [refreshing, setRefreshing] = useState(false)
  const queryClient = useQueryClient()

  async function handleRefresh(): Promise<void> {
    setRefreshing(true)
    
    try {
      // Executar callback customizado se fornecido
      if (onRefresh) {
        await onRefresh()
      }
      
      // Invalidar queries especificadas
      if (queryKeys.length > 0) {
        await Promise.all(
          queryKeys.map(queryKey => 
            queryClient.invalidateQueries({ queryKey })
          )
        )
      }
      
      // Mostrar toast de sucesso
      if (showSuccessToast) {
        Toast.show({
          type: 'success',
          text1: successMessage,
          text2: 'Pull down to refresh anytime'
        })
      }
      
    } catch (error: any) {
      // Mostrar toast de erro
      if (showErrorToast) {
        Toast.show({
          type: 'error',
          text1: 'Failed to refresh',
          text2: error.message || 'Please try again'
        })
      }
      
    } finally {
      setRefreshing(false)
    }
  }

  return {
    refreshing,
    handleRefresh
  }
}

export const RefreshPresets = {
  home: () => usePullToRefresh({
    queryKeys: [['cars'], ['favorites']],
    successMessage: 'Cars updated'
  }),

  myListings: (userId?: string) => usePullToRefresh({
    queryKeys: userId ? [['user-cars', userId]] : [],
    successMessage: 'Your listings updated'
  }),

  search: (searchQuery?: string, filters?: any) => usePullToRefresh({
    queryKeys: searchQuery ? [['search-cars', searchQuery, filters]] : [],
    successMessage: 'Search results updated'
  }),

  favorites: () => usePullToRefresh({
    queryKeys: [['favorites']],
    successMessage: 'Favorites updated'
  }),

  profile: (userId?: string) => usePullToRefresh({
    queryKeys: userId ? [
      ['user-profile'],
      ['user-cars', userId],
      ['favorites']
    ] : [],
    successMessage: 'Profile updated'
  }),

  carDetails: (carId?: string) => usePullToRefresh({
    queryKeys: carId ? [['car', carId]] : [],
    successMessage: 'Car details updated'
  })
}