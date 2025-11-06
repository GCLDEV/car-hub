import React from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuthStore } from '@store/authStore'
import { useQueryInvalidation } from '@hooks/useQueryInvalidation'

// Configuração do servidor WebSocket (usa mesma base da API)
const API_BASE_URL = process.env.EXPO_PUBLIC_API_ADDRESS || 'http://localhost:1337/api'
const SOCKET_URL = API_BASE_URL.replace('/api', '') // Remove /api para ficar só o servidor base

// Classe para gerenciar conexão WebSocket
class WebSocketService {
  private socket: Socket | null = null
  private isConnected = false
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private invalidateQueries: any = null

  // Inicializar conexão
  connect(token: string) {
    if (this.socket?.connected) {
      console.log('🔌 WebSocket já conectado')
      return
    }

    console.log('🔌 Conectando ao WebSocket...')

    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      timeout: 10000,
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    })

    this.setupEventListeners()
  }

  // Desconectar
  disconnect() {
    if (this.socket) {
      console.log('🔌 Desconectando WebSocket...')
      this.socket.disconnect()
      this.socket = null
      this.isConnected = false
    }
  }

  // Configurar listeners de eventos
  private setupEventListeners() {
    if (!this.socket) return

    // Conexão estabelecida
    this.socket.on('connect', () => {
      console.log('✅ WebSocket conectado:', this.socket?.id)
      this.isConnected = true
      this.reconnectAttempts = 0
    })

    // Erro de conexão
    this.socket.on('connect_error', (error) => {
      console.error('❌ Erro de conexão WebSocket:', error.message)
      this.isConnected = false
      this.reconnectAttempts++
    })

    // Desconectado
    this.socket.on('disconnect', (reason) => {
      console.log('🔌 WebSocket desconectado:', reason)
      this.isConnected = false
    })

    // 💬 NOVA MENSAGEM EM TEMPO REAL
    this.socket.on('newMessage', (messageData) => {
      console.log('📩 Nova mensagem recebida via WebSocket:', { 
        id: messageData.id, 
        content: messageData.content?.substring(0, 20) + '...',
        senderId: messageData.senderId 
      })
      
      // Emitir evento personalizado para componentes (sem invalidation redundante)
      this.emit('newMessage', messageData)
    })

    // 👀 USUÁRIO DIGITANDO
    this.socket.on('userTyping', (typingData) => {
      console.log('⌨️ Usuário digitando:', typingData)
      this.emit('userTyping', typingData)
    })

    this.socket.on('userStoppedTyping', (typingData) => {
      console.log('⌨️ Usuário parou de digitar:', typingData)
      this.emit('userStoppedTyping', typingData)
    })

    // ✅ MENSAGENS LIDAS
    this.socket.on('messagesRead', (readData) => {
      console.log('✅ Mensagens marcadas como lidas:', readData)
      this.emit('messagesRead', readData)
    })

    // 🔔 NOTIFICAÇÃO DE NOVA MENSAGEM
    this.socket.on('new_message_notification', (notification) => {
      console.log('🔔 Notificação de mensagem:', notification)
      this.emit('messageNotification', notification)
    })

    // 📝 CONVERSA ATUALIZADA
    this.socket.on('conversation_updated', (updateData) => {
      console.log('📝 Conversa atualizada:', updateData)
      
      if (this.invalidateQueries) {
        this.invalidateQueries('conversation-updated', { 
          conversationId: updateData.conversationId 
        })
      }
    })

    // 🔔 NOTIFICAÇÃO GERAL
    this.socket.on('notification', (notification) => {
      console.log('🔔 Notificação recebida:', notification)
      this.emit('notification', notification)
    })
  }

  // Entrar em uma conversa específica
  joinConversation(conversationId: string) {
    if (this.socket?.connected) {
      console.log(`📝 Entrando na conversa: ${conversationId}`)
      this.socket.emit('joinConversation', conversationId)
    } else {
      console.log('⚠️ Socket não conectado, não pode entrar na conversa')
    }
  }

  // Sair de uma conversa
  leaveConversation(conversationId: string) {
    if (this.socket?.connected) {
      console.log(`📝 Saindo da conversa: ${conversationId}`)
      this.socket.emit('leaveConversation', conversationId)
    }
  }

  // Indicar que está digitando
  startTyping(conversationId: string) {
    if (this.socket?.connected) {
      console.log(`⌨️ Iniciando digitação na conversa: ${conversationId}`)
      this.socket.emit('startTyping', conversationId)
    }
  }

  // Parar de indicar que está digitando
  stopTyping(conversationId: string) {
    if (this.socket?.connected) {
      console.log(`⌨️ Parando digitação na conversa: ${conversationId}`)
      this.socket.emit('stopTyping', conversationId)
    }
  }

  // Marcar mensagens como lidas
  markMessagesAsRead(conversationId: string) {
    if (this.socket?.connected) {
      console.log(`✅ Marcando mensagens como lidas na conversa: ${conversationId}`)
      this.socket.emit('markMessagesAsRead', conversationId)
    }
  }

  // Sistema de eventos customizado para componentes React
  private eventListeners: { [key: string]: Function[] } = {}

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
export function useWebSocket() {
  const { token, isAuthenticated } = useAuthStore()
  const { invalidateByContext } = useQueryInvalidation()

  // Configurar invalidação de queries
  React.useEffect(() => {
    websocketService.setQueryInvalidation(invalidateByContext)
  }, [invalidateByContext])

  // Conectar/desconectar baseado na autenticação
  React.useEffect(() => {
    if (isAuthenticated && token) {
      websocketService.connect(token)
    } else {
      websocketService.disconnect()
    }

    return () => {
      // Cleanup na desmontagem do componente
      websocketService.disconnect()
    }
  }, [isAuthenticated, token])

  return {
    connected: websocketService.connected,
    socket: websocketService,
    joinConversation: websocketService.joinConversation.bind(websocketService),
    leaveConversation: websocketService.leaveConversation.bind(websocketService),
    startTyping: websocketService.startTyping.bind(websocketService),
    stopTyping: websocketService.stopTyping.bind(websocketService),
    markMessagesAsRead: websocketService.markMessagesAsRead.bind(websocketService)
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