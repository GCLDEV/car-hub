import React, { useState } from 'react'
import { Alert, Platform } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { 
  Camera, 
  Image as ImageIcon, 
  X, 
  Plus 
} from 'phosphor-react-native'

import { VStack } from '@components/ui/vstack'
import { HStack } from '@components/ui/hstack'
import { Box } from '@components/ui/box'
import { Text } from '@components/ui/text'
import { Pressable } from '@components/ui/pressable'
import { Image } from '@components/ui/image'
import { ScrollView } from '@components/ui/scroll-view'

import { colors } from '@theme/colors'

interface ImageUploaderProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  multiple?: boolean
  maxImages?: number
  placeholder?: string
  label?: string
  required?: boolean
  error?: string
}

export default function ImageUploader({
  images,
  onImagesChange,
  multiple = true,
  maxImages = 10,
  placeholder = "Adicionar fotos",
  label,
  required = false,
  error
}: ImageUploaderProps) {
  const [loading, setLoading] = useState(false)

  // Solicitar permissões
  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert(
          'Permissão necessária',
          'É preciso permitir acesso à galeria para adicionar fotos.'
        )
        return false
      }
    }
    return true
  }

  // Abrir seletor de imagem
  const pickImage = async () => {
    try {
      setLoading(true)
      
      const hasPermission = await requestPermissions()
      if (!hasPermission) return

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: multiple,
        quality: 0.8,
        aspect: [16, 9],
        allowsEditing: !multiple, // Só permite edição se For imagem única
      })

      if (!result.canceled) {
        if (multiple) {
          // Múltiplas imagens
          const newImages = result.assets.map(asset => asset.uri)
          const allImages = [...images, ...newImages]
          
          // Limitar ao máximo de imagens
          if (allImages.length > maxImages) {
            Alert.alert(
              'Limite excedido', 
              `Você pode adicionar no máximo ${maxImages} fotos.`
            )
            onImagesChange(allImages.slice(0, maxImages))
          } else {
            onImagesChange(allImages)
          }
        } else {
          // Imagem única
          onImagesChange([result.assets[0].uri])
        }
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível selecionar a imagem.')
    } finally {
      setLoading(false)
    }
  }

  // Tirar foto com câmera
  const takePhoto = async () => {
    try {
      setLoading(true)
      
      const { status } = await ImagePicker.requestCameraPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert(
          'Permissão necessária',
          'É preciso permitir acesso à câmera para tirar fotos.'
        )
        return
      }

      const result = await ImagePicker.launchCameraAsync({
        quality: 0.8,
        aspect: [16, 9],
        allowsEditing: true,
      })

      if (!result.canceled) {
        if (multiple) {
          const allImages = [...images, result.assets[0].uri]
          if (allImages.length > maxImages) {
            Alert.alert(
              'Limite excedido', 
              `Você pode adicionar no máximo ${maxImages} fotos.`
            )
            return
          }
          onImagesChange(allImages)
        } else {
          onImagesChange([result.assets[0].uri])
        }
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível tirar a foto.')
    } finally {
      setLoading(false)
    }
  }

  // Remover imagem
  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onImagesChange(newImages)
  }

  // Mostrar opções de adicionar imagem
  const showImageOptions = () => {
    Alert.alert(
      'Adicionar Foto',
      'Escolha uma opção:',
      [
        { text: 'Galeria', onPress: pickImage },
        { text: 'Câmera', onPress: takePhoto },
        { text: 'Cancelar', style: 'cancel' }
      ]
    )
  }

  const canAddMore = multiple ? images.length < maxImages : images.length === 0

  return (
    <VStack className="w-full">
      {/* Label */}
      {label && (
        <HStack className="mb-2">
          <Text className="text-neutral-100 font-medium">
            {label}
          </Text>
          {required && (
            <Text className="text-error-500 ml-1">*</Text>
          )}
        </HStack>
      )}

      {/* Imagens */}
      {images.length > 0 && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          className="mb-4"
        >
          <HStack className="gap-3">
            {images.map((imageUri, index) => (
              <Box key={index} className="relative">
                <Image
                  source={{ uri: imageUri }}
                  className="w-20 h-20 rounded-lg"
                  alt={`Imagem ${index + 1}`}
                />
                
                {/* Botão remover */}
                <Pressable
                  onPress={() => removeImage(index)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-error-500 rounded-full items-center justify-center"
                >
                  <X size={12} color={colors.neutral[100]} weight="bold" />
                </Pressable>
              </Box>
            ))}
          </HStack>
        </ScrollView>
      )}

      {/* Botão Adicionar */}
      {canAddMore && (
        <Pressable
          onPress={showImageOptions}
          disabled={loading}
          className={`
            w-full h-32 border-2 border-dashed rounded-xl
            items-center justify-center
            ${error 
              ? 'border-error-500 bg-error-500/10' 
              : 'border-neutral-600 bg-neutral-800/50'
            }
            ${loading ? 'opacity-50' : ''}
          `}
        >
          <VStack className="items-center gap-2">
            {loading ? (
              <Text className="text-neutral-400">
                Carregando...
              </Text>
            ) : (
              <>
                <Box className="w-12 h-12 bg-neutral-700 rounded-full items-center justify-center">
                  {images.length === 0 ? (
                    <ImageIcon size={24} color={colors.neutral[400]} />
                  ) : (
                    <Plus size={24} color={colors.neutral[400]} />
                  )}
                </Box>
                
                <VStack className="items-center">
                  <Text className="text-neutral-100 font-medium">
                    {images.length === 0 ? placeholder : 'Adicionar mais'}
                  </Text>
                  
                  {multiple && (
                    <Text className="text-neutral-400 text-sm">
                      {images.length}/{maxImages} fotos
                    </Text>
                  )}
                  
                  <HStack className="gap-2 mt-1">
                    <HStack className="items-center gap-1">
                      <ImageIcon size={14} color={colors.neutral[500]} />
                      <Text className="text-neutral-500 text-xs">Galeria</Text>
                    </HStack>
                    <HStack className="items-center gap-1">
                      <Camera size={14} color={colors.neutral[500]} />
                      <Text className="text-neutral-500 text-xs">Câmera</Text>
                    </HStack>
                  </HStack>
                </VStack>
              </>
            )}
          </VStack>
        </Pressable>
      )}

      {/* Mensagem de erro */}
      {error && (
        <Text className="text-error-500 text-sm mt-2">
          {error}
        </Text>
      )}

      {/* Limite atingido */}
      {multiple && images.length >= maxImages && (
        <Text className="text-neutral-400 text-sm mt-2 text-center">
          Limite de {maxImages} fotos atingido
        </Text>
      )}
    </VStack>
  )
}