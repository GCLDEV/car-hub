import { useState, useCallback, useEffect, useRef } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Toast from 'react-native-toast-message'
import { useAuthStore } from '@store/authStore'
import { getConversationMessages, sendMessage } from '@services/api/chat'
import api from '@services/api/client'
import { useWebSocket, useWebSocketEvent } from '@services/websocket'

export default function useConversationController() {
  const { conversationId } = useLocalSearchParams<{ conversationId: string }>()
  const router = useRouter()
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [otherUserTyping, setOtherUserTyping] = useState(false)
  const [otherUserOnline, setOtherUserOnline] = useState(false)
  const [otherUserInConversation, setOtherUserInConversation] = useState(false)

  // 🔌 WebSocket hooks
  const { 
    connected, 
    joinConversation, 
    leaveConversation, 
    startTyping, 
    stopTyping, 
    markMessagesAsRead,
    checkUserOnlineStatus,
    enterConversation
  } = useWebSocket()

  // 🎧 WebSocket event listeners
  useWebSocketEvent('newMessage', (messageData: any) => {
    // console.log('📨 [Controller] Nova mensagem recebida:', messageData)
    // console.log('🎯 [Controller] Conversa atual:', conversationId)
    
    // Add message to current conversation if it matches
    if (messageData.conversationId === conversationId) {
      // // console.log('✅ [Controller] Mensagem é para esta conversa')
      
      // Não adicionar mensagens do próprio usuário (já temos optimistic update)
      if (messageData.senderId === user?.id) {
        // console.log('⚠️ [Controller] Ignorando mensagem do próprio usuário')
        return
      }
      
      // // console.log('🔄 [Controller] Atualizando cache com nova mensagem')
      
      queryClient.setQueryData(['messages', conversationId], (oldMessages: any[]) => {
        if (!oldMessages) {
          // console.log('📝 [Controller] Primeira mensagem na conversa')
          return [messageData]
        }
        
        // Verificar se a mensagem já existe (evitar duplicatas)
        const messageId = messageData.id?.toString()
        const exists = oldMessages.some(msg => 
          msg.id?.toString() === messageId
        )
        
        if (exists) {
          // console.log('⚠️ [Controller] Mensagem já existe, ignorando duplicata')
          return oldMessages
        }
        
        // Adicionar nova mensagem no final (mais recente)
        const newMessages = [...oldMessages, messageData]
        // console.log('✅ [Controller] Cache atualizado, total de mensagens:', newMessages.length)
        
        return newMessages
      })
    } else {
      // // console.log('❌ [Controller] Mensagem não é para esta conversa')
    }
  })

  useWebSocketEvent('userStartedTyping', ({ userId, conversationId: typingConversationId }: any) => {
    // // console.log('⌨️ [Controller] Usuário começou a digitar:', { userId, typingConversationId, currentConversation: conversationId })
    if (typingConversationId === conversationId && userId !== user?.id) {
      setOtherUserTyping(true)
      // console.log('✅ [Controller] Exibindo indicador de digitação')
    }
  })

  useWebSocketEvent('userStoppedTyping', ({ userId, conversationId: typingConversationId }: any) => {
    // console.log('⏸️ [Controller] Usuário parou de digitar:', { userId, typingConversationId, currentConversation: conversationId })
    if (typingConversationId === conversationId && userId !== user?.id) {
      setOtherUserTyping(false)
      // console.log('✅ [Controller] Ocultando indicador de digitação')
    }
  })

  // Fallback listener para evento original do servidor
  useWebSocketEvent('new_message', (messageData: any) => {
    // console.log('📨 [Controller] Nova mensagem recebida (evento original):', messageData)
    
    if (messageData.conversationId === conversationId && messageData.senderId !== user?.id) {
      // console.log('🔄 [Controller] Processando via evento original')
      
      queryClient.setQueryData(['messages', conversationId], (oldMessages: any[]) => {
        if (!oldMessages) return [messageData]
        
        const messageId = messageData.id?.toString()
        const exists = oldMessages.some(msg => msg.id?.toString() === messageId)
        
        if (exists) return oldMessages
        
        return [...oldMessages, messageData]
      })
    }
  })

  useWebSocketEvent('messagesRead', ({ conversationId: readConversationId }: any) => {
    if (readConversationId === conversationId) {
      // Refresh conversation to update unread count
      queryClient.invalidateQueries({ queryKey: ['conversation', conversationId] })
    }
  })

  // 🟢 PRESENÇA - Usuário online/offline
  useWebSocketEvent('userOnline', ({ userId, conversationId: eventConversationId }: any) => {
    if (eventConversationId === conversationId && userId !== user?.id) {
      setOtherUserOnline(true)
      
    }
  })

  useWebSocketEvent('userOffline', ({ userId, conversationId: eventConversationId }: any) => {
    if (eventConversationId === conversationId && userId !== user?.id) {
      setOtherUserOnline(false)
      setOtherUserInConversation(false)
      
    }
  })

  useWebSocketEvent('userOnlineStatus', ({ userId, isOnline, conversationId: eventConversationId }: any) => {
    if (eventConversationId === conversationId && userId !== user?.id?.toString()) {
      setOtherUserOnline(isOnline)
      
    }
  })

  // 👁️ VISUALIZAÇÃO - Usuário entrou na conversa
  useWebSocketEvent('userEnteredConversation', ({ userId, conversationId: eventConversationId }: any) => {
    if (eventConversationId === conversationId && userId !== user?.id) {
      setOtherUserInConversation(true)
      
      // Auto-marcar minhas mensagens como lidas após 2 segundos
      setTimeout(() => {
        const unreadMessages = messages?.filter(msg => 
          msg.senderId === user?.id?.toString() && !msg.isRead
        ).map(msg => msg.id) || []
        
        if (unreadMessages.length > 0) {
          markMessagesAsRead(conversationId!, unreadMessages)
        }
      }, 2000)
    }
  })

  // Buscar dados da conversa
  const { 
    data: conversation, 
    isLoading: conversationLoading 
  } = useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: async () => {
      const response = await api.get(`/conversations/${conversationId}`)
      return response.data.data
    },
    enabled: !!conversationId,
    staleTime: 30 * 1000, // 30 segundos
  })

  // Buscar mensagens da conversa - sem polling, usando WebSocket para tempo real
  const { 
    data: messages, 
    isLoading: messagesLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => getConversationMessages(conversationId!),
    enabled: !!conversationId,
    staleTime: 30 * 1000, // 30 segundos - menos frequente já que temos WebSocket
    gcTime: 5 * 60 * 1000, // 5 minutos
    // ❌ Removido refetchInterval - usamos WebSocket agora
  })

  // Mutation para enviar mensagem com optimistic updates
  const sendMessageMutation = useMutation({
    mutationFn: sendMessage,
    onMutate: async (newMessageData) => {
      // ✨ OPTIMISTIC UPDATE: Adicionar mensagem imediatamente na tela      
      // Cancelar queries em andamento para evitar conflitos
      await queryClient.cancelQueries({ queryKey: ['messages', conversationId] })
      
      // Salvar estado anterior para rollback se der erro
      const previousMessages = queryClient.getQueryData(['messages', conversationId])
      
      // Criar mensagem temporária para mostrar na tela
      const optimisticMessage = {
        id: `temp-${Date.now()}`, // ID temporário
        content: newMessageData.content,
        senderId: user?.id?.toString() || '',
        receiverId: '', // Será preenchido pelo servidor
        createdAt: new Date().toISOString(),
        isRead: false,
        type: 'text' as const,
        carId: undefined
      }
      
      // Adicionar mensagem otimista ao cache
      queryClient.setQueryData(['messages', conversationId], (oldMessages: any) => [
        ...(oldMessages || []),
        optimisticMessage
      ])
            
      // Retornar contexto para rollback se necessário
      return { previousMessages }
    },
    onSuccess: (newMessage, variables, context) => {

      
      // Substituir mensagem otimista pela real do servidor
      queryClient.setQueryData(['messages', conversationId], (oldMessages: any) => {
        if (!oldMessages) return [newMessage]
        
        
        
        // Remover mensagem temporária 
        const withoutTemp = oldMessages.filter((msg: any) => {
          if (!msg.id) {
            
            return true
          }
          return typeof msg.id === 'string' ? !msg.id.startsWith('temp-') : true
        })
        
        // Verificar se a mensagem real já existe (evitar duplicata)
        const messageId = newMessage.id?.toString()
        const realMessageExists = withoutTemp.some((msg: any) => 
          msg.id?.toString() === messageId
        )
        
        if (realMessageExists) {
          
          return withoutTemp
        }
        
        const newCache = [...withoutTemp, newMessage]
        
        return newCache
      })
      
      // Atualizar cache das conversas
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
      
      // ❌ Removido refetch - o WebSocket já atualiza automaticamente
      // ❌ Removido setInputMessage('') - já limpo no handleSendMessage
    },
    onError: (error: any, variables, context) => {
      console.error('❌ Erro ao enviar mensagem:', error)
      
      // Rollback: Restaurar estado anterior
      if (context?.previousMessages) {
        queryClient.setQueryData(['messages', conversationId], context.previousMessages)
      }
      
      Toast.show({
        type: 'error',
        text1: 'Erro ao enviar mensagem',
        text2: 'Tente novamente',
        position: 'bottom',
      })
    },
  })

  // 🏠 WebSocket: Entrar/sair da sala da conversa
  useEffect(() => {
    if (conversationId && connected) {
      // console.log('🏠 [Controller] Entrando na conversa:', { conversationId, connected })
      joinConversation(conversationId)
      
      // Notificar que entrei na conversa (para visualização)
      setTimeout(() => {
        // console.log('👁️ [Controller] Notificando entrada na conversa')
        enterConversation(conversationId)
      }, 1000)
      
      // Verificar se outro usuário está online
      if (conversation?.otherUser?.id) {
        // console.log('👤 [Controller] Verificando status online do usuário:', conversation.otherUser.id)
        checkUserOnlineStatus(conversation.otherUser.id.toString(), conversationId)
      }
      
      return () => {
        // console.log('🚪 [Controller] Saindo da conversa:', conversationId)
        leaveConversation(conversationId)
        setOtherUserInConversation(false)
      }
    } else {
      // console.log('❌ [Controller] WebSocket não conectado ou sem conversationId:', { conversationId, connected })
    }
  }, [conversationId, connected, conversation?.otherUser?.id])

  // ⌨️ Gerenciar indicador de digitação
  const typingTimeoutRef = useRef<number | undefined>(undefined)
  
  const handleInputChange = useCallback((text: string) => {
    // console.log('⌨️ [Controller] Input mudou:', { text: text.length > 20 ? `${text.substring(0, 20)}...` : text, isCurrentlyTyping: isTyping, hasConversationId: !!conversationId })
    setInputMessage(text)
    
    // Indicar que está digitando
    if (!isTyping && text.trim() && conversationId) {
      // console.log('🟢 [Controller] Iniciando indicador de digitação')
      setIsTyping(true)
      startTyping(conversationId)
    }
    
    // Resetar timer de parar digitação
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping && conversationId) {
        // console.log('🔴 [Controller] Parando indicador de digitação (timeout)')
        setIsTyping(false)
        stopTyping(conversationId)
      }
    }, 1000) // Para de digitar após 1 segundo sem input
  }, [isTyping, conversationId, startTyping, stopTyping])

  // Enviar mensagem
  const handleSendMessage = useCallback(() => {
    if (!inputMessage.trim() || !conversationId || !user) {
      return
    }

    const messageContent = inputMessage.trim()

    // Limpar input imediatamente
    setInputMessage('')

    // Parar indicador de digitação
    if (isTyping) {
      setIsTyping(false)
      stopTyping(conversationId)
    }

    sendMessageMutation.mutate({
      content: messageContent,
      conversationId,
      type: 'text'
    })
  }, [inputMessage, conversationId, user, sendMessageMutation, isTyping, stopTyping])

  // Voltar para lista de conversas
  const handleGoBack = useCallback(() => {
    router.back()
  }, [router])

  // Atualizar mensagens (pull-to-refresh)
  const handleRefresh = useCallback(async () => {
    
    
    // Invalidar e refetch as mensagens
    await queryClient.invalidateQueries({ 
      queryKey: ['messages', conversationId],
      refetchType: 'active' 
    })
    
    
  }, [queryClient, conversationId])

  return {
    messages: messages || [],
    inputMessage,
    setInputMessage: handleInputChange, // 🔄 Substituído para gerenciar digitação
    isLoading: messagesLoading || conversationLoading,
    loading: messagesLoading || conversationLoading, // Alias para compatibilidade
    sending: sendMessageMutation.isPending,
    isSending: sendMessageMutation.isPending,
    error,
    handleSendMessage,
    handleGoBack,  
    handleRefresh,
    // 🆕 WebSocket features
    connected,
    isTyping: otherUserTyping, // Se o outro usuário está digitando
    userTyping: isTyping, // Se EU estou digitando
    currentUserId: user?.id,
    conversation: conversation || null,
    // 🆕 Presença e visualização
    otherUserOnline,
    otherUserInConversation,
  }
}
