import React, { useRef, useEffect } from 'react'
import { FlatList, RefreshControl, KeyboardAvoidingView, Platform, TextInput } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { VStack } from '@components/ui/vstack'
import { HStack } from '@components/ui/hstack'
import { Box } from '@components/ui/box'
import { Text } from '@components/ui/text'
import { Pressable } from '@components/ui/pressable'
import { Image } from '@components/ui/image'
import { Avatar, AvatarFallbackText } from '@components/ui/avatar'

import LoadingState from '@components/ui/LoadingState'
import TypingIndicator from '@components/ui/TypingIndicator'
import { colors } from '@theme/colors'
import { 
  ArrowLeft, 
  PaperPlaneTilt,
  CheckCircle
} from 'phosphor-react-native'

import useConversationController from '@controllers/useConversationController'

interface MessageItemProps {
  message: {
    id: string
    content: string
    senderId: string
    isRead: boolean
    createdAt: string
    type: 'text' | 'image' | 'system'
  }
  isOwn: boolean
  showAvatar?: boolean
}

interface MessageItemProps {
  message: {
    id: string
    content: string
    senderId: string
    isRead: boolean
    createdAt: string
    type: 'text' | 'image' | 'system'
  }
  isOwn: boolean
  showAvatar?: boolean
  otherUserName?: string // Nome do outro usuário para o avatar
}

function MessageItem({ message, isOwn, showAvatar, otherUserName }: MessageItemProps) {

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  // Para mensagens próprias (lado direito)
  if (isOwn) {
    return (
      <VStack className="mb-3 px-4 items-end">
        <VStack className="items-end" style={{ maxWidth: '75%' }}>
          <Box
            className="px-4 py-3 rounded-xl"
            style={{ 
              backgroundColor: colors.accent[500],
              borderBottomRightRadius: 8,
            }}
          >
            <Text 
              className="text-sm leading-5 font-medium text-neutral-900"
              style={{ 
                flexShrink: 1,
                flexWrap: 'wrap',
              }}
              numberOfLines={undefined}
            >
              {message.content}
            </Text>
          </Box>
          
          <HStack className="mt-1 items-center" space="xs">
            <Text className="text-xs text-neutral-500">
              {formatTime(message.createdAt)}
            </Text>
            
            <CheckCircle 
              size={12} 
              color={message.isRead ? colors.accent[500] : colors.neutral[500]}
              weight="fill"
            />
          </HStack>
        </VStack>
      </VStack>
    )
  }

  // Para mensagens recebidas (lado esquerdo)
  return (
    <HStack className="mb-3 px-4 items-start" space="sm">
      {showAvatar ? (
        <Avatar size="sm" className="border-2 border-accent-500">
          <AvatarFallbackText 
            className="text-white font-bold text-xs bg-accent-600"
          >
            {otherUserName?.charAt(0).toUpperCase() || 'U'}
          </AvatarFallbackText>
        </Avatar>
      ) : (
        <Box className="w-8" />
      )}

      <VStack className="items-start" style={{ maxWidth: '75%' }}>
        <Box
          className="px-4 py-3 bg-neutral-800 rounded-xl"
          style={{ 
            borderBottomLeftRadius: 8,
          }}
        >
          <Text 
            className="text-sm leading-5 font-medium text-neutral-100"
            style={{ 
              flexShrink: 1,
              flexWrap: 'wrap',
            }}
            numberOfLines={undefined}
          >
            {message.content}
          </Text>
        </Box>
        
        <Text className="text-xs mt-1 text-neutral-500">
          {formatTime(message.createdAt)}
        </Text>
      </VStack>
    </HStack>
  )
}

function ConversationHeader({ 
  conversation, 
  onGoBack, 
  connected, 
  isTyping,
  otherUserOnline,
  otherUserInConversation
}: { 
  conversation: any, 
  onGoBack: () => void,
  connected: boolean,
  isTyping: boolean,
  otherUserOnline?: boolean,
  otherUserInConversation?: boolean
}) {
  const getStatusText = () => {
    if (isTyping) return 'digitando...'
    if (otherUserInConversation) return 'visualizando'
    if (otherUserOnline) return 'online'
    return 'offline'
  }

  const getStatusColor = () => {
    if (isTyping) return colors.accent[400]
    if (otherUserInConversation) return colors.primary[500]
    if (otherUserOnline) return colors.success[500]
    return colors.neutral[400]
  }

  const getStatusIcon = () => {
    if (isTyping) return '⌨️'
    if (otherUserInConversation) return '👁️'
    if (otherUserOnline) return '🟢'
    return '⚪'
  }

  return (
    <HStack 
      className="justify-between items-center px-4 py-3 border-b bg-neutral-900"
      style={{ 
        borderBottomColor: colors.neutral[800]
      }}
    >
      <HStack className="flex-1 items-center" space="md">
        <Pressable onPress={onGoBack}>
          <ArrowLeft size={24} color="#ffffff" />
        </Pressable>
        
        <Box className="w-10 h-10 rounded-full bg-neutral-700 justify-center items-center">
          <Text className="text-white font-semibold">
            {conversation?.otherUser?.username?.[0]?.toUpperCase() || 'U'}
          </Text>
        </Box>
        
        <VStack className="flex-1">
          <Text className="text-white font-semibold text-base">
            {conversation?.otherUser?.username || 'Usuario'}
          </Text>
          <Text 
            className="text-xs"
            style={{ color: getStatusColor() }}
          >
            {getStatusIcon()} {getStatusText()}
          </Text>
        </VStack>
      </HStack>
    </HStack>
  )
}

function MessageInput({ 
  inputMessage, 
  setInputMessage, 
  onSendMessage, 
  loading,
  onFocus 
}: { 
  inputMessage: string,
  setInputMessage: (text: string) => void,
  onSendMessage: () => void, 
  loading: boolean,
  onFocus?: () => void
}) {
  const handleSend = () => {
    if (inputMessage.trim() && !loading) {
      onSendMessage()
    }
  }

  return (
    <HStack 
      className="px-4 py-4 items-end bg-neutral-900"
      style={{ 
        borderTopWidth: 1,
        borderTopColor: colors.neutral[800],
        // Sombra para separar visualmente
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 8,
      }}
      space="md"
    >
      <Box className="flex-1">
        <TextInput
          placeholder="Digite sua mensagem..."
          value={inputMessage}
          onChangeText={setInputMessage}
          onFocus={onFocus}
          multiline
          maxLength={500}
          className="bg-neutral-800"
          style={{
            borderColor: inputMessage.trim() ? colors.accent[500] : colors.neutral[700],
            borderRadius: 22,
            paddingHorizontal: 18,
            paddingVertical: 12,
            maxHeight: 120,
            minHeight: 44,
            color: colors.neutral[100],
            borderWidth: 2,
            fontSize: 16,
            // Sombra sutil
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
          }}
          placeholderTextColor={colors.neutral[400]}
          onSubmitEditing={handleSend}
          returnKeyType="send"
          blurOnSubmit={false}
        />
      </Box>
      
      <Pressable
        onPress={handleSend}
        disabled={!inputMessage.trim() || loading}
        className="w-11 h-11 rounded-full justify-center items-center"
        style={{
          backgroundColor: inputMessage.trim() && !loading ? colors.accent[500] : colors.neutral[700],
          transform: [{ scale: inputMessage.trim() ? 1 : 0.9 }],
        }}
      >
        <PaperPlaneTilt 
          size={22} 
          color={inputMessage.trim() && !loading ? colors.neutral[900] : colors.neutral[500]}
          weight={inputMessage.trim() ? "fill" : "regular"}
        />
      </Pressable>
    </HStack>
  )
}

export default function ConversationScreen() {
  const flatListRef = useRef<FlatList>(null)
  
  const {
    conversation,
    messages,
    loading,
    sending,
    inputMessage,
    setInputMessage,
    handleGoBack,
    handleSendMessage,
    handleRefresh,
    currentUserId,
    // 🆕 WebSocket features
    connected,
    isTyping,
    userTyping,
    // 🆕 Presença e visualização
    otherUserOnline,
    otherUserInConversation
  } = useConversationController()

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true })
      }, 100)
    }
  }, [messages.length, messages])

  // Scroll to bottom when keyboard opens
  const scrollToBottom = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true })
    }, 100)
  }



  if (loading && !conversation) {
    return <LoadingState />
  }

  return (
    <SafeAreaView 
      className="flex-1"
      style={{ backgroundColor: colors.neutral[900] }}
      edges={['top']}
    >
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <VStack className="flex-1">
          {/* Header */}
          <ConversationHeader 
            conversation={conversation}
            onGoBack={handleGoBack}
            connected={connected ?? false}
            isTyping={isTyping ?? false}
            otherUserOnline={otherUserOnline}
            otherUserInConversation={otherUserInConversation}
          />

          {/* Car Info Card - TODO: Implementar quando tiver dados da conversa */}
          {false && (
            <Box 
              className="mx-4 mt-3 p-3 rounded-xl border"
              style={{ 
                backgroundColor: colors.neutral[800],
                borderColor: colors.neutral[700]
              }}
            >
              <Text className="text-white text-sm">Informações do carro aqui</Text>
            </Box>
          )}

          {/* Messages List */}
          <Box className="flex-1">
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(item, index) => {
                // Usar ID único e estável para evitar re-renders
                if (item.id && !item.id.toString().startsWith('temp-')) {
                  // Usar ID real do servidor
                  return item.id.toString()
                } else {
                  // Para mensagens temporárias, usar conteúdo + timestamp para chave única
                  return `msg-${index}-${item.content?.slice(0, 10)}-${item.createdAt}`
                }
              }}
              renderItem={({ item, index }) => {
                // Convert both to strings for comparison
                const itemSenderId = item.senderId?.toString()
                const currentUserIdStr = currentUserId?.toString()
                const isOwn = itemSenderId === currentUserIdStr

                return (
                  <MessageItem 
                    message={item}
                    isOwn={isOwn}
                    showAvatar={
                      index === 0 || 
                      messages[index - 1]?.senderId !== item.senderId
                    }
                    otherUserName={conversation?.otherUser?.username}
                  />
                )
              }}
              contentContainerStyle={{
                paddingTop: 16,
                paddingBottom: 16,
                flexGrow: 1,
                justifyContent: messages.length > 0 ? 'flex-end' : 'center',
              }}
              refreshControl={
                <RefreshControl
                  refreshing={loading}
                  onRefresh={handleRefresh}
                  tintColor={colors.accent[500]}
                />
              }
              showsVerticalScrollIndicator={true}
              style={{ 
                backgroundColor: 'transparent'
              }}
              className="flex-1"
              ListFooterComponent={() => (
                <TypingIndicator 
                  visible={isTyping ?? false}
                  userName={conversation?.otherUser?.username}
                />
              )}
              ListEmptyComponent={() => (
                <Box className="flex-1 justify-center items-center p-8">
                  <Text className="text-neutral-400 text-center">
                    Inicie uma conversa enviando uma mensagem
                  </Text>
                </Box>
              )}
              onContentSizeChange={scrollToBottom}
              onLayout={scrollToBottom}
              removeClippedSubviews={false}
              windowSize={50}
              maxToRenderPerBatch={20}
              updateCellsBatchingPeriod={50}
              initialNumToRender={20}
            />
          </Box>

          {/* Message Input */}
          <MessageInput 
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            onSendMessage={handleSendMessage}
            loading={sending}
            onFocus={scrollToBottom}
          />
        </VStack>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}