import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Configurar o handler de notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

interface RegisterTokenParams {
  token: string;
  deviceType?: 'android' | 'ios' | 'web';
}

class PushNotificationService {
  private token: string | null = null;

  /**
   * Registra para receber push notifications e obtém o token
   */
  async registerForPushNotifications(): Promise<string | null> {
    try {
      // Verificar se é um dispositivo físico
      if (!Device.isDevice) {
        console.warn('Push notifications only work on physical devices');
        return null;
      }

      // Configurar canal de notificação no Android
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      // Verificar/solicitar permissões
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        throw new Error('Permission not granted for push notifications');
      }

      // Obter project ID do EAS
      const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
      
      if (!projectId) {
        throw new Error('Project ID not found. Make sure EAS project is configured.');
      }

      // Obter o token Expo Push
      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId,
      });

      this.token = tokenData.data;
      console.log('✅ Expo Push Token obtained:', this.token);

      return this.token;
    } catch (error) {
      console.error('❌ Error registering for push notifications:', error);
      throw error;
    }
  }

  /**
   * Registra o token no backend
   */
  async registerTokenWithServer(authToken: string): Promise<boolean> {
    try {
      if (!this.token) {
        throw new Error('No push token available. Call registerForPushNotifications first.');
      }

      const deviceType = Platform.OS === 'ios' ? 'ios' : 'android';

      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/push-tokens/register`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: this.token,
          deviceType,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to register token: ${errorData.message || response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Token registered with server:', data);
      
      return true;
    } catch (error) {
      console.error('❌ Error registering token with server:', error);
      return false;
    }
  }

  /**
   * Remove o token do servidor (logout)
   */
  async unregisterTokenFromServer(authToken: string): Promise<boolean> {
    try {
      if (!this.token) {
        return true; // Nada para fazer
      }

      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/push-tokens/unregister`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: this.token,
        }),
      });

      if (!response.ok) {
        console.warn('Failed to unregister token from server, but continuing...');
      }

      return true;
    } catch (error) {
      console.error('❌ Error unregistering token from server:', error);
      return false;
    }
  }

  /**
   * Obtém o token atual
   */
  getToken(): string | null {
    return this.token;
  }

  /**
   * Configura listeners para notificações
   */
  setupNotificationListeners() {
    // Listener para notificações recebidas enquanto app está aberto
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('📱 Notification received:', notification);
      
      // Aqui você pode processar a notificação (ex: atualizar badge, mostrar modal, etc.)
      this.handleNotificationReceived(notification);
    });

    // Listener para quando usuário toca na notificação
    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('👆 Notification tapped:', response);
      
      // Aqui você pode navegar para tela específica baseada no tipo da notificação
      this.handleNotificationResponse(response);
    });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }

  /**
   * Processa notificação recebida
   */
  private handleNotificationReceived(notification: Notifications.Notification) {
    const { data } = notification.request.content;
    
    if (data?.type === 'message_from_buyer' || data?.type === 'message_from_seller') {
      // Atualizar badge de mensagens não lidas
      // Emitir evento para atualizar UI se necessário
      console.log('💬 New message notification received');
    }
  }

  /**
   * Processa resposta do usuário à notificação
   */
  private handleNotificationResponse(response: Notifications.NotificationResponse) {
    const { data } = response.notification.request.content;
    
    if (data?.type === 'message_from_buyer' || data?.type === 'message_from_seller') {
      // Navegar para a conversa específica
      console.log('🔀 Should navigate to conversation:', data);
      
      // Aqui você pode usar navigation.navigate() ou router.push()
      // Example: router.push(`/chat/conversation/${data.conversationId}`);
    }
  }

  /**
   * Busca notificações do servidor
   */
  async getNotifications(authToken: string, page: number = 1) {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/push-notifications/mine?page=${page}&pageSize=20`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch notifications: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Error fetching notifications:', error);
      throw error;
    }
  }

  /**
   * Marca notificação como lida
   */
  async markNotificationAsRead(authToken: string, notificationId: string) {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/push-notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      return response.ok;
    } catch (error) {
      console.error('❌ Error marking notification as read:', error);
      return false;
    }
  }

  /**
   * Conta notificações não lidas
   */
  async getUnreadCount(authToken: string): Promise<number> {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/push-notifications/unread-count`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        return 0;
      }

      const data = await response.json();
      return data.count || 0;
    } catch (error) {
      console.error('❌ Error getting unread count:', error);
      return 0;
    }
  }
}

export default new PushNotificationService();