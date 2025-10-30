import React from 'react'
import { TextInput, TextInputProps } from 'react-native'

import { VStack } from '@components/ui/vstack'
import { Text } from '@components/ui/text'
import { Box } from '@components/ui/box'

import { colors } from '@theme/colors'

interface SimpleInputProps extends TextInputProps {
  label: string
  error?: string
  className?: string
}

export default function SimpleInput({
  label,
  error,
  className = '',
  multiline = false,
  ...props
}: SimpleInputProps) {
  return (
    <VStack className={`gap-2 ${className}`}>
      <Text className="text-neutral-400 text-sm font-medium">
        {label}
      </Text>
      
      <Box
        className={`
          rounded-xl border px-4 
          ${multiline ? 'py-3' : 'h-12'} 
          ${error ? 'border-error-500' : 'border-neutral-700'}
        `}
        style={{ 
          backgroundColor: colors.alpha.white[5],
          borderColor: error ? colors.error[500] : colors.alpha.white[10],
        }}
      >
        <TextInput
          placeholderTextColor={colors.neutral[500]}
          style={{
            color: colors.neutral[100],
            fontSize: 16,
            paddingVertical: multiline ? 0 : 8,
            textAlignVertical: multiline ? 'top' : 'center',
            minHeight: multiline ? 80 : undefined
          }}
          multiline={multiline}
          {...props}
        />
      </Box>
      
      {error && (
        <Text className="text-xs" style={{ color: colors.error[500] }}>
          {error}
        </Text>
      )}
    </VStack>
  )
}