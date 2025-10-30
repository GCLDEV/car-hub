import { useState, useCallback } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Toast from 'react-native-toast-message'
import { useAuthStore } from '@store/authStore'
import { getConversationMessages, sendMessage } from '@services/api/chat'

export default function useConversationController() {
  const { conversationId } = useLocalSearchParams<{ conversationId: string }>()
  const router = useRouter()
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const [inputMessage, setInputMessage] = useState('')

  // Buscar mensagens da conversa
  const { 
    data: messages, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => getConversationMessages(conversationId!),
    enabled: !!conversationId,
    staleTime: 10 * 1000, // 10 segundos
    gcTime: 5 * 60 * 1000, // 5 minutos
  })

  // Mutation para enviar mensagem
  const sendMessageMutation = useMutation({
    mutationFn: sendMessage,
    onSuccess: (newMessage) => {
      // Adicionar mensagem à lista local
      queryClient.setQueryData(['messages', conversationId], (oldMessages: any) => [
        ...(oldMessages || []),
        newMessage
      ])
      
      // Atualizar cache das conversas
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
      
      setInputMessage('')
      Toast.show({
        type: 'success',
        text1: 'Mensagem enviada',
        position: 'bottom',
        visibilityTime: 2000,
      })
    },
    onError: (error: any) => {
      console.error('Error sending message:', error)
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
    if (!inputMessage.trim() || !conversationId || !user) return

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
    isLoading,
    isSending: sendMessageMutation.isPending,
    error,
    handleSendMessage,
    handleGoBack,
    handleRefresh,
    currentUserId: user?.id,
  }
}