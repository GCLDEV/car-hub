import React, { ReactElement, useState } from 'react'
import { Pressable, ScrollView } from 'react-native'
import { Controller, Control, FieldError } from 'react-hook-form'
import { CaretDown } from 'phosphor-react-native'

import { VStack } from '@components/ui/vstack'
import { HStack } from '@components/ui/hstack'
import { Text } from '@components/ui/text'

import { colors } from '@theme/colors'

interface SelectOption {
  label: string
  value: string
}

interface AuthSelectProps {
  label: string
  name: string
  control: Control<any>
  placeholder?: string
  icon?: ReactElement
  options: SelectOption[]
  error?: FieldError
  disabled?: boolean
  className?: string
}

export default function AuthSelect({
  label,
  name,
  control,
  placeholder = 'Selecione...',
  icon,
  options,
  error,
  disabled = false,
  className = ''
}: AuthSelectProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <VStack space="sm" className={className}>
          {/* Label */}
          <Text 
            className="text-sm font-medium"
            style={{ color: colors.neutral[200] }}
          >
            {label}
          </Text>

          {/* Select Container */}
          <VStack space="sm">
            <Pressable
              onPress={() => !disabled && setIsOpen(!isOpen)}
              disabled={disabled}
            >
              <HStack
                className={`h-12 px-4 rounded-xl border items-center justify-between ${
                  error ? 'border-red-500' : 'border-neutral-700'
                } ${disabled ? 'opacity-50' : ''}`}
                style={{ 
                  backgroundColor: colors.neutral[800],
                  borderColor: error ? colors.error[500] : colors.neutral[700]
                }}
                space="sm"
              >
                <HStack className="flex-1 items-center" space="sm">
                  {icon && icon}
                  <Text 
                    className="flex-1 text-base"
                    style={{ 
                      color: value ? colors.neutral[100] : colors.neutral[400] 
                    }}
                  >
                    {value ? options.find(opt => opt.value === value)?.label : placeholder}
                  </Text>
                </HStack>
                <CaretDown 
                  size={20} 
                  color={colors.neutral[400]} 
                  style={{ 
                    transform: [{ rotate: isOpen ? '180deg' : '0deg' }] 
                  }}
                />
              </HStack>
            </Pressable>

            {/* Options List */}
            {isOpen && (
              <VStack 
                className="border border-neutral-700 rounded-xl overflow-hidden"
                style={{ 
                  backgroundColor: colors.neutral[800],
                  maxHeight: 200
                }}
              >
                <ScrollView 
                  showsVerticalScrollIndicator={true}
                  nestedScrollEnabled={true}
                  style={{ 
                    maxHeight: 200
                  }}
                  contentContainerStyle={{
                    flexGrow: 1
                  }}
                >
                  {options.map((option, index) => (
                    <Pressable
                      key={option.value}
                      onPress={() => {
                        onChange(option.value)
                        setIsOpen(false)
                      }}
                      className={`p-4 ${
                        index !== options.length - 1 ? 'border-b border-neutral-700' : ''
                      }`}
                      style={({ pressed }) => ({
                        backgroundColor: pressed 
                          ? colors.neutral[700] 
                          : value === option.value 
                            ? colors.neutral[700]
                            : 'transparent'
                      })}
                    >
                      <Text 
                        className="text-base"
                        style={{ 
                          color: value === option.value 
                            ? '#F1C40F'
                            : colors.neutral[100] 
                        }}
                      >
                        {option.label}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </VStack>
            )}
          </VStack>

          {/* Error Message */}
          {error && (
            <Text 
              className="text-xs"
              style={{ color: colors.error[500] }}
            >
              {error.message}
            </Text>
          )}
        </VStack>
      )}
    />
  )
}