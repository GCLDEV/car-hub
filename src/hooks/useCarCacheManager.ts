import { useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'

/**
 * Hook para gerenciar cache de carros de forma inteligente
 * Invalida automaticamente dados relacionados quando há mudanças
 */
export function useCarCacheManager() {
  const queryClient = useQueryClient()

  // Invalidar todos os dados de carros
  const invalidateAllCars = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['cars'] }),
      queryClient.invalidateQueries({ queryKey: ['search-cars'] }),
      queryClient.invalidateQueries({ queryKey: ['favorites'] }),
    ])
  }, [queryClient])

  // Invalidar apenas dados de listagem (home/search)
  const invalidateCarListings = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['cars'] }),
      queryClient.invalidateQueries({ queryKey: ['search-cars'] }),
    ])
  }, [queryClient])

  // Invalidar dados específicos de um carro
  const invalidateCarDetails = useCallback(async (carId: string) => {
    await queryClient.invalidateQueries({ queryKey: ['car', carId] })
  }, [queryClient])

  // Atualizar cache com novo carro (quando criar um novo)
  const addCarToCache = useCallback((newCar: any) => {
    // Adicionar à lista principal (primeira página)
    queryClient.setQueryData(['cars'], (oldData: any) => {
      if (!oldData) return oldData
      
      const firstPage = oldData.pages[0]
      if (!firstPage) return oldData
      
      return {
        ...oldData,
        pages: [
          {
            ...firstPage,
            results: [newCar, ...firstPage.results]
          },
          ...oldData.pages.slice(1)
        ]
      }
    })
  }, [queryClient])

  // Remover carro do cache (quando deletar)
  const removeCarFromCache = useCallback((carId: string) => {
    // Remover de todas as queries de carros
    queryClient.setQueriesData(
      { queryKey: ['cars'] },
      (oldData: any) => {
        if (!oldData) return oldData
        
        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            results: page.results.filter((car: any) => car.id !== carId)
          }))
        }
      }
    )
    
    // Remover de buscas também
    queryClient.setQueriesData(
      { queryKey: ['search-cars'] },
      (oldData: any) => {
        if (!oldData) return oldData
        
        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            results: page.results.filter((car: any) => car.id !== carId)
          }))
        }
      }
    )
  }, [queryClient])

  // Atualizar carro específico no cache
  const updateCarInCache = useCallback((carId: string, updatedCar: any) => {
    // Atualizar em todas as queries de listagem
    queryClient.setQueriesData(
      { queryKey: ['cars'] },
      (oldData: any) => {
        if (!oldData) return oldData
        
        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            results: page.results.map((car: any) => 
              car.id === carId ? { ...car, ...updatedCar } : car
            )
          }))
        }
      }
    )
    
    // Atualizar detalhes específicos do carro
    queryClient.setQueryData(['car', carId], updatedCar)
  }, [queryClient])

  // Prefetch inteligente para performance
  const prefetchPopularCars = useCallback(async () => {
    // Prefetch carros populares (primeira página sem filtros)
    await queryClient.prefetchInfiniteQuery({
      queryKey: ['cars', {}],
      queryFn: async () => {
        const { getCarsList } = await import('@services/api')
        return await getCarsList({ page: 1 })
      },
      initialPageParam: 1,
      staleTime: 5 * 60 * 1000, // 5 minutos
    })
  }, [queryClient])

  return {
    invalidateAllCars,
    invalidateCarListings,
    invalidateCarDetails,
    addCarToCache,
    removeCarFromCache,
    updateCarInCache,
    prefetchPopularCars,
  }
}