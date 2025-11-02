import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import Toast from 'react-native-toast-message'
import { useQueryInvalidation, type QueryInvalidationContext } from './useQueryInvalidation'

interface RefreshOptions {
  queryKeys?: string[][]
  context?: QueryInvalidationContext
  contextPayload?: any
  onRefresh?: () => Promise<void>
  showSuccessToast?: boolean
  successMessage?: string
  showErrorToast?: boolean
}

export function usePullToRefresh(options: RefreshOptions = {}) {
  const {
    queryKeys = [],
    context,
    contextPayload,
    onRefresh,
    showSuccessToast = true,
    successMessage = 'Data refreshed',
    showErrorToast = true
  } = options

  const [refreshing, setRefreshing] = useState(false)
  const queryClient = useQueryClient()
  const { invalidateByContext, invalidateCustom } = useQueryInvalidation()

  async function handleRefresh(): Promise<void> {
    setRefreshing(true)
    
    try {
      // Executar callback customizado se fornecido
      if (onRefresh) {
        await onRefresh()
      }
      
      // Usar contexto global se fornecido (PREFERÍVEL)
      if (context) {
        await invalidateByContext(context, contextPayload)
      }
      
      // Fallback para queries específicas (LEGACY)
      else if (queryKeys.length > 0) {
        await invalidateCustom(queryKeys, { refetchType: 'all' })
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
  // ✅ Usando contextos globais (RECOMENDADO)
  home: () => usePullToRefresh({
    context: 'manual-refresh',
    successMessage: 'Cars updated'
  }),

  myListings: (userId?: string) => usePullToRefresh({
    context: 'manual-refresh',
    contextPayload: { userId },
    successMessage: 'Your listings updated'
  }),

  favorites: () => usePullToRefresh({
    context: 'manual-refresh',
    successMessage: 'Favorites updated'
  }),

  profile: (userId?: string) => usePullToRefresh({
    context: 'manual-refresh',
    contextPayload: { userId },
    successMessage: 'Profile updated'
  }),

  // ❌ Legacy - usando query keys específicas (EVITAR)
  carDetails: (carId?: string) => usePullToRefresh({
    queryKeys: carId ? [['car', carId]] : [],
    successMessage: 'Car details updated'
  }),

  search: (searchQuery?: string, filters?: any) => usePullToRefresh({
    queryKeys: searchQuery ? [['search-cars', searchQuery, filters]] : [],
    successMessage: 'Search results updated'
  })
}