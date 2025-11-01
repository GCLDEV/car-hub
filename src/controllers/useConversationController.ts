import { useState, useCallback } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Toast from 'react-native-toast-message'
import { useAuthStore } from '@store/authStore'
import { getConversationMessages, sendMessage } from '@services/api/chat'
import api from '@services/api/client'

export default function useConversationController() {
  const { conversationId } = useLocalSearchParams<{ conversationId: string }>()
  const router = useRouter()
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const [inputMessage, setInputMessage] = useState('')

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

  // Buscar mensagens da conversa com polling para tempo real
  const { 
    data: messages, 
    isLoading: messagesLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => getConversationMessages(conversationId!),
    enabled: !!conversationId,
    staleTime: 5 * 1000, // 5 segundos - mais frequente
    gcTime: 5 * 60 * 1000, // 5 minutos
    refetchInterval: 10 * 1000, // Refetch a cada 10 segundos para tempo real
    refetchIntervalInBackground: false, // Não fazer polling quando app está em background
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
        
        // Remover mensagem temporária e adicionar a real
        const withoutTemp = oldMessages.filter((msg: any) => !msg.id.startsWith('temp-'))
        return [...withoutTemp, newMessage]
      })
      
      // Atualizar cache das conversas
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
      
      // Refetch messages para garantir sincronização
      refetch()
      
      setInputMessage('')
    },
    onError: (error: any, variables, context) => {
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

  // Enviar mensagem
  const handleSendMessage = useCallback(() => {

    if (!inputMessage.trim() || !conversationId || !user) {
      return
    }

    sendMessageMutation.mutate({
      content: inputMessage.trim(),
      conversationId,
      type: 'text'
    })
  }, [inputMessage, conversationId, user, sendMessageMutation])

  // Voltar para lista de conversas
  const handleGoBack = useCallback(() => {
    router.back()
  }, [router])

  // Atualizar mensagens (pull-to-refresh)
  const handleRefresh = useCallback(async () => {
    await refetch()
  }, [refetch])

  return {
    messages: messages || [],
    inputMessage,
    setInputMessage,
    isLoading: messagesLoading || conversationLoading,
    loading: messagesLoading || conversationLoading, // Alias para compatibilidade
    sending: sendMessageMutation.isPending,
    isSending: sendMessageMutation.isPending,
    error,
    handleSendMessage,
    handleGoBack,  
    handleRefresh,
    currentUserId: user?.id,
    conversation: conversation || null,
  }
}