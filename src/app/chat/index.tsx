import React from 'react'
import { FlatList, RefreshControl } from 'react-native'
import { router } from 'expo-router'
import { 
  ChatCircle,
  CarProfile,
  Clock,
  CheckCircle,
  ArrowLeft,
  ArrowLeftIcon
} from 'phosphor-react-native'

import { SafeAreaView } from '@components/ui/safe-area-view'
import { VStack } from '@components/ui/vstack'
import { HStack } from '@components/ui/hstack'
import { Text } from '@components/ui/text'
import { Pressable } from '@components/ui/pressable'
import { Avatar, AvatarImage, AvatarFallbackText } from '@components/ui/avatar'
import { Badge, BadgeText } from '@components/ui/badge'
import { Box } from '@components/ui/box'
import LoadingState from '@components/ui/LoadingState'
import EmptyState from '@components/ui/EmptyState'

import { colors } from '@theme/colors'
import useChatController from '../../controllers/useChatController'
import { Conversation } from '@/types/chat'

interface ConversationItemProps {
  conversation: Conversation
  onPress: () => void
}

function ConversationItem({ conversation, onPress }: ConversationItemProps) {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    } else {
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
    }
  }

  const getOtherParticipant = () => {
    // Log para debug - ver estrutura real da conversa
    
    // Usar dados reais da conversa (casting temporário)
    const conv = conversation as any
    if (conv.otherUser) {
      return {
        name: conv.otherUser.username || 'Usuário',
        avatar: undefined // Sem avatar por enquanto
      }
    }
    
    // Fallback se não tiver otherUser
    return {
      name: 'Usuário', 
      avatar: undefined
    }
  }

  const otherUser = getOtherParticipant()

  return (
    <Pressable
      onPress={onPress}
      className="p-4 border-b"
      style={{ borderBottomColor: colors.neutral[800] }}
    >
      <HStack space="md" className="items-center">
        {/* Avatar */}
        <Box className="relative">
          <Avatar size="lg">
            {otherUser.avatar ? (
              <AvatarImage source={{ uri: otherUser.avatar }} />
            ) : (
              <AvatarFallbackText>{otherUser.name}</AvatarFallbackText>
            )}
          </Avatar>
          
          {/* Status online */}
          <Box
            className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2"
            style={{ 
              backgroundColor: colors.success[500],
              borderColor: colors.neutral[900]
            }}
          />
        </Box>

        {/* Conteúdo da conversa */}
        <VStack className="flex-1" space="xs">
          <HStack className="justify-between items-center">
            <Text className="text-white font-semibold text-base">
              {otherUser.name}
            </Text>
            <Text className="text-neutral-400 text-sm">
              {formatTime(conversation.updatedAt)}
            </Text>
          </HStack>

          {/* Carro relacionado (se houver) */}
          {conversation.car && (
            <HStack space="xs" className="items-center mb-1">
              <CarProfile size={14} color={colors.accent[500]} />
              <Text 
                className="text-accent-500 text-white text-sm font-medium" 
                numberOfLines={1}
              >
                {conversation.car.title}
              </Text>
            </HStack>
          )}

          {/* Última mensagem */}
          <HStack className="justify-between items-center">
            <Text
              className="text-neutral-300 text-sm flex-1"
              numberOfLines={1}
            >
              {conversation.lastMessage?.content || 'Conversa iniciada'}
            </Text>
            
            <HStack space="xs" className="items-center">
              {/* Status de leitura - só mostrar se há última mensagem */}
              {conversation.lastMessage && (
                <CheckCircle 
                  size={16} 
                  color={conversation.lastMessage.isRead ? colors.accent[500] : colors.neutral[500]}
                  weight={conversation.lastMessage.isRead ? 'fill' : 'regular'}
                />
              )}
              
              {/* Badge de não lidas */}
              {conversation.unreadCount > 0 && (
                <Badge 
                  size="sm" 
                  variant="solid"
                  style={{ backgroundColor: colors.accent[500] }}
                >
                  <BadgeText className="text-neutral-900 font-bold">
                    {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
                  </BadgeText>
                </Badge>
              )}
            </HStack>
          </HStack>
        </VStack>
      </HStack>
    </Pressable>
  )
}

export default function ChatScreen() {
  const {
    conversations,
    isLoading,
    error,
    handleRefresh,
    handleConversationPress
  } = useChatController()

  if (isLoading && conversations.length === 0) {
    return <LoadingState />
  }

  // Se houver erro e não há conversas em cache
  if (error && conversations.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.neutral[900] }}>
        <EmptyState
          icon="ChatCircle"
          title="Erro ao carregar conversas"
          message="Verifique sua conexão e tente novamente"
        />
      </SafeAreaView>
    )
  }



  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.neutral[900] }}>
      <VStack className="flex-1">
        {/* Header */}
        <HStack className="justify-between items-center p-4 pb-2">
          <Pressable onPress={() => router.back()}>
            <ArrowLeftIcon size={24} color={colors.neutral[100]} weight="bold" />
          </Pressable>
          <Text className="text-white text-xl font-bold">Messages</Text>
          <Box className="flex-row items-center">
            <ChatCircle size={24} color={colors.accent[500]} />
          </Box>
        </HStack>

        {/* Lista de conversas */}
        <FlatList
          data={conversations as any}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ConversationItem
              conversation={item}
              onPress={() => handleConversationPress(item)}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={handleRefresh}
              tintColor={colors.accent[500]}
            />
          }
          ListEmptyComponent={
            <EmptyState
              icon="ChatCircle"
              title="No conversations yet"
              message="Start chatting with sellers to see your conversations here"
            />
          }
          showsVerticalScrollIndicator={false}
        />
      </VStack>
    </SafeAreaView>
  )
}