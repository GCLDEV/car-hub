import React from 'react'
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

  return (
    <HStack 
      className="mb-3 px-4"
      space="sm"
      style={{ 
        width: '100%',
        justifyContent: isOwn ? 'flex-end' : 'flex-start' // Usar style inline
      }}
    >
      {!isOwn && showAvatar && (
        <Avatar size="sm" className="border-2 border-accent-500">
          <AvatarFallbackText 
            className="text-white font-bold text-xs"
            style={{ backgroundColor: colors.accent[600] }}
          >
            {otherUserName?.charAt(0).toUpperCase() || 'U'}
          </AvatarFallbackText>
        </Avatar>
      )}
      
      {!isOwn && !showAvatar && (
        <Box className="w-8" />
      )}

      <VStack 
        className="flex-1 max-w-[75%]"
        style={{
          alignItems: isOwn ? 'flex-end' : 'flex-start' // Usar style inline
        }}
      >
        <Box
          className="px-4 py-3"
          style={{ 
            maxWidth: '100%',
            backgroundColor: isOwn ? colors.accent[500] : colors.neutral[800], // Accent para próprias, neutro para outras
            borderRadius: 20,
            borderBottomRightRadius: isOwn ? 8 : 20,
            borderBottomLeftRadius: isOwn ? 20 : 8,
            // Sombra sutil para dar profundidade
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
          }}
        >
          <Text 
            className="text-sm leading-5 font-medium"
            style={{ 
              flexShrink: 1,
              flexWrap: 'wrap',
              color: isOwn ? colors.neutral[900] : colors.neutral[100]
            }}
            numberOfLines={undefined}
          >
            {message.content}
          </Text>
        </Box>
        
        <HStack className="mt-1 items-center" space="xs">
          <Text 
            className="text-xs" 
            style={{ color: colors.neutral[500] }}
          >
            {formatTime(message.createdAt)}
          </Text>
          
          {isOwn && (
            <CheckCircle 
              size={12} 
              color={message.isRead ? colors.accent[500] : colors.neutral[500]}
              weight="fill"
            />
          )}
        </HStack>
      </VStack>
    </HStack>
  )
}

function ConversationHeader({ conversation, onGoBack }: { conversation: any, onGoBack: () => void }) {
  return (
    <HStack 
      className="justify-between items-center px-4 py-3 border-b"
      style={{ 
        backgroundColor: colors.neutral[900],
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
            style={{ color: colors.neutral[400] }}
          >
            {conversation?.otherUser?.isOnline ? 'Online' : 'Offline'}
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
  loading 
}: { 
  inputMessage: string,
  setInputMessage: (text: string) => void,
  onSendMessage: () => void, 
  loading: boolean 
}) {
  const handleSend = () => {
    if (inputMessage.trim() && !loading) {
      onSendMessage()
    }
  }

  return (
    <HStack 
      className="px-4 py-4 items-end"
      style={{ 
        backgroundColor: colors.neutral[900],
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
          multiline
          maxLength={500}
          style={{
            backgroundColor: colors.neutral[800],
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
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: inputMessage.trim() && !loading ? colors.accent[500] : colors.neutral[700],
          // Sombra para dar destaque
          shadowColor: inputMessage.trim() ? colors.accent[500] : 'transparent',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: inputMessage.trim() ? 4 : 0,
          // Transição suave (será animada)
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
    currentUserId
  } = useConversationController()



  if (loading && !conversation) {
    return <LoadingState />
  }

  return (
    <SafeAreaView 
      style={{ flex: 1, backgroundColor: colors.neutral[900] }}
      edges={['top']}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <VStack className="flex-1">
          {/* Header */}
          <ConversationHeader 
            conversation={conversation}
            onGoBack={handleGoBack}
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
          <VStack className="flex-1">
            <FlatList
              data={messages}
              keyExtractor={(item) => item.id}
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
                paddingVertical: 16,
                flexGrow: 1,
              }}
              refreshControl={
                <RefreshControl
                  refreshing={loading}
                  onRefresh={handleRefresh}
                  tintColor={colors.accent[500]}
                />
              }
              showsVerticalScrollIndicator={false}
              style={{ flex: 1 }}
            />
          </VStack>

          {/* Message Input */}
          <MessageInput 
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            onSendMessage={handleSendMessage}
            loading={sending}
          />
        </VStack>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}