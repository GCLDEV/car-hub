import React, { useState } from 'react'
import { Platform } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import * as ImageManipulator from 'expo-image-manipulator'
import Toast from 'react-native-toast-message'
import { 
  Camera, 
  Image as ImageIcon, 
  X, 
  Plus,
  PencilSimple
} from 'phosphor-react-native'

import { VStack } from '@components/ui/vstack'
import { HStack } from '@components/ui/hstack'
import { Box } from '@components/ui/box'
import { Text } from '@components/ui/text'
import { Pressable } from '@components/ui/pressable'
import { Image } from '@components/ui/image'
import { ScrollView } from '@components/ui/scroll-view'
import { useModalStore } from '@store/modalStore'

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
  const { setModal } = useModalStore()

  // Solicitar permissões
  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== 'granted') {
        Toast.show({
          type: 'error',
          text1: 'Permissão necessária',
          text2: 'É preciso permitir acesso à galeria para adicionar fotos.'
        })
        return false
      }
    }
    return true
  }



  // Escolher uma foto e cortar diretamente
  const pickAndCropSingle = async () => {
    try {
      setLoading(true)
      
      const hasPermission = await requestPermissions()
      if (!hasPermission) return

      // Verificar limite
      if (images.length >= maxImages) {
        Toast.show({
          type: 'error',
          text1: 'Limite excedido',
          text2: `Você pode adicionar no máximo ${maxImages} fotos.`
        })
        return
      }

      // Selecionar uma imagem com corte direto
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: false,
        allowsEditing: true,
        quality: 0.8,
        aspect: [16, 9],
      })

      if (!result.canceled) {
        const allImages = [...images, result.assets[0].uri]
        onImagesChange(allImages)
        
        Toast.show({
          type: 'success',
          text1: 'Foto adicionada!',
          text2: 'Imagem cortada e adicionada com sucesso.'
        })
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Não foi possível selecionar e cortar a imagem.'
      })
    } finally {
      setLoading(false)
    }
  }

  // Substituir imagem existente
  const replaceImage = async (index: number) => {
    try {
      setLoading(true)
      
      const hasPermission = await requestPermissions()
      if (!hasPermission) return

      // Selecionar nova imagem
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: false,
        allowsEditing: true,
        quality: 0.8,
        aspect: [16, 9],
      })

      if (!result.canceled) {
        const newImages = [...images]
        newImages[index] = result.assets[0].uri
        onImagesChange(newImages)
        
        Toast.show({
          type: 'success',
          text1: 'Foto substituída!',
          text2: 'Imagem foi substituída com sucesso.'
        })
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Não foi possível substituir a imagem.'
      })
    } finally {
      setLoading(false)
    }
  }



  // Mostrar opções quando clicar em imagem existente
  const showImageEditOptions = (index: number) => {
    setModal({
      type: 'options',
      title: 'Editar Foto',
      options: [
        { 
          title: 'Substituir Imagem', 
          action: () => replaceImage(index),
          variant: 'primary'
        },
        { 
          title: 'Remover', 
          action: () => removeImage(index),
          variant: 'danger'
        }
      ]
    })
  }



  // Tirar foto com câmera
  const takePhoto = async () => {
    try {
      setLoading(true)
      
      const { status } = await ImagePicker.requestCameraPermissionsAsync()
      if (status !== 'granted') {
        Toast.show({
          type: 'error',
          text1: 'Permissão necessária',
          text2: 'É preciso permitir acesso à câmera para tirar fotos.'
        })
        return
      }

      // Verificar limite antes de tirar foto
      if (images.length >= maxImages) {
        Toast.show({
          type: 'error',
          text1: 'Limite excedido',
          text2: `Você pode adicionar no máximo ${maxImages} fotos.`
        })
        return
      }

      const result = await ImagePicker.launchCameraAsync({
        quality: 0.8,
        aspect: [16, 9],
        allowsEditing: true, // Sempre permite edição para fotos da câmera
      })

      if (!result.canceled) {
        const allImages = [...images, result.assets[0].uri]
        onImagesChange(allImages)
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Não foi possível tirar a foto.'
      })
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
    setModal({
      type: 'options',
      title: 'Adicionar Foto',
      options: [
        { 
          title: 'Escolher da Galeria', 
          action: () => pickAndCropSingle(),
          variant: 'primary'
        },
        { 
          title: 'Tirar Foto', 
          action: () => takePhoto(),
          variant: 'secondary'
        }
      ]
    })
  }

  const canAddMore = images.length < maxImages

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
                {/* Imagem clicável */}
                <Pressable 
                  onPress={() => showImageEditOptions(index)}
                  className="border-2 border-transparent rounded-lg"
                  style={({ pressed }) => ({
                    opacity: pressed ? 0.8 : 1,
                    borderColor: pressed ? colors.accent[500] : 'transparent'
                  })}
                >
                  <Image
                    source={{ uri: imageUri }}
                    className="w-20 h-20 rounded-lg"
                    alt={`Imagem ${index + 1}`}
                  />
                </Pressable>
                
                {/* Botão remover */}
                <Pressable
                  onPress={() => removeImage(index)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-error-500 rounded-full items-center justify-center"
                >
                  <X size={12} color={colors.neutral[100]} weight="bold" />
                </Pressable>
                
                {/* Indicador visual de que é clicável */}
                <Box 
                  className="absolute bottom-1 right-1 w-5 h-5 rounded-full items-center justify-center border"
                  style={{ 
                    backgroundColor: colors.neutral[900] + 'E6',
                    borderColor: colors.neutral[600],
                    opacity: 0.9 
                  }}
                >
                  <PencilSimple size={10} color={colors.accent[400]} weight="bold" />
                </Box>
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
              <Text className="text-neutral-400 font-medium">
                Processando foto...
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
                    {images.length === 0 ? 'Adicionar foto' : 'Adicionar mais uma'}
                  </Text>
                  
                  <Text className="text-neutral-400 text-sm">
                    {images.length}/{maxImages} fotos • Uma por vez
                  </Text>
                  
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
      {images.length >= maxImages && (
        <Text className="text-neutral-400 text-sm mt-2 text-center">
          Limite de {maxImages} fotos atingido
        </Text>
      )}
    </VStack>
  )
}