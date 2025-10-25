import React from 'react'

import { HStack } from '@components/ui/hstack'
import { Text } from '@components/ui/text'
import { Box } from '@components/ui/box'

import { colors } from '@theme/colors'

interface AuthDividerProps {
  text?: string
}

export default function AuthDivider({ text = 'ou' }: AuthDividerProps) {
  return (
    <HStack className="items-center">
      <Box 
        className="flex-1 h-px"
        style={{ backgroundColor: colors.alpha.white[10] }} 
      />
      <Text 
        className="mx-4 text-sm"
        style={{ color: colors.neutral[400] }}
      >
        {text}
      </Text>
      <Box 
        className="flex-1 h-px"
        style={{ backgroundColor: colors.alpha.white[10] }} 
      />
    </HStack>
  )
}