import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { AppState } from 'react-native'
import { getCarsList } from '@/services/api/cars'
import { CarFilters } from '@/types/car'

/**
 * Hook otimizado para buscar carros com estratégia inteligente de cache e atualizações
 */
export function useOptimizedCarQuery(filters?: CarFilters) {
  const queryClient = useQueryClient()

  // Query principal com configurações otimizadas
  const query = useQuery({
    queryKey: ['cars', filters],
    queryFn: () => getCarsList(filters),
    
    // Cache inteligente
    staleTime: 2 * 60 * 1000,        // 2 minutos - dados considerados "frescos"
    gcTime: 10 * 60 * 1000,          // 10 minutos - mantém em memória
    
    // Refetch estratégico
    refetchOnWindowFocus: true,       // Atualiza quando volta ao app
    refetchOnMount: true,             // Sempre busca dados ao montar
    
    // Polling adaptativo baseado na hora do dia
    refetchInterval: () => {
      const hour = new Date().getHours()
      // Horário comercial (9h-18h): mais ativo, polling mais frequente
      if (hour >= 9 && hour <= 18) {
        return 2 * 60 * 1000  // 2 minutos
      }
      // Fora do horário: menos ativo, polling mais espaçado
      return 5 * 60 * 1000    // 5 minutos
    },
    
    // Só polling quando app está ativo
    refetchIntervalInBackground: false,
  })

  // Listener para mudanças de estado do app
  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'active') {
        // App voltou ao foreground - invalidar cache para buscar dados frescos
        queryClient.invalidateQueries({ 
          queryKey: ['cars'],
          refetchType: 'active'
        })
      }
    }

    const subscription = AppState.addEventListener('change', handleAppStateChange)
    return () => subscription?.remove()
  }, [queryClient])

  return query
}

// Hook useInvalidateCars removido - agora use useQueryInvalidation para gerenciamento de cache

/**
 * Configurações globais de React Query otimizadas para o app
 */
export const queryClientConfig = {
  defaultOptions: {
    queries: {
      // Configurações padrão para todas as queries
      staleTime: 60 * 1000,           // 1 minuto padrão
      gcTime: 5 * 60 * 1000,          // 5 minutos padrão
      retry: 2,                       // Tentar 2 vezes em caso de erro
      retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Network awareness
      networkMode: 'offlineFirst',    // Funciona offline com cache
      refetchOnReconnect: true,       // Atualiza quando reconecta
    },
    mutations: {
      // Configurações para mutations (create, update, delete)
      retry: 1,
      networkMode: 'offlineFirst',
    },
  },
}