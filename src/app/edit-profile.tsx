import { ScrollView, StatusBar, KeyboardAvoidingView, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Controller } from 'react-hook-form'
import { CaretLeft, X } from 'phosphor-react-native'

import { VStack } from '@components/ui/vstack'
import { HStack } from '@components/ui/hstack'
import { Text } from '@components/ui/text'
import { Pressable } from '@components/ui/pressable'
import SimpleInput from '@components/ui/SimpleInput'
import AuthButton from '@components/ui/AuthButton'
import AvatarUploader from '@components/ui/AvatarUploader'
import SwitchInput from '@components/ui/SwitchInput'

import { colors } from '@theme/colors'
import useEditProfileController from '@controllers/useEditProfileController'

export default function EditProfile() {
  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    isLoading,
    user,
    watchedValues,
    onSubmit,
    handleAvatarUpload,
    resetForm,
    goBack,
    handleDiscardChanges
  } = useEditProfileController()

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.neutral[900] }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.neutral[900]} />
      
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <VStack className="px-5 py-4 border-b border-neutral-800">
          <HStack className="justify-between items-center">
            <Pressable onPress={handleDiscardChanges} className="p-2 -ml-2">
              <CaretLeft size={24} color={colors.neutral[100]} weight="bold" />
            </Pressable>
            
            <Text className="text-neutral-100 text-lg font-semibold">
              Edit Profile
            </Text>
            
            {isDirty && (
              <Pressable onPress={resetForm} className="p-2 -mr-2">
                <X size={20} color={colors.neutral[400]} />
              </Pressable>
            )}
            
            {!isDirty && <VStack className="w-6" />}
          </HStack>
        </VStack>

        <ScrollView 
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          <VStack className="p-4 gap-5">
            {/* Avatar Section */}
            <VStack className="gap-3 items-center">
              <Text className="text-neutral-100 text-base font-semibold">
                Profile Photo
              </Text>
              
              <Controller
                control={control}
                name="avatar"
                render={({ field: { onChange, value } }) => (
                  <AvatarUploader
                    value={value}
                    onValueChange={(uri) => {
                      if (uri) {
                        // Apenas atualizar o form com o URI local para preview
                        onChange(uri)
                        // O upload real será feito quando escolher a imagem
                        handleAvatarUpload(uri)
                      } else {
                        onChange(uri)
                      }
                    }}
                    userName={user?.name || 'User'}
                    placeholder="Add Profile Photo"
                    error={errors.avatar?.message}
                  />
                )}
              />
            </VStack>

            {/* Personal Information Section */}
            <VStack className="gap-3">
              <Text className="text-neutral-100 text-base font-semibold">
                Personal Information
              </Text>
              
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <SimpleInput
                    label="Full Name"
                    placeholder="Enter your full name"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.name?.message}
                    autoCapitalize="words"
                  />
                )}
              />



              <Controller
                control={control}
                name="phone"
                render={({ field: { onChange, onBlur, value } }) => (
                  <SimpleInput
                    label="Phone Number"
                    placeholder="(11) 99999-9999"
                    value={value || ''}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.phone?.message}
                    keyboardType="phone-pad"
                  />
                )}
              />
            </VStack>

            {/* Location Section */}
            <VStack className="gap-3">
              <Text className="text-neutral-100 text-base font-semibold">
                Location
              </Text>
              
              <Controller
                control={control}
                name="location"
                render={({ field: { onChange, onBlur, value } }) => (
                  <SimpleInput
                    label="Location"
                    placeholder="São Paulo, SP, Brazil"
                    value={value || ''}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.location?.message}
                    autoCapitalize="words"
                  />
                )}
              />

              <Controller
                control={control}
                name="cityState"
                render={({ field: { onChange, onBlur, value } }) => (
                  <SimpleInput
                    label="City, State"
                    placeholder="São Paulo, SP"
                    value={value || ''}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.cityState?.message}
                    autoCapitalize="words"
                  />
                )}
              />
            </VStack>

            {/* Account Type Section */}
            <VStack className="gap-3">
              <Text className="text-neutral-100 text-base font-semibold">
                Account Type
              </Text>
              
              <Controller
                control={control}
                name="isDealer"
                render={({ field: { onChange, value } }) => (
                  <SwitchInput
                    label="Dealer Account"
                    subtitle="Enable to access dealer features and analytics"
                    value={value || false}
                    onValueChange={onChange}
                    error={errors.isDealer?.message}
                  />
                )}
              />
            </VStack>

          </VStack>
        </ScrollView>

        {/* Footer Buttons */}
        <VStack className="p-4 border-t border-neutral-800 bg-neutral-900">
          <AuthButton
            title="Save Changes"
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            disabled={!isDirty}
          />
          
          <Text className="text-neutral-500 text-xs text-center mt-2">
            Changes are saved to your profile
          </Text>
        </VStack>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}