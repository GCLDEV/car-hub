export interface Message {
  id: string
  content: string
  senderId: string
  receiverId: string
  carId?: string // Conversa relacionada a um carro específico
  createdAt: string
  isRead: boolean
  type: 'text' | 'image' | 'system'
}

export interface Conversation {
  id: string
  participants: string[] // Array de user IDs
  car?: {
    id: string
    title: string
    price: number
    images: string[]
  }
  lastMessage: Message | null // Pode ser null se não há mensagens ainda
  unreadCount: number
  updatedAt: string
}

export interface ChatUser {
  id: string
  name: string
  avatar?: string
  isOnline: boolean
  lastSeen?: string
}

export interface CreateMessageRequest {
  content: string
  conversationId: string
  receiverId?: string
  carId?: string
  type?: 'text' | 'image'
}

export interface ConversationFilters {
  unreadOnly?: boolean
  carId?: string
}