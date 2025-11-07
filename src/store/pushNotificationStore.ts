import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import pushNotificationService from '@services/pushNotificationService';

export interface PushNotification {
  id: string;
  title: string;
  body: string;
  type: 'message_from_buyer' | 'message_from_seller';
  data?: {
    conversationId?: string;
    messageId?: string;
    carTitle?: string;
    senderId?: string;
  };
  isRead: boolean;
  sentAt: string;
  sender?: {
    id: string;
    username: string;
  };
}

interface PushNotificationState {
  // Estado
  token: string | null;
  isRegistered: boolean;
  isLoading: boolean;
  notifications: PushNotification[];
  unreadCount: number;
  listeners: (() => void) | null;
  
  // Ações
  initialize: (authToken?: string) => Promise<void>;
  registerForNotifications: (authToken: string) => Promise<boolean>;
  unregisterFromNotifications: (authToken: string) => Promise<void>;
  fetchNotifications: (authToken: string, page?: number) => Promise<void>;
  markAsRead: (authToken: string, notificationId: string) => Promise<void>;
  markAllAsRead: (authToken: string) => Promise<void>;
  updateUnreadCount: (authToken: string) => Promise<void>;
  handleNotificationReceived: (notification: any) => void;
  handleNotificationTapped: (response: any) => void;
  reset: () => void;
}

export const usePushNotificationStore = create<PushNotificationState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      token: null,
      isRegistered: false,
      isLoading: false,
      notifications: [],
      unreadCount: 0,
      listeners: null,

      /**
       * Inicializa o serviço de push notifications
       */
      initialize: async (authToken?: string) => {
        try {
          set({ isLoading: true });

          // Registrar para receber push notifications e obter token
          const token = await pushNotificationService.registerForPushNotifications();
          
          if (token) {
            set({ token });

            // Se tem token de autenticação, registrar no servidor
            if (authToken) {
              const success = await pushNotificationService.registerTokenWithServer(authToken);
              set({ isRegistered: success });

              if (success) {
                // Buscar notificações e contador
                await get().fetchNotifications(authToken);
                await get().updateUnreadCount(authToken);
              }
            }

            // Configurar listeners se ainda não foram configurados
            const state = get();
            if (!state.listeners) {
              const removeListeners = pushNotificationService.setupNotificationListeners();
              set({ listeners: removeListeners });
            }
          }
        } catch (error) {
          console.error('❌ Error initializing push notifications:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      /**
       * Registra token no servidor (após login)
       */
      registerForNotifications: async (authToken: string) => {
        const { token } = get();
        if (!token) {
          console.warn('No push token available');
          return false;
        }

        try {
          set({ isLoading: true });
          
          const success = await pushNotificationService.registerTokenWithServer(authToken);
          set({ isRegistered: success });

          if (success) {
            // Buscar dados iniciais
            await get().fetchNotifications(authToken);
            await get().updateUnreadCount(authToken);
          }

          return success;
        } catch (error) {
          console.error('❌ Error registering for notifications:', error);
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      /**
       * Remove registro do servidor (logout)
       */
      unregisterFromNotifications: async (authToken: string) => {
        try {
          await pushNotificationService.unregisterTokenFromServer(authToken);
          set({ 
            isRegistered: false,
            notifications: [],
            unreadCount: 0
          });
        } catch (error) {
          console.error('❌ Error unregistering from notifications:', error);
        }
      },

      /**
       * Busca notificações do servidor
       */
      fetchNotifications: async (authToken: string, page = 1) => {
        try {
          const response = await pushNotificationService.getNotifications(authToken, page);
          
          if (page === 1) {
            // Primeira página - substituir
            set({ notifications: response.data || [] });
          } else {
            // Páginas seguintes - adicionar
            const { notifications } = get();
            set({ notifications: [...notifications, ...(response.data || [])] });
          }
        } catch (error) {
          console.error('❌ Error fetching notifications:', error);
        }
      },

      /**
       * Marca notificação como lida
       */
      markAsRead: async (authToken: string, notificationId: string) => {
        try {
          const success = await pushNotificationService.markNotificationAsRead(authToken, notificationId);
          
          if (success) {
            const { notifications } = get();
            const updatedNotifications = notifications.map(notif =>
              notif.id === notificationId ? { ...notif, isRead: true } : notif
            );
            
            const newUnreadCount = updatedNotifications.filter(n => !n.isRead).length;
            
            set({ 
              notifications: updatedNotifications,
              unreadCount: newUnreadCount
            });
          }
        } catch (error) {
          console.error('❌ Error marking notification as read:', error);
        }
      },

      /**
       * Marca todas as notificações como lidas
       */
      markAllAsRead: async (authToken: string) => {
        try {
          // Implementar endpoint no backend se necessário
          const { notifications } = get();
          const updatedNotifications = notifications.map(notif => ({ ...notif, isRead: true }));
          
          set({ 
            notifications: updatedNotifications,
            unreadCount: 0
          });
        } catch (error) {
          console.error('❌ Error marking all notifications as read:', error);
        }
      },

      /**
       * Atualiza contador de não lidas
       */
      updateUnreadCount: async (authToken: string) => {
        try {
          const count = await pushNotificationService.getUnreadCount(authToken);
          set({ unreadCount: count });
        } catch (error) {
          console.error('❌ Error updating unread count:', error);
        }
      },

      /**
       * Processa notificação recebida em tempo real
       */
      handleNotificationReceived: (notification: any) => {
        const { notifications, unreadCount } = get();
        
        // Adicionar nova notificação ao topo da lista
        const newNotification: PushNotification = {
          id: notification.request.identifier || Date.now().toString(),
          title: notification.request.content.title || '',
          body: notification.request.content.body || '',
          type: notification.request.content.data?.type || 'message_from_seller',
          data: notification.request.content.data,
          isRead: false,
          sentAt: new Date().toISOString(),
          sender: notification.request.content.data?.sender
        };

        set({ 
          notifications: [newNotification, ...notifications],
          unreadCount: unreadCount + 1
        });
      },

      /**
       * Processa tap na notificação
       */
      handleNotificationTapped: (response: any) => {
        const data = response.notification.request.content.data;
        
        console.log('🔀 Navigation data from notification:', data);
        
        // Aqui você pode implementar navegação específica
        // Por exemplo, navegar para conversa se for mensagem
        if (data?.conversationId) {
          // router.push(`/chat/conversation/${data.conversationId}`);
        }
      },

      /**
       * Reset completo do estado
       */
      reset: () => {
        const { listeners } = get();
        
        // Remover listeners se existirem
        if (listeners) {
          listeners();
        }

        set({
          token: null,
          isRegistered: false,
          isLoading: false,
          notifications: [],
          unreadCount: 0,
          listeners: null
        });
      }
    }),
    {
      name: 'push-notification-store',
      storage: createJSONStorage(() => AsyncStorage),
      // Persistir apenas dados essenciais
      partialize: (state) => ({
        token: state.token,
        isRegistered: state.isRegistered
      })
    }
  )
);