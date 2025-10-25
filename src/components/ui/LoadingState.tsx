import React from 'react'
import { ActivityIndicator } from 'react-native'
import { VStack } from './vstack'
import { Box } from './box'
import { Text } from './text'
import { colors } from '@theme/colors'

interface LoadingStateProps {
  message?: string
  size?: 'small' | 'large'
  fullScreen?: boolean
}

export default function LoadingState({ 
  message = 'Carregando...', 
  size = 'large',
  fullScreen = true
}: LoadingStateProps) {
  return (
    <VStack 
      className={`${fullScreen ? 'flex-1' : ''} justify-center items-center p-8`}
      space="lg"
      style={{ backgroundColor: fullScreen ? colors.neutral[900] : 'transparent' }}
    >
      {/* Container do loading com glassmorphism */}
      <Box 
        className="p-8 rounded-3xl items-center justify-center"
        style={{
          backgroundColor: colors.neutral[800] + '80',
          backdropFilter: 'blur(10px)',
          minWidth: 120,
          minHeight: 120
        }}
      >
        <ActivityIndicator 
          size={size} 
          color={colors.accent[500]} // Dourado para combinar com o tema
        />
      </Box>
      
      {/* Mensagem estilizada */}
      <VStack className="items-center" space="xs">
        <Text 
          className="text-lg font-semibold text-center"
          style={{ color: colors.neutral[50] }}
        >
          {message}
        </Text>
        <Text 
          className="text-sm text-center opacity-70"
          style={{ color: colors.neutral[400] }}
        >
          Aguarde um momento
        </Text>
      </VStack>
    </VStack>
  )
}