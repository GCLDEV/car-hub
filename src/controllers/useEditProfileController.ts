import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { router } from 'expo-router'
import Toast from 'react-native-toast-message'

import { useAuthStore } from '@store/authStore'
import { useModalStore } from '@store/modalStore'
import { uploadImage } from '@services/api/upload'
import { updateUserProfile } from '@services/api/auth'
import { UpdateProfileRequest } from '@/types'

// Schema de validação
const profileSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  phone: z.string().min(1, 'Telefone é obrigatório'),
  location: z.string().min(1, 'Localização é obrigatória'),
  cityState: z.string().min(1, 'Cidade/Estado é obrigatório'),
  isDealer: z.boolean(),
  avatar: z.string().optional()
})

type ProfileFormData = z.infer<typeof profileSchema>

export default function useEditProfileController() {
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const { user, updateProfile } = useAuthStore()
  const { setModal } = useModalStore()
  const queryClient = useQueryClient()

  const { control, handleSubmit, formState: { errors, isDirty }, reset, watch } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      location: user?.location || '',
      cityState: user?.cityState || '',
      isDealer: user?.isDealer || false,
      avatar: user?.avatar || ''
    }
  })

  const watchedValues = watch()

  // Mutation para atualizar perfil
  const updateProfileMutation = useMutation({
    mutationFn: (data: UpdateProfileRequest) => updateUserProfile(data),
    onSuccess: (updatedUser) => {
      // Atualizar store local
      updateProfile(updatedUser)

      // Invalidar queries relacionadas ao usuário
      queryClient.invalidateQueries({ queryKey: ['user'] })

      Toast.show({
        type: 'success',
        text1: 'Perfil atualizado!',
        text2: 'Suas informações foram salvas com sucesso.'
      })

      // Reset form state mas manter novos valores
      reset({
        name: updatedUser.name,
        phone: updatedUser.phone || '',
        location: updatedUser.location || '',
        cityState: updatedUser.cityState || '',
        isDealer: updatedUser.isDealer
      })

      // Voltar para a tela anterior
      setTimeout(() => {
        router.back()
      }, 1000)
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Erro ao atualizar',
        text2: error.message || 'Não foi possível atualizar o perfil. Tente novamente.'
      })
    }
  })

  async function onSubmit(data: ProfileFormData) {
    if (!user) return
    
    // Remover avatar do data pois ele é tratado separadamente
    const { avatar, ...profileData } = data
    
    updateProfileMutation.mutate(profileData)
  }

  async function handleAvatarUpload(imageUri: string) {
    if (!user) return

    try {
      setIsUploadingAvatar(true)
      
      // Fazer upload da imagem primeiro
      const uploadResult = await uploadImage(imageUri)
      
      if (!uploadResult?.id) {
        throw new Error('Upload da imagem falhou')
      }

      // Atualizar avatar do usuário via API usando o ID da imagem
      const updatedUser = await updateUserProfile({ 
        avatar: uploadResult.id.toString()
      })

      // Atualizar store local
      updateProfile(updatedUser)

      // Invalidar queries relacionadas ao usuário
      queryClient.invalidateQueries({ queryKey: ['user'] })

      Toast.show({
        type: 'success',
        text1: 'Foto atualizada!',
        text2: 'Sua foto de perfil foi atualizada com sucesso.'
      })

    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Erro no upload',
        text2: error.message || 'Não foi possível atualizar a foto. Tente novamente.'
      })
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  function goBack() {
    router.back()
  }

  function handleDiscardChanges() {
    if (isDirty) {
      setModal({
        type: 'confirm',
        title: 'Descartar mudanças?',
        confirmText: 'Descartar',
        cancelText: 'Continuar Editando',
        isDestructive: true,
        action: () => {
          reset()
          router.back()
        }
      })
    } else {
      router.back()
    }
  }

  function resetForm() {
    setModal({
      type: 'confirm',
      title: 'Resetar todas as mudanças?',
      confirmText: 'Resetar',
      cancelText: 'Cancelar',
      action: () => {
        reset({
          name: user?.name || '',
          phone: user?.phone || '',
          location: user?.location || '',
          cityState: user?.cityState || '',
          isDealer: user?.isDealer || false
        })
        
        Toast.show({
          type: 'info',
          text1: 'Formulário resetado',
          text2: 'Todas as mudanças foram descartadas'
        })
      }
    })
  }

  return {
    // Form
    control,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watchedValues,
    
    // States
    isLoading: updateProfileMutation.isPending || isUploadingAvatar,
    user,
    
    // Actions
    onSubmit,
    handleAvatarUpload,
    resetForm,
    goBack,
    handleDiscardChanges
  }
}