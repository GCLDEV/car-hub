import { useCallback } from 'react'
import { useRouter } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { Conversation } from '@/types/chat'
import { getConversations } from '@services/api/chat'

export default function useChatController() {
  const router = useRouter()
  
  // Buscar conversas da API
  const { 
    data: conversations, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['conversations'],
    queryFn: getConversations,
    staleTime: 30 * 1000, // 30 segundos
    gcTime: 5 * 60 * 1000, // 5 minutos
  })

  // Navegar para conversa específica
  const handleConversationPress = useCallback((conversation: Conversation | any) => {
    const conversationId = typeof conversation === 'string' ? conversation : conversation.id
    router.push(`/chat/${conversationId}` as any)
  }, [router])

  // Atualizar conversas (pull-to-refresh)
  const handleRefresh = useCallback(async () => {
    await refetch()
  }, [refetch])

  // Criar nova conversa
  const createConversation = useCallback(async (carId: string, participantId: string) => {
    try {
      const { createOrFindConversation } = await import('@services/api/chat')
      const conversation = await createOrFindConversation(carId, participantId)
      
      // Invalidar cache das conversas para incluir a nova
      await refetch()
      
      // Navegar para a conversa criada
      router.push(`/chat/${conversation.id}` as any)
      
      return conversation
    } catch (error) {
      throw error
    }
  }, [refetch, router])

  return {
    conversations: conversations || [],
    isLoading,
    error,
    handleConversationPress,
    handleRefresh,
    createConversation,
  }
}