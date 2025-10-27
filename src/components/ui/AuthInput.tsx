import React, { ReactElement } from 'react'
import { Pressable, TextInput } from 'react-native'
import { Control, Controller, FieldError } from 'react-hook-form'

import { VStack } from '@components/ui/vstack'
import { HStack } from '@components/ui/hstack'
import { Text } from '@components/ui/text'
import { Box } from '@components/ui/box'

import { colors } from '@theme/colors'

interface AuthInputProps {
  label: string
  placeholder: string
  icon: ReactElement
  name: string
  control: Control<any>
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad'
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters'
  autoCorrect?: boolean
  secureTextEntry?: boolean
  rightIcon?: ReactElement
  onRightIconPress?: () => void
  error?: FieldError
}

export default function AuthInput({
  label,
  placeholder,
  icon,
  name,
  control,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  autoCorrect = true,
  secureTextEntry = false,
  rightIcon,
  onRightIconPress,
  error
}: AuthInputProps) {
  return (
    <VStack space="sm">
      <Text 
        className="text-sm font-medium"
        style={{ color: colors.neutral[300] }}
      >
        {label}
      </Text>
      <Box 
        className="rounded-xl border h-14"
        style={{ 
          backgroundColor: colors.alpha.white[5],
          borderColor: error ? colors.error[500] : colors.alpha.white[10],
        }}
      >
        <HStack className="items-center px-4 h-full">
          <Box className="mr-3">
            {icon}
          </Box>
          <Controller
            control={control}
            name={name}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={placeholder}
                placeholderTextColor={colors.neutral[500]}
                keyboardType={keyboardType}
                autoCapitalize={autoCapitalize}
                autoCorrect={autoCorrect}
                secureTextEntry={secureTextEntry}
                style={{ 
                  color: colors.neutral[100],
                  fontSize: 16,
                  flex: 1,
                  paddingVertical: 0,
                  backgroundColor: 'transparent'
                }}
              />
            )}
          />
          {rightIcon && (
            <Pressable 
              onPress={onRightIconPress}
              className="ml-2 p-1"
            >
              {rightIcon}
            </Pressable>
          )}
        </HStack>
      </Box>
      {error && (
        <Text 
          className="text-xs"
          style={{ color: colors.error[500] }}
        >
          {error.message}
        </Text>
      )}
    </VStack>
  )
}