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

  // 🔌 WebSocket hooks
  const { connected, joinConversation, leaveConversation, startTyping, stopTyping, markMessagesAsRead } = useWebSocket()

  // 🎧 WebSocket event listeners
  useWebSocketEvent('newMessage', (messageData: any) => {
    console.log('🎧 Nova mensagem recebida via WebSocket:', messageData)
    
    // Add message to current conversation if it matches
    if (messageData.conversationId === conversationId) {
      // Não adicionar mensagens do próprio usuário (já temos optimistic update)
      if (messageData.senderId === user?.id) {
        console.log('⏭️ Mensagem do próprio usuário, ignorando (optimistic update já aplicado)')
        return
      }
      
      queryClient.setQueryData(['messages', conversationId], (oldMessages: any[]) => {
        if (!oldMessages) return [messageData]
        
        // Verificar se a mensagem já existe (evitar duplicatas)
        const messageId = messageData.id?.toString()
        const exists = oldMessages.some(msg => 
          msg.id?.toString() === messageId
        )
        
        if (exists) {
          console.log('🔄 Mensagem já existe no cache, ignorando duplicata:', messageId)
          return oldMessages
        }
        
        // Adicionar nova mensagem no final (mais recente)
        const newMessages = [...oldMessages, messageData]
        console.log('✅ Mensagem de outro usuário adicionada ao cache:', messageId)
        return newMessages
      })
      
      console.log('✅ Mensagem de outro usuário adicionada ao cache via WebSocket')
    }
  })

  useWebSocketEvent('userTyping', ({ userId, conversationId: typingConversationId }: any) => {
    if (typingConversationId === conversationId && userId !== user?.id) {
      setOtherUserTyping(true)
    }
  })

  useWebSocketEvent('userStoppedTyping', ({ userId, conversationId: typingConversationId }: any) => {
    if (typingConversationId === conversationId && userId !== user?.id) {
      setOtherUserTyping(false)
    }
  })

  useWebSocketEvent('messagesRead', ({ conversationId: readConversationId }: any) => {
    if (readConversationId === conversationId) {
      // Refresh conversation to update unread count
      queryClient.invalidateQueries({ queryKey: ['conversation', conversationId] })
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
      console.log('✅ Mensagem enviada com sucesso:', { 
        id: newMessage?.id, 
        content: newMessage?.content?.substring(0, 30) + '...' 
      })
      
      // Substituir mensagem otimista pela real do servidor
      queryClient.setQueryData(['messages', conversationId], (oldMessages: any) => {
        if (!oldMessages) return [newMessage]
        
        console.log('🔄 Atualizando cache. Mensagens antigas:', oldMessages.length)
        
        // Remover mensagem temporária 
        const withoutTemp = oldMessages.filter((msg: any) => {
          if (!msg.id) {
            console.log('⚠️ Mensagem sem ID encontrada:', msg)
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
          console.log('🔄 Mensagem real já existe, não adicionando duplicata:', messageId)
          return withoutTemp
        }
        
        const newCache = [...withoutTemp, newMessage]
        console.log('✅ Cache atualizado com', newCache.length, 'mensagens')
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
      console.log('🏠 Entrando na sala da conversa:', conversationId)
      joinConversation(conversationId)
      
      return () => {
        console.log('🚪 Saindo da sala da conversa:', conversationId)
        leaveConversation(conversationId)
      }
    } else {
      console.log('⚠️ Não pode entrar na sala:', { conversationId, connected })
    }
    // Removido joinConversation e leaveConversation das dependências para evitar re-renders
  }, [conversationId, connected])

  // ⌨️ Gerenciar indicador de digitação
  const typingTimeoutRef = useRef<number | undefined>(undefined)
  
  const handleInputChange = useCallback((text: string) => {
    setInputMessage(text)
    
    // Indicar que está digitando
    if (!isTyping && text.trim() && conversationId) {
      setIsTyping(true)
      startTyping(conversationId)
    }
    
    // Resetar timer de parar digitação
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping && conversationId) {
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
    console.log('🔄 Iniciando refresh das mensagens...')
    
    // Invalidar e refetch as mensagens
    await queryClient.invalidateQueries({ 
      queryKey: ['messages', conversationId],
      refetchType: 'active' 
    })
    
    console.log('✅ Refresh das mensagens concluído')
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
  }
}