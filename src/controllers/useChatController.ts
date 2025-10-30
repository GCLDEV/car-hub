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
  const handleConversationPress = useCallback((conversationId: string) => {
    router.push(`/chat/${conversationId}` as any)
  }, [router])

  // Atualizar conversas (pull-to-refresh)
  const handleRefresh = useCallback(async () => {
    await refetch()
  }, [refetch])

  // Criar nova conversa (para futuro)
  const createConversation = useCallback((carId: string, participantId: string) => {
    // TODO: Implementar criação de conversa
    console.log('Create conversation for car:', carId, 'with user:', participantId)
  }, [])

  return {
    conversations: conversations || [],
    isLoading,
    error,
    handleConversationPress,
    handleRefresh,
    createConversation,
  }
}