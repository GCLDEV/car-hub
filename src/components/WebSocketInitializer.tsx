import { useEffect, useRef } from 'react'
import { useWebSocket } from '@services/websocket'
import { useAuthStore } from '@store/authStore'

/**
 * Componente para inicializar WebSocket dentro do QueryClientProvider
 */
export default function WebSocketInitializer() {
  const { connected } = useWebSocket()
  const { isAuthenticated, token, user, _hasHydrated, logout } = useAuthStore()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Log do status do WebSocket para debug
  useEffect(() => {
    console.log('🔌 WebSocket Status:', {
      connected,
      isAuthenticated,
      hasToken: !!token,
      hasUser: !!user,
      userId: user?.id,
      hydrated: _hasHydrated
    })
    
    // Se conectou, limpar qualquer timeout pendente
    if (connected) {
      console.log('✅ WebSocket conectado - cancelando timeout de warning')
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      return
    }
    
    // Se não conectou após um tempo e está autenticado, pode ser token inválido
    if (isAuthenticated && token && _hasHydrated && !connected) {
      // Limpar timeout anterior se existir
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      
      timeoutRef.current = setTimeout(() => {
        // Verificar novamente se ainda não conectou
        if (!connected && isAuthenticated && token) {
          console.warn('⚠️ WebSocket não conectou - token pode estar inválido')
          console.warn('💡 Considere fazer logout e login novamente')
        }
        timeoutRef.current = null
      }, 5000) // Reduzido ainda mais para 5 segundos
    }
    
    // Cleanup na desmontagem
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [connected, isAuthenticated, token, user, _hasHydrated])

  // Componente não renderiza nada - apenas inicializa WebSocket
  return null
}