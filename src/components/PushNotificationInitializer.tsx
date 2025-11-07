import React, { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { usePushNotificationStore } from '@store/pushNotificationStore';

/**
 * Componente para inicializar push notifications globalmente
 * Deve ser adicionado no _layout.tsx principal
 */
export default function PushNotificationInitializer() {
  const { handleNotificationReceived, handleNotificationTapped } = usePushNotificationStore();

  useEffect(() => {
    // Listener para notificações recebidas
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('📱 Notification received in app:', notification);
      handleNotificationReceived(notification);
    });

    // Listener para quando usuário toca na notificação
    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('👆 User tapped notification:', response);
      handleNotificationTapped(response);
    });

    // Cleanup
    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  // Componente invisível - apenas para setup dos listeners
  return null;
}