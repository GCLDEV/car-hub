import { useState, useEffect, useCallback } from 'react'
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native'

interface UseInfiniteScrollOptions {
  threshold?: number // Distância do final para disparar (padrão: 100px)
  onEndReached?: () => void
  hasNextPage?: boolean
  isFetching?: boolean
}

interface UseInfiniteScrollReturn {
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
  isNearEnd: boolean
}

/**
 * Hook para implementar scroll infinito em listas
 * 
 * @param options - Configurações do scroll infinito
 * @returns Funções e estados para controle do scroll
 */
export function useInfiniteScroll({
  threshold = 100,
  onEndReached,
  hasNextPage = true,
  isFetching = false,
}: UseInfiniteScrollOptions): UseInfiniteScrollReturn {
  const [isNearEnd, setIsNearEnd] = useState(false)

  const onScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent
    
    // Calcular se está próximo do final
    const paddingToBottom = threshold
    const isAtEnd = layoutMeasurement.height + contentOffset.y >= 
                    contentSize.height - paddingToBottom

    setIsNearEnd(isAtEnd)
    
    // Disparar callback se estiver no final e puder buscar mais
    if (isAtEnd && hasNextPage && !isFetching && onEndReached) {
      onEndReached()
    }
  }, [threshold, onEndReached, hasNextPage, isFetching])

  return {
    onScroll,
    isNearEnd,
  }
}

export default useInfiniteScroll