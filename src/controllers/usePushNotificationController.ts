import { useEffect } from 'react';
import { usePushNotificationStore } from '@store/pushNotificationStore';
import { useAuthStore } from '@store/authStore';

/**
 * Controller hook para gerenciar push notifications
 * Segue o padrão do projeto: business logic centralizada em controllers
 */
export default function usePushNotificationController() {
  const { token: authToken } = useAuthStore();
  
  const {
    token,
    isRegistered,
    isLoading,
    notifications,
    unreadCount,
    initialize,
    registerForNotifications,
    unregisterFromNotifications,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    updateUnreadCount,
    reset
  } = usePushNotificationStore();

  /**
   * Inicializar push notifications quando app abre
   */
  useEffect(() => {
    initialize(authToken || undefined);
  }, []);

  /**
   * Registrar no servidor quando usuário faz login
   */
  useEffect(() => {
    if (authToken && token && !isRegistered) {
      registerForNotifications(authToken);
    }
  }, [authToken, token, isRegistered]);

  /**
   * Limpar quando usuário faz logout
   */
  useEffect(() => {
    if (!authToken && isRegistered) {
      // Note: precisaríamos do token anterior para unregister
      // Por isso é importante fazer isso no logout handler
      reset();
    }
  }, [authToken, isRegistered]);

  /**
   * Força registro manual (para casos especiais)
   */
  const handleForceRegister = async (): Promise<boolean> => {
    if (!authToken) {
      console.warn('Cannot register: user not authenticated');
      return false;
    }
    
    return await registerForNotifications(authToken);
  };

  /**
   * Faz logout limpo (remove token do servidor)
   */
  const handleLogout = async (): Promise<void> => {
    if (authToken && isRegistered) {
      await unregisterFromNotifications(authToken);
    }
    reset();
  };

  /**
   * Recarrega notificações
   */
  const handleRefreshNotifications = async (): Promise<void> => {
    if (!authToken) return;
    
    await fetchNotifications(authToken, 1);
    await updateUnreadCount(authToken);
  };

  /**
   * Carrega mais notificações (paginação)
   */
  const handleLoadMoreNotifications = async (page: number): Promise<void> => {
    if (!authToken) return;
    
    await fetchNotifications(authToken, page);
  };

  /**
   * Marca notificação como lida
   */
  const handleMarkAsRead = async (notificationId: string): Promise<void> => {
    if (!authToken) return;
    
    await markAsRead(authToken, notificationId);
  };

  /**
   * Marca todas como lidas
   */
  const handleMarkAllAsRead = async (): Promise<void> => {
    if (!authToken) return;
    
    await markAllAsRead(authToken);
  };

  /**
   * Status de configuração das push notifications
   */
  const getStatus = () => {
    if (!token) return 'not_available';
    if (!authToken) return 'not_authenticated';
    if (!isRegistered) return 'not_registered';
    return 'active';
  };

  /**
   * Mensagem de status para o usuário
   */
  const getStatusMessage = () => {
    switch (getStatus()) {
      case 'not_available':
        return 'Push notifications não disponíveis neste dispositivo';
      case 'not_authenticated':
        return 'Faça login para receber notificações';
      case 'not_registered':
        return 'Registrando dispositivo...';
      case 'active':
        return 'Notificações ativas';
      default:
        return 'Status desconhecido';
    }
  };

  return {
    // Estado
    token,
    isRegistered,
    isLoading,
    notifications,
    unreadCount,
    status: getStatus(),
    statusMessage: getStatusMessage(),
    
    // Ações
    forceRegister: handleForceRegister,
    logout: handleLogout,
    refreshNotifications: handleRefreshNotifications,
    loadMoreNotifications: handleLoadMoreNotifications,
    markAsRead: handleMarkAsRead,
    markAllAsRead: handleMarkAllAsRead,
    
    // Helpers
    hasNotifications: notifications.length > 0,
    hasUnreadNotifications: unreadCount > 0,
    isActive: getStatus() === 'active'
  };
}