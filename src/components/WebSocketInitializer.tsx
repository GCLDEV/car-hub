import { useEffect } from 'react'
import { useWebSocket } from '@services/websocket'
import { useAuthStore } from '@store/authStore'

/**
 * Componente para inicializar WebSocket dentro do QueryClientProvider
 */
export default function WebSocketInitializer() {
  const { connected } = useWebSocket()

  // Log do status do WebSocket
  useEffect(() => {
    console.log('🔌 WebSocket status:', connected ? 'Conectado' : 'Desconectado')
  }, [connected])

  // Componente não renderiza nada - apenas inicializa WebSocket
  return null
}