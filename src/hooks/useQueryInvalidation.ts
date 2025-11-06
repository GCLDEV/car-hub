import { useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { useAuthStore } from '@store/authStore'

// Tipos para definir diferentes contextos de invalidação
export type QueryInvalidationContext = 
  | 'car-updated'           // Quando um carro é editado
  | 'car-created'          // Quando um carro é criado
  | 'car-deleted'          // Quando um carro é deletado
  | 'car-status-changed'   // Quando status do carro muda (sold, available, etc)
  | 'favorite-added'       // Quando adiciona favorito
  | 'favorite-removed'     // Quando remove favorito
  | 'profile-updated'      // Quando perfil do usuário é atualizado
  | 'auth-changed'         // Quando estado de auth muda (login/logout)
  | 'manual-refresh'       // Refresh manual pelo usuário

// Configurações específicas para cada contexto
type InvalidationConfig = {
  refetchType?: 'active' | 'all' | 'inactive'
  exact?: boolean
  onError?: (error: any) => void
}

/**
 * Hook centralizado para gerenciar invalidações de queries de forma inteligente
 * Padroniza todas as invalidações do app seguindo melhores práticas do TanStack Query v5
 */
export function useQueryInvalidation() {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()

  // Configuração padrão otimizada
  const defaultConfig: InvalidationConfig = {
    refetchType: 'active',
    exact: false,
    onError: (error) => console.warn('⚠️ Erro ao invalidar queries:', error)
  }

  // Função principal de invalidação
  const invalidateQueries = useCallback(async (
    queryKeys: string[][],
    config: InvalidationConfig = {}
  ) => {
    const finalConfig = { ...defaultConfig, ...config }
    
    try {
      const promises = queryKeys.map((queryKey: string[]) =>
        queryClient.invalidateQueries({
          queryKey,
          refetchType: finalConfig.refetchType,
          exact: finalConfig.exact
        })
      )
      
      await Promise.all(promises)
    } catch (error) {
      finalConfig.onError?.(error)
    }
  }, [queryClient, defaultConfig])

  // Contextos específicos de invalidação
  const invalidateByContext = useCallback(async (
    context: QueryInvalidationContext,
    payload?: { 
      carId?: string
      userId?: string
      customQueries?: string[][]
    }
  ) => {
    const { carId, userId = user?.id, customQueries = [] } = payload || {}

    switch (context) {
      case 'car-updated':
        await invalidateQueries([
          ['cars'],                           // Home, Search
          ['car', carId!],                   // Detalhes específicos
          ['user-cars', userId!],            // My Listings
          ['favorites'],                     // Favoritos (caso esteja favoritado)
          ...customQueries
        ], { exact: false })
        break

      case 'car-created':
        await invalidateQueries([
          ['cars'],                          // Home
          ['user-cars', userId!],           // My Listings
          ...customQueries
        ], { refetchType: 'active' })
        break

      case 'car-deleted':
        await invalidateQueries([
          ['cars'],                          // Home, Search
          ['car', carId!],                  // Detalhes específicos
          ['user-cars', userId!],           // My Listings
          ['favorites'],                    // Favoritos
          ...customQueries
        ])
        break

      case 'car-status-changed':
        await invalidateQueries([
          ['cars'],                          // Home, Search
          ['car', carId!],                  // Detalhes específicos
          ['user-cars', userId!],           // My Listings
          ...customQueries
        ])
        break

      case 'favorite-added':
      case 'favorite-removed':
        await invalidateQueries([
          ['favorites'],                     // Favoritos
          ['cars'],                         // Home (para atualizar ícones de favorito)
          ...customQueries
        ], { refetchType: 'active' })
        break

      case 'profile-updated':
        await invalidateQueries([
          ['user-profile'],                  // Perfil do usuário
          ['user-cars', userId!],           // My Listings
          ['favorites'],                    // Favoritos
          ...customQueries
        ], { exact: true })
        break

      case 'auth-changed':
        // Limpar todos os caches relacionados ao usuário
        await Promise.all([
          queryClient.removeQueries({ queryKey: ['user-cars'] }),
          queryClient.removeQueries({ queryKey: ['favorites'] }),
          queryClient.removeQueries({ queryKey: ['user-profile'] }),
          queryClient.invalidateQueries({ queryKey: ['cars'], refetchType: 'active' })
        ]).catch((error) => {
          console.warn('⚠️ Erro ao limpar cache na mudança de auth:', error)
        })
        break

      case 'manual-refresh':
        await invalidateQueries([
          ['cars'],
          ['user-cars', userId!],
          ['favorites'],
          ['user-profile'],
          ...customQueries
        ], { refetchType: 'all' }) // Refetch tudo no refresh manual
        break

      default:
        console.warn(`⚠️ Contexto de invalidação desconhecido: ${context}`)
    }
  }, [invalidateQueries, queryClient, user?.id])

  // Funções de conveniência para cenários comuns
  const invalidateCarData = useCallback(async (carId: string) => {
    await invalidateByContext('car-updated', { carId })
  }, [invalidateByContext])

  const invalidateUserData = useCallback(async () => {
    await invalidateByContext('profile-updated')
  }, [invalidateByContext])

  const invalidateFavorites = useCallback(async () => {
    await invalidateByContext('favorite-added')
  }, [invalidateByContext])

  const clearUserCache = useCallback(async () => {
    await invalidateByContext('auth-changed')
  }, [invalidateByContext])

  const refreshAll = useCallback(async () => {
    await invalidateByContext('manual-refresh')
  }, [invalidateByContext])

  // Função para invalidação customizada
  const invalidateCustom = useCallback(async (
    queryKeys: string[][],
    config?: InvalidationConfig
  ) => {
    await invalidateQueries(queryKeys, config)
  }, [invalidateQueries])

  return {
    // Função principal
    invalidateByContext,
    
    // Funções de conveniência
    invalidateCarData,
    invalidateUserData,
    invalidateFavorites,
    clearUserCache,
    refreshAll,
    
    // Para casos customizados
    invalidateCustom,
    
    // Acesso direto ao queryClient para casos específicos
    queryClient
  }
}

// Hook especializado para mutations (simplifica o uso em mutations)
export function useMutationInvalidation() {
  const { invalidateByContext } = useQueryInvalidation()

  return {
    // Para usar em mutations onSuccess
    onCarUpdated: (carId: string) => () => invalidateByContext('car-updated', { carId }),
    onCarCreated: () => () => invalidateByContext('car-created'),
    onCarDeleted: (carId: string) => () => invalidateByContext('car-deleted', { carId }),
    onCarStatusChanged: (carId: string) => () => invalidateByContext('car-status-changed', { carId }),
    onFavoriteAdded: () => () => invalidateByContext('favorite-added'),
    onFavoriteRemoved: () => () => invalidateByContext('favorite-removed'),
    onProfileUpdated: () => () => invalidateByContext('profile-updated'),
    
    // Função genérica
    onSuccess: (context: QueryInvalidationContext, payload?: any) => () => 
      invalidateByContext(context, payload)
  }
}

// Re-exportar tipos para uso em outros arquivos
export type { InvalidationConfig }