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
        queryClient.invalidateQueries({ queryKey: ['cars'] })
      }
    }

    const subscription = AppState.addEventListener('change', handleAppStateChange)
    return () => subscription?.remove()
  }, [queryClient])

  return query
}

/**
 * Hook para invalidar cache de carros (usar após criar/editar/deletar)
 */
export function useInvalidateCars() {
  const queryClient = useQueryClient()

  return {
    // Invalidar todas as listas de carros
    invalidateAllCars: () => {
      queryClient.invalidateQueries({ queryKey: ['cars'] })
    },
    
    // Invalidar carros específicos do usuário
    invalidateUserCars: () => {
      queryClient.invalidateQueries({ queryKey: ['user-cars'] })
    },
    
    // Atualizar carro específico no cache
    updateCarInCache: (updatedCar: any) => {
      // Validar se updatedCar não é undefined/null
      if (!updatedCar || !updatedCar.id) {
        console.warn('updateCarInCache: updatedCar is invalid')
        return
      }

      try {
        queryClient.setQueriesData(
          { queryKey: ['cars'] },
          (oldData: any) => {
            // Para useQuery normal
            if (oldData && oldData.results && Array.isArray(oldData.results)) {
              return {
                ...oldData,
                results: oldData.results.map((car: any) => 
                  car.id === updatedCar.id ? { ...car, ...updatedCar } : car
                )
              }
            }
            
            // Para useInfiniteQuery - estrutura com pages
            if (oldData && oldData.pages && Array.isArray(oldData.pages)) {
              const newPages = oldData.pages.map((page: any) => {
                if (page && page.results && Array.isArray(page.results)) {
                  return {
                    ...page,
                    results: page.results.map((car: any) => 
                      car.id === updatedCar.id ? { ...car, ...updatedCar } : car
                    )
                  }
                }
                return page
              })
              
              return {
                ...oldData,
                pages: newPages
              }
            }

            // Se não há dados compatíveis, retorna como está
            return oldData
          }
        )
      } catch (error) {
        console.error('Error in updateCarInCache:', error)
      }
    },
    
    // Adicionar novo carro ao início da lista
    addCarToCache: (newCar: any) => {
      // Validar se newCar não é undefined/null
      if (!newCar) {
        console.warn('addCarToCache: newCar is undefined/null')
        return
      }

      try {
        // Atualizar cache para queries normais
        queryClient.setQueriesData(
          { queryKey: ['cars'] },
          (oldData: any) => {
            // Para useQuery normal
            if (oldData && oldData.results && Array.isArray(oldData.results)) {
              return {
                ...oldData,
                results: [newCar, ...oldData.results],
                pagination: {
                  ...oldData.pagination,
                  total: (oldData.pagination?.total || 0) + 1
                }
              }
            }
            
            // Para useInfiniteQuery - estrutura com pages
            if (oldData && oldData.pages && Array.isArray(oldData.pages)) {
              const newPages = [...oldData.pages]
              if (newPages[0] && newPages[0].results) {
                newPages[0] = {
                  ...newPages[0],
                  results: [newCar, ...newPages[0].results]
                }
              }
              
              return {
                ...oldData,
                pages: newPages
              }
            }

            // Se não há dados antigos, retorna uma estrutura básica
            return {
              results: [newCar],
              pagination: {
                page: 1,
                pageSize: 10,
                pageCount: 1,
                total: 1
              }
            }
          }
        )
      } catch (error) {
        console.error('Error in addCarToCache:', error)
      }
    }
  }
}

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