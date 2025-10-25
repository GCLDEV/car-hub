import React from 'react'
import { HStack } from '@components/ui/hstack'
import { Box } from '@components/ui/box'
import { Text } from '@components/ui/text'
import { Pressable } from '@components/ui/pressable'
import { ArrowLeft, ShareNetwork, DotsThreeVertical } from 'phosphor-react-native'

import { colors } from '@theme/colors'
import { SafeAreaView } from 'react-native-safe-area-context'

interface GlobalHeaderProps {
  title?: string
  showBackButton?: boolean
  showShareButton?: boolean
  showOptionsButton?: boolean
  onBackPress?: () => void
  onSharePress?: () => void
  onOptionsPress?: () => void
  transparent?: boolean
}

export default function GlobalHeader({ 
  title,
  showBackButton = false,
  showShareButton = false,
  showOptionsButton = false,
  onBackPress,
  onSharePress,
  onOptionsPress,
  transparent = false
}: GlobalHeaderProps) {
  return (
    <SafeAreaView 
      className={`${transparent ? 'absolute top-0 left-0 right-0 z-10' : ''}`}
      style={{
        backgroundColor: transparent ? 'transparent' : colors.neutral[900],
      }}
      edges={['top']}
    >
      <HStack 
        className="justify-between items-center px-4 py-3"
        style={{ minHeight: 56 }}
      >
        {/* Botão esquerdo */}
        {showBackButton && onBackPress ? (
          <Pressable
            onPress={onBackPress}
            className="w-10 h-10 rounded-full justify-center items-center"
            style={{ backgroundColor: transparent ? colors.alpha.black[60] : colors.neutral[800] }}
          >
            <ArrowLeft size={20} color={colors.neutral[50]} weight="bold" />
          </Pressable>
        ) : (
          <Box className="w-10 h-10" />
        )}
        
        {/* Título central */}
        <Box className="flex-1 justify-center items-center">
          {title && (
            <Box 
              className="px-4 py-2 rounded-full"
              style={{ 
                backgroundColor: transparent ? colors.alpha.black[60] : 'transparent'
              }}
            >
              <Text className="text-white font-semibold text-base text-center">
                {title}
              </Text>
            </Box>
          )}
        </Box>
        
        {/* Botão direito */}
        {showShareButton && onSharePress ? (
          <Pressable
            onPress={onSharePress}
            className="w-10 h-10 rounded-full justify-center items-center"
            style={{ backgroundColor: transparent ? colors.alpha.black[60] : colors.neutral[800] }}
          >
            <ShareNetwork size={20} color={colors.neutral[50]} weight="regular" />
          </Pressable>
        ) : showOptionsButton && onOptionsPress ? (
          <Pressable
            onPress={onOptionsPress}
            className="w-10 h-10 rounded-full justify-center items-center"
            style={{ backgroundColor: transparent ? colors.alpha.black[60] : colors.neutral[800] }}
          >
            <DotsThreeVertical size={20} color={colors.neutral[50]} weight="regular" />
          </Pressable>
        ) : (
          <Box className="w-10 h-10" />
        )}
      </HStack>
    </SafeAreaView>
  )
}