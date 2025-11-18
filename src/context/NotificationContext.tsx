import { registerForPushNotificationsAsync } from '@/utils/registerForPushNotificationsAsync';
import * as Notifications from 'expo-notifications';
import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { router } from 'expo-router';
import { InteractionManager, AppState } from 'react-native';
import { registerPushToken } from '@services/api';
import { useAuthStore } from '@store/authStore';
import { useChatStore } from '@store/chatStore';
import { useWebSocket } from '@services/websocket';

// Configurar como as notificações são exibidas
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: true, // ✅ Habilitar badge de contagem
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

interface NotifcationContextType {
  expoPushToken: string | null;
  notiofication: Notifications.Notification | null;
  error: Error | null;
  testBadge: (count: number) => Promise<void>;
  testNavigation: (conversationId: string) => void;
  testWebSocket: () => void;
}

const NotificationContext = createContext<NotifcationContextType | undefined>(
  undefined
);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      'useNotification must be used within a NotificationProvider'
    );
  }
  return context;
}

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notiofication, setNotification] = useState<Notifications.Notification | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const { isAuthenticated } = useAuthStore();
  const { unreadCount } = useChatStore();
  const { connected, socket } = useWebSocket();

  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  useEffect(() => {
    registerForPushNotificationsAsync().then(
      (token) => setExpoPushToken(token),
      (error) => setError(error)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log('Notification received:', notification);
        setNotification(notification);
      })

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log('Notification response: ',
          JSON.stringify(response, null, 2),
          JSON.stringify(response.notification.request.content.data, null, 2)
        );
        
        // 🎯 Navegação automática baseada no tipo de notificação
        const data = response.notification.request.content.data;
        
        console.log('🔍 Processando resposta de notificação:', {
          type: data?.type,
          conversationId: data?.conversationId,
          carId: data?.carId,
          appState: AppState.currentState,
          allData: data
        });

        const navigateToScreen = (route: string) => {
          console.log('🚀 Iniciando navegação para:', route);
          
          // Aguardar interações completarem
          InteractionManager.runAfterInteractions(() => {
            // Aguardar próximo frame para garantir que o app esteja pronto
            requestAnimationFrame(() => {
              try {
                console.log('📱 Estado do app antes da navegação:', AppState.currentState);
                router.push(route as any);
                console.log('✅ Navegação executada para:', route);
              } catch (error) {
                console.error('❌ Erro na navegação:', error);
                
                // Fallback: tentar novamente após mais tempo
                setTimeout(() => {
                  try {
                    console.log('🔄 Tentativa de navegação fallback...');
                    router.replace(route as any);
                  } catch (fallbackError) {
                    console.error('❌ Erro na navegação fallback:', fallbackError);
                  }
                }, 500);
              }
            });
          });
        };

        if (data?.type === 'message' && data?.conversationId) {
          navigateToScreen(`/chat/${data.conversationId}`);
        } else if (data?.type === 'car_sold' && data?.carId) {
          navigateToScreen(`/car/${data.carId}`);
        } else {
          console.log('⚠️ Tipo de notificação não reconhecido ou dados incompletos:', {
            type: data?.type,
            hasConversationId: !!data?.conversationId,
            hasCarId: !!data?.carId,
            data
          });
        }
      });

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    }
  }, [])

  // Register push token with API when user is authenticated and token is available
  useEffect(() => {
    const registerTokenWithAPI = async () => {
      console.log('🔍 Estado de autenticação:', { expoPushToken: !!expoPushToken, isAuthenticated });
      
      if (expoPushToken && isAuthenticated) {
        try {
          console.log('📱 Registrando push token com a API:', expoPushToken);
          
          const result = await registerPushToken(expoPushToken, 'android');
          
          if (result.success) {
            console.log('✅ Push token registrado com sucesso na API');
          } else {
            console.error('❌ Erro ao registrar push token na API:', result.error);
          }
        } catch (error) {
          console.error('❌ Erro inesperado ao registrar push token:', error);
        }
      } else {
        console.log('⏳ Aguardando token ou autenticação...', { 
          hasToken: !!expoPushToken, 
          isAuth: isAuthenticated 
        });
      }
    };

    registerTokenWithAPI();
  }, [expoPushToken, isAuthenticated])

  // 🔴 Sincronizar badge com mensagens não lidas
  useEffect(() => {
    const updateBadge = async () => {
      try {
        await Notifications.setBadgeCountAsync(unreadCount);
        console.log('🔴 Badge atualizado:', unreadCount);
      } catch (error) {
        console.error('❌ Erro ao atualizar badge:', error);
      }
    };

    updateBadge();
  }, [unreadCount]);

  // Função para testar o badge manualmente
  const testBadge = async (count: number) => {
    try {
      await Notifications.setBadgeCountAsync(count);
      console.log('🧪 Badge de teste definido para:', count);
    } catch (error) {
      console.error('❌ Erro ao definir badge de teste:', error);
    }
  };

  // Função para testar a navegação manualmente
  const testNavigation = (conversationId: string) => {
    console.log('🧪 Testando navegação para conversa:', conversationId);
    console.log('📱 Estado atual da autenticação:', { isAuthenticated });
    
    InteractionManager.runAfterInteractions(() => {
      requestAnimationFrame(() => {
        try {
          const route = `/chat/${conversationId}`;
          console.log('🚀 Executando navegação para:', route);
          router.push(route as any);
          console.log('✅ Teste de navegação executado com sucesso');
        } catch (error) {
          console.error('❌ Erro no teste de navegação:', error);
        }
      });
    });
  };

  // Função para testar WebSocket manualmente
  const testWebSocket = () => {
    console.log('🧪 Teste WebSocket:', {
      connected,
      hasSocket: !!socket,
      isAuthenticated
    });
    
    if (connected) {
      console.log('✅ WebSocket conectado!');
      socket?.joinConversation('1'); // Testar com conversa ID 1
    } else {
      console.log('❌ WebSocket não conectado');
    }
  };

  return (
    <NotificationContext.Provider
      value={{ expoPushToken, notiofication, error, testBadge, testNavigation, testWebSocket }}
    >
      {children}
    </NotificationContext.Provider>
  )
}