import React from 'react'
import { MagnifyingGlass, Car, Binoculars } from 'phosphor-react-native'
import { VStack } from './vstack'
import { Box } from './box'
import { Text } from './text'
import { colors } from '@theme/colors'

interface EmptyStateProps {
  title?: string
  message?: string
  icon?: string
  fullScreen?: boolean
}

const getIconComponent = (iconName: string) => {
  const iconProps = { size: 48, color: colors.neutral[500], weight: 'thin' as const }
  
  switch (iconName) {
    case '🔍':
      return <MagnifyingGlass {...iconProps} />
    case '🚗':
      return <Car {...iconProps} />
    case '👀':
      return <Binoculars {...iconProps} />
    default:
      return <MagnifyingGlass {...iconProps} />
  }
}

export default function EmptyState({ 
  title = 'Nenhum resultado encontrado',
  message = 'Tente ajustar os filtros ou busque por outros termos.',
  icon = '🔍',
  fullScreen = true
}: EmptyStateProps) {
  return (
    <VStack 
      className={`${fullScreen ? 'flex-1' : ''} justify-center items-center p-8`}
      space="lg"
      style={{ backgroundColor: fullScreen ? colors.neutral[900] : 'transparent' }}
    >
      {/* Container do ícone com glassmorphism */}
      <Box 
        className="p-8 rounded-3xl items-center justify-center"
        style={{
          backgroundColor: colors.neutral[800] + '60',
          backdropFilter: 'blur(10px)',
          minWidth: 120,
          minHeight: 120,
        }}
      >
        {getIconComponent(icon)}
      </Box>
      
      {/* Mensagem estilizada */}
      <VStack className="items-center max-w-xs" space="xs">
        <Text 
          className="text-lg font-semibold text-center"
          style={{ color: colors.neutral[50] }}
        >
          {title}
        </Text>
        <Text 
          className="text-base text-center leading-6"
          style={{ color: colors.neutral[400] }}
        >
          {message}
        </Text>
      </VStack>
    </VStack>
  )
}