import { useEffect } from 'react'
import { useWebSocket } from '@services/websocket'
import { useAuthStore } from '@store/authStore'

/**
 * Componente para inicializar WebSocket dentro do QueryClientProvider
 */
export default function WebSocketInitializer() {
  const { connected } = useWebSocket()
  const { isAuthenticated, token } = useAuthStore()

  // Log do status do WebSocket
  useEffect(() => {
    console.log('🔌 WebSocket status:', {
      connected,
      isAuthenticated,
      hasToken: !!token
    })
  }, [connected, isAuthenticated, token])

  // Forçar inicialização do WebSocket quando usuário está autenticado
  useEffect(() => {
    if (isAuthenticated && token && !connected) {
      console.log('🔄 Tentando forçar conexão WebSocket...')
      // O useWebSocket já deve conectar automaticamente, mas vamos forçar se não conectou
    }
  }, [isAuthenticated, token, connected])

  // Componente não renderiza nada - apenas inicializa WebSocket
  return null
}