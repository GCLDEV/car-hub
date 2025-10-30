import React from 'react'
import { Switch } from 'react-native'

import { VStack } from '@components/ui/vstack'
import { HStack } from '@components/ui/hstack'
import { Text } from '@components/ui/text'

import { colors } from '@theme/colors'

interface SwitchInputProps {
  label: string
  subtitle?: string
  value: boolean
  onValueChange: (value: boolean) => void
  error?: string
  disabled?: boolean
}

export default function SwitchInput({
  label,
  subtitle,
  value,
  onValueChange,
  error,
  disabled = false
}: SwitchInputProps) {
  return (
    <VStack className="gap-2">
      <HStack className="justify-between items-center py-2">
        <VStack className="flex-1 mr-4">
          <Text className="text-neutral-400 text-sm font-medium">
            {label}
          </Text>
          {subtitle && (
            <Text className="text-neutral-500 text-xs mt-1">
              {subtitle}
            </Text>
          )}
        </VStack>
        
        <Switch
          value={value}
          onValueChange={onValueChange}
          disabled={disabled}
          trackColor={{
            false: colors.neutral[700],
            true: colors.accent[500]
          }}
          thumbColor={value ? colors.neutral[100] : colors.neutral[400]}
          ios_backgroundColor={colors.neutral[700]}
        />
      </HStack>
      
      {error && (
        <Text className="text-xs" style={{ color: colors.error[500] }}>
          {error}
        </Text>
      )}
    </VStack>
  )
}