import React, { useState } from 'react'
import { Alert, Platform } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { 
  Camera, 
  User,
  X,
  Image as ImageIcon
} from 'phosphor-react-native'

import { VStack } from '@components/ui/vstack'
import { HStack } from '@components/ui/hstack'
import { Box } from '@components/ui/box'
import { Text } from '@components/ui/text'
import { Pressable } from '@components/ui/pressable'
import { Image } from '@components/ui/image'
import { Avatar, AvatarFallbackText, AvatarImage } from '@components/ui/avatar'

import { useModalStore } from '@store/modalStore'
import { colors } from '@theme/colors'

interface AvatarUploaderProps {
  value?: string
  onValueChange: (imageUri: string | undefined) => void
  placeholder?: string
  userName?: string
  error?: string
}

export default function AvatarUploader({
  value,
  onValueChange,
  placeholder = "Add photo",
  userName = "User",
  error
}: AvatarUploaderProps) {
  const [loading, setLoading] = useState(false)
  const { setModal } = useModalStore()

  // Solicitar permissões
  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert(
          'Permission required',
          'We need camera roll permissions to upload photos.'
        )
        return false
      }
    }
    return true
  }

  const handlePickImage = async () => {
    const hasPermission = await requestPermissions()
    if (!hasPermission) return

    setLoading(true)

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], // Square aspect ratio for avatars
        quality: 0.8,
        exif: false
      })

      if (!result.canceled && result.assets[0]) {
        onValueChange(result.assets[0].uri)
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image')
    } finally {
      setLoading(false)
    }
  }

  const handleTakePhoto = async () => {
    const hasPermission = await requestPermissions()
    if (!hasPermission) return

    // Request camera permissions
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync()
    if (cameraStatus !== 'granted') {
      Alert.alert(
        'Permission required',
        'We need camera permissions to take photos.'
      )
      return
    }

    setLoading(true)

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1], // Square aspect ratio
        quality: 0.8,
        exif: false
      })

      if (!result.canceled && result.assets[0]) {
        onValueChange(result.assets[0].uri)
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo')
    } finally {
      setLoading(false)
    }
  }

  const showImagePicker = () => {
    setModal({
      type: 'options',
      title: 'Select Photo',
      options: [
        {
          title: 'Take Photo',
          action: handleTakePhoto,
          variant: 'primary'
        },
        {
          title: 'Choose from Library', 
          action: handlePickImage,
          variant: 'secondary'
        }
      ]
    })
  }

  const removeImage = () => {
    setModal({
      type: 'confirm',
      title: 'Remove Profile Photo',
      confirmText: 'Remove',
      cancelText: 'Cancel',
      isDestructive: true,
      action: () => onValueChange(undefined)
    })
  }

  return (
    <VStack className="items-center gap-3">
      {/* Avatar Display */}
      <Box className="relative">
        <Avatar size="2xl">
          {value ? (
            <AvatarImage source={{ uri: value }} />
          ) : (
            <AvatarFallbackText>{userName}</AvatarFallbackText>
          )}
        </Avatar>
        
        {/* Remove button if image exists */}
        {value && (
          <Pressable
            onPress={removeImage}
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full items-center justify-center"
            style={{ backgroundColor: colors.error[500] }}
          >
            <X size={12} color={colors.neutral[100]} weight="bold" />
          </Pressable>
        )}
        
        {/* Add/Edit button */}
        <Pressable
          onPress={showImagePicker}
          className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full items-center justify-center border-2"
          style={{ 
            backgroundColor: colors.accent[500],
            borderColor: colors.neutral[900]
          }}
          disabled={loading}
        >
          <Camera size={16} color={colors.neutral[900]} weight="bold" />
        </Pressable>
      </Box>

      {/* Action text */}
      <Pressable onPress={showImagePicker} disabled={loading}>
        <Text 
          className="text-sm font-medium"
          style={{ color: colors.accent[500] }}
        >
          {loading ? 'Loading...' : (value ? 'Change Photo' : placeholder)}
        </Text>
      </Pressable>

      {/* Error message */}
      {error && (
        <Text className="text-xs text-center" style={{ color: colors.error[500] }}>
          {error}
        </Text>
      )}
    </VStack>
  )
}