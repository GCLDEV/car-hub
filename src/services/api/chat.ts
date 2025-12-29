import api from './client'
import { Conversation, Message, CreateMessageRequest } from '@/types/chat'

export async function getConversations(): Promise<Conversation[]> {
  try {
    // Usar o endpoint alternativo que já está implementado no message controller
    const response = await api.get('/messages/conversations')
    return response.data.data || []
  } catch (error: any) {
    console.error('❌ Failed to fetch conversations:', {
      status: error.response?.status,
      message: error.response?.data?.error?.message || error.message
    })
    throw error
  }
}

// Transform Strapi message format to our Message interface
function transformStrapiMessage(strapiMessage: any): Message {
  // Garantir que sempre temos um ID válido
  const messageId = strapiMessage.id?.toString() || strapiMessage.documentId || `fallback-${Date.now()}-${Math.random()}`
  
  if (!strapiMessage.id && !strapiMessage.documentId) {
    console.warn('⚠️ Mensagem sem ID válido:', strapiMessage)
  }
  
  // Extrair senderId de múltiplas formas possíveis
  const senderId = (
    strapiMessage.sender?.id?.toString() || 
    strapiMessage.senderId?.toString() || 
    strapiMessage.data?.sender?.toString() ||
    ''
  )
  
  // Extrair receiverId de múltiplas formas possíveis  
  const receiverId = (
    strapiMessage.receiver?.id?.toString() || 
    strapiMessage.receiverId?.toString() || 
    strapiMessage.data?.receiver?.toString() ||
    ''
  )
  
  return {
    id: messageId,
    content: strapiMessage.content,
    senderId,
    receiverId,
    carId: strapiMessage.car?.id?.toString(),
    createdAt: strapiMessage.createdAt,
    isRead: strapiMessage.isRead,
    type: strapiMessage.type || 'text'
  }
}

export async function getConversationMessages(conversationId: string): Promise<Message[]> {
  try {
    const response = await api.get(`/messages?conversationId=${conversationId}`)
    
    // Transform messages from Strapi format to our format
    const transformedMessages = (response.data.data || []).map(transformStrapiMessage)
    
    return transformedMessages
  } catch (error: any) {
    console.error('❌ Failed to fetch messages:', {
      conversationId,
      status: error.response?.status,
      message: error.response?.data?.error?.message || error.message
    })
    throw error
  }
}

export async function sendMessage(request: CreateMessageRequest): Promise<Message> {
  try {
    const response = await api.post('/messages', {
      data: {
        content: request.content,
        conversation: request.conversationId,
        type: request.type || 'text'
      }
    })
    
    // Transformar resposta do Strapi para nosso formato
    const transformedMessage = transformStrapiMessage(response.data.data)
    
    return transformedMessage
  } catch (error: any) {
    console.error('❌ sendMessage - Failed:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      originalRequest: request
    })
    throw error
  }
}

export async function createOrFindConversation(carId: string, participantId: string): Promise<Conversation> {
  try {
    const response = await api.post('/conversations', {
      data: {
        carId,
        participantId
      }
    })
    
    return response.data.data
  } catch (error: any) {
    console.error('❌ Failed to create conversation:', {
      error: error.response?.data || error.message,
      carId,
      participantId
    })
    throw new Error(error.response?.data?.error?.message || 'Erro ao iniciar conversa')
  }
}

export async function markMessagesAsRead(conversationId: string): Promise<void> {
  try {
    await api.put(`/conversations/${conversationId}/mark-read`)
  } catch (error) {
    throw error
  }
}