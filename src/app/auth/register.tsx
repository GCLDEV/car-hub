import React from 'react'
import { ScrollView, Pressable, KeyboardAvoidingView, Platform } from 'react-native'
import { SafeAreaView } from '@components/ui/safe-area-view'
import { 
  Eye, 
  EyeSlash, 
  Envelope, 
  Lock, 
  User,
  Car,
  MapPin,
  Phone,
  Check
} from 'phosphor-react-native'

import { VStack } from '@components/ui/vstack'
import { HStack } from '@components/ui/hstack'
import { Text } from '@components/ui/text'
import { Box } from '@components/ui/box'
import { Center } from '@components/ui/center'
import { Checkbox } from '@components/ui/checkbox'

import AuthInput from '@components/ui/AuthInput'
import AuthButton from '@components/ui/AuthButton'

import { colors } from '@theme/colors'
import useRegisterController from '@controllers/useRegisterController'

export default function RegisterScreen() {
  const {
    control,
    loading,
    showPassword,
    showConfirmPassword,
    errors,
    onSubmit,
    handleLogin,
    toggleShowPassword,
    toggleShowConfirmPassword
  } = useRegisterController()

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
                Create Account
              </Text>
              <Text 
                className="text-base"
                style={{ color: colors.neutral[400] }}
              >
                Join us to find your dream car
              </Text>
            </VStack>

            {/* Form */}
            <VStack space="lg" className="mb-8">
              <AuthInput
                label="Full Name"
                name="name"
                control={control}
                placeholder="Enter your full name"
                icon={<User size={20} color={colors.neutral[400]} />}
                autoCapitalize="words"
                error={errors.name}
              />

              <AuthInput
                label="Email Address"
                name="email"
                control={control}
                placeholder="your@email.com"
                icon={<Envelope size={20} color={colors.neutral[400]} />}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                error={errors.email}
              />

              <AuthInput
                label="Password"
                name="password"
                control={control}
                placeholder="Create a password"
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
                error={errors.password}
              />

              <AuthInput
                label="Confirm Password"
                name="confirmPassword"
                control={control}
                placeholder="Confirm your password"
                icon={<Lock size={20} color={colors.neutral[400]} />}
                secureTextEntry={!showConfirmPassword}
                rightIcon={
                  showConfirmPassword ? (
                    <EyeSlash size={20} color={colors.neutral[400]} />
                  ) : (
                    <Eye size={20} color={colors.neutral[400]} />
                  )
                }
                onRightIconPress={toggleShowConfirmPassword}
                error={errors.confirmPassword}
              />
            </VStack>

            {/* Sign Up Button */}
            <AuthButton
              title="Sign Up"
              onPress={() => onSubmit()}
              loading={loading}
              loadingText="Creating Account..."
              className="mb-8"
              variant="primary"
            />

            {/* Sign In Link */}
            <HStack className="justify-center">
              <Text 
                className="text-base"
                style={{ color: colors.neutral[400] }}
              >
                Already have an account?{' '}
              </Text>
              <Pressable onPress={handleLogin}>
                <Text 
                  className="text-base font-semibold"
                  style={{ color: '#F1C40F' }}
                >
                  Sign In
                </Text>
              </Pressable>
            </HStack>
          </VStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}