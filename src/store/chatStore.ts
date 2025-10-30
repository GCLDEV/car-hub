import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Conversation, Message, ChatUser } from '@/types/chat'

interface ChatState {
  conversations: Conversation[]
  activeConversation: Conversation | null
  messages: { [conversationId: string]: Message[] }
  onlineUsers: ChatUser[]
  unreadCount: number
  
  // Actions
  setConversations: (conversations: Conversation[]) => void
  setActiveConversation: (conversation: Conversation | null) => void
  addMessage: (conversationId: string, message: Message) => void
  markAsRead: (conversationId: string, messageIds: string[]) => void
  updateOnlineUsers: (users: ChatUser[]) => void
  clearChat: () => void
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      activeConversation: null,
      messages: {},
      onlineUsers: [],
      unreadCount: 0,

      setConversations: (conversations) => {
        const unreadCount = conversations.reduce((total, conv) => total + conv.unreadCount, 0)
        set({ conversations, unreadCount })
      },

      setActiveConversation: (conversation) => {
        set({ activeConversation: conversation })
      },

      addMessage: (conversationId, message) => {
        set((state) => {
          const conversationMessages = state.messages[conversationId] || []
          const updatedMessages = {
            ...state.messages,
            [conversationId]: [...conversationMessages, message]
          }

          // Atualizar última mensagem na conversa
          const updatedConversations = state.conversations.map(conv => {
            if (conv.id === conversationId) {
              return {
                ...conv,
                lastMessage: message,
                updatedAt: message.createdAt,
                unreadCount: message.senderId === conv.participants.find(p => p !== message.senderId) 
                  ? conv.unreadCount + 1 
                  : conv.unreadCount
              }
            }
            return conv
          })

          const unreadCount = updatedConversations.reduce((total, conv) => total + conv.unreadCount, 0)

          return {
            messages: updatedMessages,
            conversations: updatedConversations,
            unreadCount
          }
        })
      },

      markAsRead: (conversationId, messageIds) => {
        set((state) => {
          // Marcar mensagens como lidas
          const conversationMessages = state.messages[conversationId] || []
          const updatedMessages = {
            ...state.messages,
            [conversationId]: conversationMessages.map(msg => 
              messageIds.includes(msg.id) ? { ...msg, isRead: true } : msg
            )
          }

          // Atualizar contador de não lidas na conversa
          const updatedConversations = state.conversations.map(conv => {
            if (conv.id === conversationId) {
              const newUnreadCount = Math.max(0, conv.unreadCount - messageIds.length)
              return { ...conv, unreadCount: newUnreadCount }
            }
            return conv
          })

          const unreadCount = updatedConversations.reduce((total, conv) => total + conv.unreadCount, 0)

          return {
            messages: updatedMessages,
            conversations: updatedConversations,
            unreadCount
          }
        })
      },

      updateOnlineUsers: (users) => {
        set({ onlineUsers: users })
      },

      clearChat: () => {
        set({
          conversations: [],
          activeConversation: null,
          messages: {},
          onlineUsers: [],
          unreadCount: 0
        })
      }
    }),
    {
      name: 'chat-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        conversations: state.conversations,
        messages: state.messages,
        unreadCount: state.unreadCount
      })
    }
  )
)