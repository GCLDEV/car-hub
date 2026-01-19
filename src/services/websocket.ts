import React from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuthStore } from '@store/authStore'
import { useQueryInvalidation } from '@hooks/useQueryInvalidation'
import { api } from '@services/api/client'

// Função para verificar se o token é válido
async function verifyToken(token: string): Promise<boolean> {
  try {
    console.log('🔍 Verificando validade do token...')
    
    // Criar uma instância direta do axios para evitar problemas de timing
    const axios = require('axios')
    const apiUrl = getApiUrl()
    
    const response = await axios.get(`${apiUrl}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 10000
    })
    
    console.log('✅ Token válido para usuário:', response.data.username)
    return true
  } catch (error: any) {
    console.error('❌ Token inválido:', error.response?.data?.error?.message || error.message)
    return false
  }
}

// Função para obter URL da API
function getApiUrl() {
  const environment = process.env.EXPO_PUBLIC_ENVIRONMENT || 'dev'
  
  if (environment === 'prod') {
    return process.env.EXPO_PUBLIC_API_ADDRESS_PROD
  }
  
  return process.env.EXPO_PUBLIC_API_ADDRESS_DEV 
}

// Configuração dinâmica do servidor WebSocket
function getSocketURL() {
  const environment = process.env.EXPO_PUBLIC_ENVIRONMENT || 'dev'
  
  if (environment === 'prod') {
    return process.env.EXPO_PUBLIC_WEBSOCKET_URL_PROD
  }
  
  return process.env.EXPO_PUBLIC_WEBSOCKET_URL_DEV 
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
  async connect(token: string, customUrl?: string) {
    // Validar token antes de conectar
    if (!token || token.trim() === '') {
      console.warn('🔐 Token inválido ou ausente - não conectando WebSocket')
      return
    }

    // Comentado temporariamente para evitar problemas de timing
    // const isValidToken = await verifyToken(token)
    // if (!isValidToken) {
    //   console.warn('🔐 Token JWT inválido - não conectando WebSocket')
    //   const { useAuthStore } = await import('@store/authStore')
    //   useAuthStore.getState().logout()
    //   return
    // }

    // Salvar token para HTTP fallback
    this.authToken = token

    // Usar URL customizada se fornecida, senão usar a configurada
    const socketUrl = customUrl || getSocketURL()
    
    console.log('🔗 Tentando conectar WebSocket:', {
      url: socketUrl,
      hasToken: !!token,
      tokenLength: token.length
    })
    
    // Detectar se é ngrok e ajustar transports
    const isNgrok = socketUrl.includes('ngrok')
    const isLocal = socketUrl.includes('192.168') || socketUrl.includes('localhost')
    
    // Para desenvolvimento local, usar polling primeiro (mais confiável)
    const transports = isLocal ? ['polling', 'websocket'] : ['websocket', 'polling']

    this.socket = io(socketUrl, {
      auth: { token },
      transports,
      timeout: 30000,
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 2000,
      reconnectionDelayMax: 10000,
      // Remover forceNew que pode causar conflitos
      // forceNew: true,
      // Configurações otimizadas para React Native 
      upgrade: true,
      rememberUpgrade: true, // Mudado para true
      rejectUnauthorized: false,
      // Configurações para manter conexão estável
      pingTimeout: 60000,
      pingInterval: 25000,
      autoConnect: true,
      closeOnBeforeunload: false,
      // Específico para debugging
      withCredentials: true
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
      console.log('✅ WebSocket conectado com sucesso')
      console.log('🔗 Socket ID:', this.socket?.id)
      console.log('📊 Estado interno:', { 
        socketConnected: this.socket?.connected,
        internalConnected: this.isConnected 
      })
      this.isConnected = true
      this.reconnectAttempts = 0
      
      // Força atualização do estado para garantir
      setTimeout(() => {
        console.log('🔄 Verificação pós-conexão:', {
          socketConnected: this.socket?.connected,
          internalConnected: this.isConnected,
          connected: this.connected
        })
      }, 1000)
    })

    // Erro de conexão
    this.socket.on('connect_error', (error) => {
      const errorMessage = error.message
      const isTokenError = errorMessage.includes('Invalid token') || 
                          errorMessage.includes('Authentication failed') ||
                          errorMessage.includes('User not found') ||
                          errorMessage.includes('invalid signature')
      
      console.error('❌ [DEBUG] Erro de conexão WebSocket:', {
        error: errorMessage,
        type: (error as any).type,
        description: (error as any).description,
        attempts: this.reconnectAttempts,
        isTokenError,
        authToken: this.authToken ? 'Present' : 'Missing',
        socketUrl: SOCKET_URL,
        tokenPreview: this.authToken ? `${this.authToken.substring(0, 30)}...` : 'No token'
      })
      
      // Se for erro de token/JWT, não tentar reconectar
      if (isTokenError) {
        console.warn('🔐 Erro de autenticação JWT - token inválido ou assinatura incorreta')
        console.warn('💡 Possíveis causas:')
        console.warn('   - JWT_SECRET diferente no servidor')
        console.warn('   - Token expirado')
        console.warn('   - Usuário foi removido/desabilitado')
        this.isConnected = false
        this.socket?.disconnect()
        return
      }
      
      this.isConnected = false
      this.reconnectAttempts++
    })

    // Desconectado
    this.socket.on('disconnect', (reason) => {
      console.log(`🔴 WebSocket desconectado: ${reason}`)
      this.isConnected = false
      
      // Se foi desconexão por transport close, tentar reconectar
      if (reason === 'transport close' || reason === 'transport error') {
        console.log('🔄 Tentando reconectar devido a problema de transport...')
        // Socket.io vai tentar reconectar automaticamente
      }
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
  const { token, isAuthenticated, _hasHydrated } = useAuthStore()
  const { invalidateByContext } = useQueryInvalidation()
  const [connectionState, setConnectionState] = React.useState({
    connected: false,
    socketConnected: false,
    internalConnected: false
  })

  // Atualizar estado local quando WebSocket muda
  React.useEffect(() => {
    const updateConnectionState = () => {
      const newState = {
        connected: websocketService.connected,
        socketConnected: websocketService.socket?.connected || false,
        internalConnected: websocketService.isConnected || false
      }
      setConnectionState(newState)
    }

    // Atualizar imediatamente
    updateConnectionState()

    // Configurar listeners para mudanças de estado
    const intervalId = setInterval(updateConnectionState, 500) // Check a cada 500ms

    return () => {
      clearInterval(intervalId)
    }
  }, [])

  // Configurar invalidação de queries
  React.useEffect(() => {
    websocketService.setQueryInvalidation(invalidateByContext)
  }, [invalidateByContext])

  // Conectar/desconectar baseado na autenticação
  React.useEffect(() => {
    // Não fazer nada até que o store tenha sido hidratado
    if (!_hasHydrated) {
      console.log('⏳ Aguardando hidratação do auth store...')
      return
    }
    
    // Log para debug
    console.log('🔐 Auth state changed:', {
      isAuthenticated,
      hasToken: !!token,
      tokenPreview: token ? `${token.substring(0, 20)}...` : 'No token',
      socketUrl: getSocketURL(),
      hydrated: _hasHydrated
    })
    
    if (isAuthenticated && token && token.trim() !== '') {
      // Função assíncrona para conectar
      const connectWebSocket = async () => {
        try {
          console.log('🚀 Iniciando conexão WebSocket...')
          await websocketService.connect(token, customUrl)
        } catch (error) {
          console.error('❌ Erro ao conectar WebSocket:', error)
        }
      }
      
      // Delay para dar tempo da API estar pronta
      const timer = setTimeout(connectWebSocket, 1000)
      
      return () => clearTimeout(timer)
    } else {
      console.log('❌ Desconectando WebSocket - não autenticado ou sem token')
      websocketService.disconnect()
    }
  }, [isAuthenticated, token, customUrl, _hasHydrated])

  return {
    connected: connectionState.connected,
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
    },
    // Estado detalhado para debug
    connectionState
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