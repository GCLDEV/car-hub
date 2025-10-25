import React, { ReactNode } from 'react'
import { ScrollView, Pressable, KeyboardAvoidingView, Platform } from 'react-native'
import { SafeAreaView } from '@components/ui/safe-area-view'
import { ArrowLeft } from 'phosphor-react-native'

import { VStack } from '@components/ui/vstack'
import { HStack } from '@components/ui/hstack'
import { Text } from '@components/ui/text'
import { Box } from '@components/ui/box'
import { Center } from '@components/ui/center'

import { colors } from '@theme/colors'

interface AuthLayoutProps {
  title: string
  subtitle?: string
  onBack: () => void
  children: ReactNode
}

export default function AuthLayout({
  title,
  subtitle,
  onBack,
  children
}: AuthLayoutProps) {
  return (
    <SafeAreaView 
      className="flex-1"
      style={{ backgroundColor: colors.neutral[900] }}
    >
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {/* Header */}
          <VStack className="px-4 pt-2 pb-0">
            <HStack className="items-center justify-between mb-8">
              <Pressable 
                onPress={onBack}
                className="w-10 h-10 items-center justify-center rounded-full"
                style={{ backgroundColor: colors.alpha.white[10] }}
              >
                <ArrowLeft size={20} color={colors.neutral[100]} />
              </Pressable>
              
              <Text 
                className="text-lg font-semibold"
                style={{ color: colors.neutral[100] }}
              >
                {title}
              </Text>
              
              <Box className="w-10" />
            </HStack>
          </VStack>

          {/* Content - Centralizado */}
          <Center className="flex-1 px-6 pb-8">
            {/* Card com glassmorphism */}
            <VStack 
              className="w-full max-w-sm rounded-2xl p-8"
              space="lg"
              style={{
                backgroundColor: colors.alpha.white[5],
                borderWidth: 1,
                borderColor: colors.alpha.white[10],
                backdropFilter: 'blur(20px)'
              }}
            >
              {/* Welcome Text */}
              {subtitle && (
                <VStack space="md" className="mb-2">
                  <Text 
                    className="text-base leading-6 text-center"
                    style={{ color: colors.neutral[400] }}
                  >
                    {subtitle}
                  </Text>
                </VStack>
              )}

              {/* Content */}
              {children}
            </VStack>
          </Center>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}