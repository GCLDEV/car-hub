import React from 'react'
import { Pressable } from 'react-native'

import { HStack } from '@components/ui/hstack'
import { Text } from '@components/ui/text'

import { colors } from '@theme/colors'

interface AuthLinkProps {
  text?: string
  linkText: string
  onPress: () => void
  align?: 'left' | 'center' | 'right'
}

export default function AuthLink({
  text,
  linkText,
  onPress,
  align = 'center'
}: AuthLinkProps) {
  const getAlignClass = () => {
    switch (align) {
      case 'left':
        return 'justify-start'
      case 'right':
        return 'justify-end'
      default:
        return 'justify-center'
    }
  }

  return (
    <HStack className={getAlignClass()}>
      {text && (
        <Text 
          className="text-base"
          style={{ color: colors.neutral[400] }}
        >
          {text}{' '}
        </Text>
      )}
      <Pressable onPress={onPress}>
        <Text 
          className="text-base font-semibold"
          style={{ color: colors.primary[400] }}
        >
          {linkText}
        </Text>
      </Pressable>
    </HStack>
  )
}