import React from 'react'
import { ScrollView, Pressable, KeyboardAvoidingView, Platform } from 'react-native'
import { SafeAreaView } from '@components/ui/safe-area-view'
import { 
  Eye, 
  EyeSlash, 
  Envelope, 
  Lock, 
  Car,
  MapPin
} from 'phosphor-react-native'

import { VStack } from '@components/ui/vstack'
import { HStack } from '@components/ui/hstack'
import { Text } from '@components/ui/text'
import { Box } from '@components/ui/box'
import { Center } from '@components/ui/center'

import AuthInput from '@components/ui/AuthInput'
import AuthButton from '@components/ui/AuthButton'
import AuthDivider from '@components/ui/AuthDivider'
import AuthLink from '@components/ui/AuthLink'

import { colors } from '@theme/colors'
import useLoginController from '@controllers/useLoginController'

export default function LoginScreen() {
  const {
    form,
    loading,
    showPassword,
    formValue,
    changeForm,
    handleLogin,
    handleForgotPassword,
    handleRegister,
    toggleShowPassword
  } = useLoginController()

  return (
    <SafeAreaView 
      className="flex-1"
      style={{ backgroundColor: colors.neutral[900] }}
    >
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <VStack className="flex-1 px-6 pt-12 pb-6" space="lg">
            
            {/* Car Icon */}
            <Center className="mb-8">
              <Box 
                className="w-16 h-16 rounded-2xl items-center justify-center"
                style={{ backgroundColor: '#F1C40F' }}
              >
                <Car size={32} color={colors.neutral[900]} weight="fill" />
              </Box>
            </Center>

            {/* Welcome Text */}
            <VStack space="sm" className="mb-8">
              <Text 
                className="text-4xl font-bold"
                style={{ color: colors.neutral[100] }}
              >
                Welcome Back
              </Text>
              <Text 
                className="text-base"
                style={{ color: colors.neutral[400] }}
              >
                Sign in to access your dream cars
              </Text>
            </VStack>

            {/* Form */}
            <VStack space="lg" className="mb-8">
              <AuthInput
                label="Email Address"
                value={formValue('email')}
                onChangeText={(text: string) => changeForm(text, 'email')}
                placeholder="your@email.com"
                icon={<Envelope size={20} color={colors.neutral[400]} />}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />

              <AuthInput
                label="Password"
                value={formValue('password')}
                onChangeText={(text: string) => changeForm(text, 'password')}
                placeholder="Enter your password"
                icon={<Lock size={20} color={colors.neutral[400]} />}
                secureTextEntry={!showPassword}
                rightIcon={
                  showPassword ? (
                    <EyeSlash size={20} color={colors.neutral[400]} />
                  ) : (
                    <Eye size={20} color={colors.neutral[400]} />
                  )
                }
                onRightIconPress={toggleShowPassword}
              />

              {/* Forgot Password */}
              <HStack className="justify-end">
                <Pressable onPress={handleForgotPassword}>
                  <Text 
                    className="text-sm font-medium"
                    style={{ color: '#F1C40F' }}
                  >
                    Forgot Password?
                  </Text>
                </Pressable>
              </HStack>
            </VStack>

            {/* Sign In Button */}
            <AuthButton
              title="Sign In"
              onPress={handleLogin}
              loading={loading}
              loadingText="Signing In..."
              className="mb-8"
              variant="primary"
            />

            {/* Sign Up Link */}
            <HStack className="justify-center">
              <Text 
                className="text-base"
                style={{ color: colors.neutral[400] }}
              >
                Don't have an account?{' '}
              </Text>
              <Pressable onPress={handleRegister}>
                <Text 
                  className="text-base font-semibold"
                  style={{ color: '#F1C40F' }}
                >
                  Sign Up
                </Text>
              </Pressable>
            </HStack>
          </VStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}