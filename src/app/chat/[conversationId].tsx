import React from 'react'
import { FlatList, RefreshControl, KeyboardAvoidingView, Platform, TextInput } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { VStack } from '@components/ui/vstack'
import { HStack } from '@components/ui/hstack'
import { Box } from '@components/ui/box'
import { Text } from '@components/ui/text'
import { Pressable } from '@components/ui/pressable'
import { Image } from '@components/ui/image'

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

function MessageItem({ message, isOwn, showAvatar }: MessageItemProps) {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <HStack 
      className={`mb-3 px-4 ${isOwn ? 'justify-end' : 'justify-start'}`}
      space="sm"
      style={{ width: '100%' }}
    >
      {!isOwn && showAvatar && (
        <Box className="w-8 h-8 rounded-full bg-neutral-700 justify-center items-center">
          <Text className="text-white text-sm font-semibold">J</Text>
        </Box>
      )}
      
      {!isOwn && !showAvatar && (
        <Box className="w-8" />
      )}

      <VStack className={`flex-1 max-w-[75%] ${isOwn ? 'items-end' : 'items-start'}`}>
        <Box
          className={`rounded-2xl px-4 py-3 ${
            isOwn 
              ? 'bg-accent-500 rounded-br-md' 
              : 'bg-neutral-700 rounded-bl-md'
          }`}
          style={{ maxWidth: '100%' }}
        >
          <Text 
            className={`text-sm leading-5 ${
              isOwn ? 'text-neutral-900' : 'text-white'
            }`}
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

function MessageInput({ onSendMessage, loading }: { onSendMessage: (text: string) => void, loading: boolean }) {
  const [message, setMessage] = React.useState('')

  const handleSend = () => {
    if (message.trim() && !loading) {
      onSendMessage(message.trim())
      setMessage('')
    }
  }

  return (
    <HStack 
      className="px-4 py-3 items-end border-t"
      style={{ 
        backgroundColor: colors.neutral[900],
        borderTopColor: colors.neutral[800]
      }}
      space="sm"
    >
      <Box className="flex-1">
        <TextInput
          placeholder="Digite sua mensagem..."
          value={message}
          onChangeText={setMessage}
          multiline
          maxLength={500}
          style={{
            backgroundColor: colors.neutral[800],
            borderColor: colors.neutral[700],
            borderRadius: 20,
            paddingHorizontal: 16,
            paddingVertical: 10,
            maxHeight: 100,
            color: '#ffffff',
            borderWidth: 1,
          }}
          placeholderTextColor={colors.neutral[500]}
          onSubmitEditing={handleSend}
          returnKeyType="send"
        />
      </Box>
      
      <Pressable
        onPress={handleSend}
        className={`w-10 h-10 rounded-full justify-center items-center ${
          message.trim() && !loading ? 'bg-accent-500' : 'bg-neutral-700'
        }`}
        disabled={!message.trim() || loading}
      >
        <PaperPlaneTilt 
          size={20} 
          color={message.trim() && !loading ? colors.neutral[900] : colors.neutral[500]}
          weight="fill"
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
    handleGoBack,
    handleSendMessage,
    handleRefresh
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

          {/* Car Info Card */}
          {conversation?.car && (
            <Box 
              className="mx-4 mt-3 p-3 rounded-xl border"
              style={{ 
                backgroundColor: colors.neutral[800],
                borderColor: colors.neutral[700]
              }}
            >
              <HStack className="items-center" space="sm">
                <Image
                  source={{ uri: conversation.car.images[0] }}
                  alt={conversation.car.title}
                  className="w-12 h-12 rounded-lg"
                  style={{ backgroundColor: colors.neutral[700] }}
                />
                <VStack className="flex-1">
                  <Text className="text-white font-semibold text-sm">
                    {conversation.car.title}
                  </Text>
                  <Text 
                    className="text-lg font-bold"
                    style={{ color: colors.accent[500] }}
                  >
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(conversation.car.price)}
                  </Text>
                </VStack>
              </HStack>
            </Box>
          )}

          {/* Messages List */}
          <VStack className="flex-1">
            <FlatList
              data={messages}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => (
                <MessageItem 
                  message={item}
                  isOwn={item.senderId === '1'} // TODO: usar ID do usuário logado
                  showAvatar={
                    index === 0 || 
                    messages[index - 1]?.senderId !== item.senderId
                  }
                />
              )}
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
            onSendMessage={handleSendMessage}
            loading={sending}
          />
        </VStack>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}