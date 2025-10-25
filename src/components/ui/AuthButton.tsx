import React, { ReactElement } from 'react'

import { HStack } from '@components/ui/hstack'
import { Button, ButtonText } from '@components/ui/button'
import { Spinner } from '@components/ui/spinner'

import { colors } from '@theme/colors'

interface AuthButtonProps {
  title: string
  onPress: () => void
  loading?: boolean
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'outline'
  loadingText?: string
  icon?: ReactElement
  className?: string
}

export default function AuthButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  loadingText,
  icon,
  className = ''
}: AuthButtonProps) {
  const getButtonStyle = () => {
    switch (variant) {
      case 'primary':
        return { backgroundColor: '#F1C40F' }
      case 'secondary':
        return { backgroundColor: colors.neutral[700] }
      case 'outline':
        return { 
          backgroundColor: 'transparent', 
          borderColor: colors.neutral[600],
          borderWidth: 1
        }
      default:
        return { backgroundColor: '#F1C40F' }
    }
  }

  const getTextColor = () => {
    switch (variant) {
      case 'primary':
        return colors.neutral[900]
      case 'secondary':
      case 'outline':
        return colors.neutral[100]
      default:
        return colors.neutral[900]
    }
  }

  return (
    <Button
      onPress={onPress}
      disabled={disabled || loading}
      size="lg"
      className={`rounded-xl h-14 w-full ${className}`}
      style={getButtonStyle()}
    >
      {loading ? (
        <HStack className="items-center" space="sm">
          <Spinner 
            color={colors.neutral[900]} 
            size="small" 
          />
          <ButtonText 
            className="font-semibold text-base"
            style={{ color: colors.neutral[900] }}
          >
            {loadingText || 'Loading...'}
          </ButtonText>
        </HStack>
      ) : (
        <HStack className="items-center" space="sm">
          {icon && icon}
          <ButtonText 
            className="font-semibold text-base"
            style={{ color: colors.neutral[900] }}
          >
            {title}
          </ButtonText>
        </HStack>
      )}
    </Button>
  )
}