import React from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuthStore } from '@store/authStore'
import { useQueryInvalidation } from '@hooks/useQueryInvalidation'

// Configuração dinâmica do servidor WebSocket
function getSocketURL() {
  // 1. Prioridade: variável específica para WebSocket
  if (process.env.EXPO_PUBLIC_WEBSOCKET_URL) {
    return process.env.EXPO_PUBLIC_WEBSOCKET_URL
  }
  
  // 2. Usar mesma base da API (remove /api)
  const apiUrl = process.env.EXPO_PUBLIC_API_ADDRESS || 'http://localhost:1337/api'
  return apiUrl.replace('/api', '')
}

const SOCKET_URL = getSocketURL()

// Classe para gerenciar conexão WebSocket
class WebSocketService {
  private socket: Socket | null = null
  private isConnected = false
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private invalidateQueries: any = null
  private authToken: string | null = null // Para HTTP fallback

  // Inicializar conexão
  connect(token: string, customUrl?: string) {

    // Salvar token para HTTP fallback
    this.authToken = token

    // Usar URL customizada se fornecida, senão usar a configurada
    const socketUrl = customUrl || getSocketURL()
    
    // Detectar se é ngrok e ajustar transports
    const isNgrok = socketUrl.includes('ngrok')
    const transports = isNgrok ? ['polling', 'websocket'] : ['websocket', 'polling']

    this.socket = io(socketUrl, {
      auth: { token },
      transports, // Usar polling primeiro para ngrok
      timeout: 20000, // Aumentado para ngrok
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 2000, // Aumentado para ngrok
      reconnectionDelayMax: 10000, // Aumentado para ngrok
      forceNew: true, // Força nova conexão se URL mudou
    })

    this.setupEventListeners()
  }

  // Desconectar
  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      this.isConnected = false
    }
  }

  // Reconectar com nova URL (útil quando ngrok muda)
  reconnectWithNewUrl(token: string, newUrl: string) {
    this.disconnect()
    this.connect(token, newUrl)
  }

  // Configurar listeners de eventos
  private setupEventListeners() {
    if (!this.socket) return

    // Conexão estabelecida
    this.socket.on('connect', () => {
      this.isConnected = true
      this.reconnectAttempts = 0
    })

    // Erro de conexão
    this.socket.on('connect_error', (error) => {
      console.error('❌ [DEBUG] Erro de conexão WebSocket:', {
        error: error.message,
        type: (error as any).type,
        description: (error as any).description,
        attempts: this.reconnectAttempts
      })
      this.isConnected = false
      this.reconnectAttempts++
    })

    // Desconectado
    this.socket.on('disconnect', (reason) => {
      this.isConnected = false
    })

    // 💬 NOVA MENSAGEM EM TEMPO REAL
    this.socket.on('new_message', (messageData) => {
    
      this.emit('newMessage', messageData) // Emite como newMessage para manter compatibilidade
    })

    // 👀 USUÁRIO DIGITANDO
    this.socket.on('userTyping', (typingData) => {
      this.emit('userTyping', typingData)
    })

    this.socket.on('userStoppedTyping', (typingData) => {
      this.emit('userStoppedTyping', typingData)
    })

    // ✅ MENSAGENS LIDAS
    this.socket.on('messagesRead', (readData) => {
      this.emit('messagesRead', readData)
    })

    // 🔔 NOTIFICAÇÃO DE NOVA MENSAGEM
    this.socket.on('new_message_notification', (notification) => {
      this.emit('messageNotification', notification)
    })

    // 📝 CONVERSA ATUALIZADA
    this.socket.on('conversation_updated', (updateData) => {
      if (this.invalidateQueries) {
        this.invalidateQueries('conversation-updated', { 
          conversationId: updateData.conversationId 
        })
      }
    })

    // 🔔 NOTIFICAÇÃO GERAL
    this.socket.on('notification', (notification) => {
      this.emit('notification', notification)
    })

    // 🟢 USUÁRIO ONLINE/OFFLINE
    this.socket.on('userOnline', (data) => {
      this.emit('userOnline', data)
    })

    this.socket.on('userOffline', (data) => {
      this.emit('userOffline', data)
    })

    this.socket.on('userOnlineStatus', (data) => {
      this.emit('userOnlineStatus', data)
    })

    this.socket.on('userWentOffline', (data) => {
      this.emit('userWentOffline', data)
    })

    // 👁️ VISUALIZAÇÃO DE CONVERSA
    this.socket.on('userEnteredConversation', (data) => {
      this.emit('userEnteredConversation', data)
    })
  }

  // Entrar em uma conversa específica
  joinConversation(conversationId: string) {
    
    if (this.socket?.connected) {
      this.socket.emit('join_conversation', conversationId) // Corrigido para join_conversation
      
      // Fallback HTTP se ngrok
      this.tryHttpFallback('join-conversation', { conversationId })
    } else {
      console.warn('⚠️ [DEBUG] Socket não conectado para entrar na conversa')
    }
  }

  // Sair de uma conversa
  leaveConversation(conversationId: string) {    
    if (this.socket?.connected) {
      this.socket.emit('leave_conversation', conversationId) // Corrigido para leave_conversation
    }
  }

  // Indicar que está digitando
  startTyping(conversationId: string) {
    if (this.socket?.connected) {
      this.socket.emit('startTyping', conversationId)
    }
  }

  // Parar de indicar que está digitando
  stopTyping(conversationId: string) {
    if (this.socket?.connected) {
      this.socket.emit('stopTyping', conversationId)
    }
  }

  // Marcar mensagens como lidas
  markMessagesAsRead(conversationId: string, messageIds?: string[]) {
    if (this.socket?.connected) {
      this.socket.emit('markMessagesAsRead', { conversationId, messageIds })
    }
  }

  // Verificar se usuário está online
  checkUserOnlineStatus(userId: string, conversationId: string) {
    if (this.socket?.connected) {
      this.socket.emit('checkUserOnlineStatus', { userId, conversationId })
    }
  }

  // Notificar que entrou na conversa
  enterConversation(conversationId: string) {
    if (this.socket?.connected) {
      this.socket.emit('enterConversation', { conversationId })
    }
  }

  // Sistema de eventos customizado para componentes React
  private eventListeners: { [key: string]: Function[] } = {}
  
  // HTTP Fallback para ngrok (quando WebSocket falha)
  private async tryHttpFallback(endpoint: string, data: any) {
    try {
      const apiUrl = process.env.EXPO_PUBLIC_API_ADDRESS || 'http://localhost:1337/api'
      const baseUrl = apiUrl.replace('/api', '')
      
      const response = await fetch(`${baseUrl}/api/websocket/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.authToken}`,
        },
        body: JSON.stringify(data)
      })
    } catch (error) {
      console.warn('⚠️ [DEBUG] Erro no HTTP fallback:', error)
    }
  }

  on(event: string, callback: Function) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = []
    }
    this.eventListeners[event].push(callback)
  }

  off(event: string, callback: Function) {
    if (this.eventListeners[event]) {
      this.eventListeners[event] = this.eventListeners[event].filter(cb => cb !== callback)
    }
  }

  private emit(event: string, data: any) {
    if (this.eventListeners[event]) {
      this.eventListeners[event].forEach(callback => callback(data))
    }
  }

  // Configurar invalidação de queries
  setQueryInvalidation(invalidateFunction: any) {
    this.invalidateQueries = invalidateFunction
  }

  // Getters
  get connected() {
    return this.isConnected && this.socket?.connected
  }

  get id() {
    return this.socket?.id
  }
}

// Instância singleton
export const websocketService = new WebSocketService()

// Hook para usar WebSocket em componentes React
export function useWebSocket(customUrl?: string) {
  const { token, isAuthenticated } = useAuthStore()
  const { invalidateByContext } = useQueryInvalidation()

  // Configurar invalidação de queries
  React.useEffect(() => {
    websocketService.setQueryInvalidation(invalidateByContext)
  }, [invalidateByContext])

  // Conectar/desconectar baseado na autenticação
  React.useEffect(() => {
    if (isAuthenticated && token) {
      websocketService.connect(token, customUrl)
    } else {
      websocketService.disconnect()
    }

    return () => {
      // Cleanup na desmontagem do componente
      websocketService.disconnect()
    }
  }, [isAuthenticated, token, customUrl])

  return {
    connected: websocketService.connected,
    socket: websocketService,
    joinConversation: websocketService.joinConversation.bind(websocketService),
    leaveConversation: websocketService.leaveConversation.bind(websocketService),
    startTyping: websocketService.startTyping.bind(websocketService),
    stopTyping: websocketService.stopTyping.bind(websocketService),
    markMessagesAsRead: websocketService.markMessagesAsRead.bind(websocketService),
    checkUserOnlineStatus: websocketService.checkUserOnlineStatus.bind(websocketService),
    enterConversation: websocketService.enterConversation.bind(websocketService),
    reconnectWithNewUrl: (newUrl: string) => {
      if (token) websocketService.reconnectWithNewUrl(token, newUrl)
    }
  }
}

// Hook para escutar eventos específicos
export function useWebSocketEvent(event: string, callback: Function) {
  React.useEffect(() => {
    websocketService.on(event, callback)
    
    return () => {
      websocketService.off(event, callback)
    }
  }, [event, callback])
}

export default websocketService