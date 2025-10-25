import React from 'react'
import { Warning } from 'phosphor-react-native'
import { VStack } from './vstack'
import { Box } from './box'
import { Text } from './text'
import { Button, ButtonText } from './button'
import { colors } from '@theme/colors'

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
  retryText?: string
  fullScreen?: boolean
}

export default function ErrorState({ 
  message = 'Algo deu errado. Tente novamente.', 
  onRetry,
  retryText = 'Tentar Novamente',
  fullScreen = true
}: ErrorStateProps) {
  return (
    <VStack 
      className={`${fullScreen ? 'flex-1' : ''} justify-center items-center p-8`}
      space="lg"
      style={{ backgroundColor: fullScreen ? colors.neutral[900] : 'transparent' }}
    >
      {/* Container do erro com glassmorphism */}
      <Box 
        className="p-8 rounded-3xl items-center justify-center"
        style={{
          backgroundColor: colors.neutral[800] + '80',
          backdropFilter: 'blur(10px)',
          minWidth: 160,
        }}
      >
        <Warning size={48} color={colors.error[500]} weight="fill" />
      </Box>
      
      {/* Mensagem estilizada */}
      <VStack className="items-center max-w-sm" space="xs">
        <Text 
          className="text-lg font-semibold text-center"
          style={{ color: colors.neutral[50] }}
        >
          Oops! Algo deu errado
        </Text>
        <Text 
          className="text-base text-center leading-6"
          style={{ color: colors.neutral[400] }}
        >
          {message}
        </Text>
      </VStack>

      {/* Botão de retry moderno */}
      {onRetry && (
        <Button 
          className="px-6 py-3 rounded-2xl min-w-40"
          style={{ backgroundColor: colors.accent[500] }}
          onPress={onRetry}
        >
          <ButtonText 
            className="font-semibold"
            style={{ color: colors.neutral[900] }}
          >
            {retryText}
          </ButtonText>
        </Button>
      )}
    </VStack>
  )
}