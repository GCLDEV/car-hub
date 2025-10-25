import React from 'react'
import { HStack } from '@components/ui/hstack'
import { VStack } from '@components/ui/vstack'
import { Box } from '@components/ui/box'
import { Text } from '@components/ui/text'
import { Button } from '@components/ui/button'
import { Pressable } from '@components/ui/pressable'
import { Phone, ChatCircle } from 'phosphor-react-native'

import { colors } from '@theme/colors'

interface CarActionButtonsProps {
  onCallPress: () => void
  onChatPress: () => void
  onTestDrivePress: () => void
}

export default function CarActionButtons({
  onCallPress,
  onChatPress,
  onTestDrivePress
}: CarActionButtonsProps) {
  return (
    <Box className="px-4 pb-6 pt-4">
      <HStack space="md" className="mb-4">
        {/* Botão Ligar */}
        <Pressable 
          onPress={onCallPress}
          className="flex-1 h-14 rounded-2xl justify-center items-center"
          style={{ backgroundColor: colors.neutral[800] }}
        >
          <HStack space="sm" className="items-center">
            <Phone size={20} color={colors.neutral[300]} />
            <Text className="text-neutral-300 font-semibold">
              Call
            </Text>
          </HStack>
        </Pressable>
        
        {/* Botão Chat */}
        <Pressable 
          onPress={onChatPress}
          className="flex-1 h-14 rounded-2xl justify-center items-center"
          style={{ backgroundColor: colors.neutral[800] }}
        >
          <HStack space="sm" className="items-center">
            <ChatCircle size={20} color={colors.neutral[300]} />
            <Text className="text-neutral-300 font-semibold">
              Chat
            </Text>
          </HStack>
        </Pressable>
      </HStack>
      
      {/* Botão Test Drive */}
      <Pressable 
        onPress={onTestDrivePress}
        className="w-full h-14 rounded-2xl justify-center items-center"
        style={{ backgroundColor: colors.accent[500] }}
      >
        <Text 
          style={{ color: colors.neutral[900] }}
          className="font-bold text-lg"
        >
          Book Test Drive
        </Text>
      </Pressable>
    </Box>
  )
}