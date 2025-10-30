import api from './client'
import { Conversation, Message, CreateMessageRequest } from '@/types/chat'

export async function getConversations(): Promise<Conversation[]> {
  try {
    const response = await api.get('/conversations')
    return response.data.data || []
  } catch (error) {
    console.error('Failed to fetch conversations:', error)
    throw error
  }
}

export async function getConversationMessages(conversationId: string): Promise<Message[]> {
  try {
    const response = await api.get(`/messages?filters[conversation][id]=${conversationId}&sort=createdAt:asc&populate=*`)
    return response.data.data || []
  } catch (error) {
    console.error('Failed to fetch messages:', error)
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
    return response.data.data
  } catch (error) {
    console.error('Failed to send message:', error)
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
  } catch (error) {
    console.error('Failed to create conversation:', error)
    throw error
  }
}

export async function markMessagesAsRead(conversationId: string): Promise<void> {
  try {
    await api.put(`/conversations/${conversationId}/mark-read`)
  } catch (error) {
    console.error('Failed to mark messages as read:', error)
    throw error
  }
}