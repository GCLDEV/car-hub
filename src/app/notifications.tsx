import React from 'react';
import { View } from 'react-native';
import { VStack } from '@components/ui/vstack';
import { Text } from '@components/ui/text';
import { HStack } from '@components/ui/hstack';
import { Badge, BadgeText } from '@components/ui/badge';
import { ScrollView } from '@components/ui/scroll-view';
import { Pressable } from '@components/ui/pressable';
import { RefreshControl } from 'react-native';
import { Bell, ChatCircle } from 'phosphor-react-native';

import usePushNotificationController from '@controllers/usePushNotificationController';
import { colors } from '@theme/colors';

export default function NotificationsScreen() {
  const {
    notifications,
    unreadCount,
    isLoading,
    refreshNotifications,
    markAsRead,
    markAllAsRead,
    hasNotifications,
    statusMessage
  } = usePushNotificationController();

  const handleNotificationPress = async (notification: any) => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }
    
    // Navegar para tela específica baseada no tipo
    if (notification.data?.conversationId) {
      // router.push(`/chat/conversation/${notification.data.conversationId}`);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = diff / (1000 * 60 * 60);
    
    if (hours < 1) {
      return 'agora há pouco';
    } else if (hours < 24) {
      return `${Math.floor(hours)}h atrás`;
    } else {
      return date.toLocaleDateString('pt-BR');
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message_from_buyer':
      case 'message_from_seller':
        return <ChatCircle size={20} color={colors.primary[500]} weight="fill" />;
      default:
        return <Bell size={20} color={colors.neutral[500]} />;
    }
  };

  return (
    <VStack className="flex-1 bg-neutral-900">
      {/* Header */}
      <HStack className="justify-between items-center p-4 bg-neutral-800">
        <Text className="text-white text-lg font-semibold">Notificações</Text>
        {unreadCount > 0 && (
          <Pressable onPress={markAllAsRead}>
            <Text className="text-primary-500 text-sm">Marcar todas como lidas</Text>
          </Pressable>
        )}
      </HStack>

      {/* Status */}
      <View className="px-4 py-2">
        <Text className="text-neutral-400 text-sm">{statusMessage}</Text>
      </View>

      {/* Lista de notificações */}
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refreshNotifications}
            tintColor={colors.primary[500]}
          />
        }
      >
        {hasNotifications ? (
          <VStack className="p-4 space-y-3">
            {notifications.map((notification) => (
              <Pressable
                key={notification.id}
                onPress={() => handleNotificationPress(notification)}
              >
                <HStack className={`p-4 rounded-xl space-x-3 ${
                  notification.isRead ? 'bg-neutral-800' : 'bg-neutral-700 border-l-4 border-primary-500'
                }`}>
                  {/* Ícone */}
                  <View className="mt-1">
                    {getNotificationIcon(notification.type)}
                  </View>

                  {/* Conteúdo */}
                  <VStack className="flex-1 space-y-1">
                    <HStack className="justify-between items-start">
                      <Text className={`font-semibold ${
                        notification.isRead ? 'text-neutral-300' : 'text-white'
                      }`}>
                        {notification.title}
                      </Text>
                      
                      <HStack className="items-center space-x-2">
                        <Text className="text-neutral-400 text-xs">
                          {formatDate(notification.sentAt)}
                        </Text>
                        {!notification.isRead && (
                          <Badge size="sm" variant="solid" action="info">
                            <BadgeText>Nova</BadgeText>
                          </Badge>
                        )}
                      </HStack>
                    </HStack>

                    <Text className={`text-sm ${
                      notification.isRead ? 'text-neutral-400' : 'text-neutral-200'
                    }`}>
                      {notification.body}
                    </Text>

                    {/* Informações extras */}
                    {notification.data?.carTitle && (
                      <Text className="text-primary-400 text-xs">
                        📱 {notification.data.carTitle}
                      </Text>
                    )}

                    {notification.sender && (
                      <Text className="text-neutral-500 text-xs">
                        De: {notification.sender.username}
                      </Text>
                    )}
                  </VStack>
                </HStack>
              </Pressable>
            ))}
          </VStack>
        ) : (
          <View className="flex-1 justify-center items-center p-8">
            <Bell size={48} color={colors.neutral[600]} />
            <Text className="text-neutral-500 text-center mt-4">
              Nenhuma notificação ainda
            </Text>
            <Text className="text-neutral-600 text-center text-sm mt-2">
              Você receberá notificações sobre mensagens de compradores e vendedores aqui
            </Text>
          </View>
        )}
      </ScrollView>
    </VStack>
  );
}