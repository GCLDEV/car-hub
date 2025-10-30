import { useState } from 'react'
import { useRouter } from 'expo-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import Toast from 'react-native-toast-message'
import { z } from 'zod'

import { useAuthStore } from '@store/authStore'
import { useModalStore } from '@store/modalStore'

// Schema de validação para edição de perfil
const editProfileSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  location: z.string().optional(),
  cityState: z.string().optional(),
  isDealer: z.boolean().optional(),
  avatar: z.string().optional() // URL da imagem após upload
})

export type EditProfileFormData = z.infer<typeof editProfileSchema>

export default function useEditProfileController() {
  const router = useRouter()
  const { user, updateProfile } = useAuthStore()
  const { setModal } = useModalStore()
  
  const [isLoading, setIsLoading] = useState(false)

  // Configuração do React Hook Form com Zod
  const form = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      location: user?.location || '',
      cityState: user?.cityState || '',
      isDealer: user?.isDealer || false,
      avatar: user?.avatar || ''
    },
    mode: 'onChange'
  })

  function goBack() {
    router.back()
  }

  function handleDiscardChanges() {
    const isDirty = form.formState.isDirty
    
    if (isDirty) {
      setModal({
        type: 'confirm',
        title: 'Discard changes?',
        confirmText: 'Discard',
        cancelText: 'Keep Editing',
        isDestructive: true,
        action: () => {
          form.reset()
          router.back()
        }
      })
    } else {
      router.back()
    }
  }

  async function onSubmit(data: EditProfileFormData) {
    setIsLoading(true)
    
    try {
      // Simular API call - substituir por chamada real posteriormente
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Se houver avatar local, simular upload (substituir por chamada real)
      let finalData = { ...data }
      if (data.avatar && data.avatar.startsWith('file://')) {
        // Mock upload - em produção, fazer upload real e obter URL
        finalData.avatar = `https://api.example.com/uploads/avatars/${Date.now()}.jpg`
      }
      
      // Atualizar user no store
      updateProfile(finalData)
      
      Toast.show({
        type: 'success',
        text1: 'Profile updated',
        text2: 'Your changes have been saved successfully'
      })
      
      form.reset(finalData) // Reset form state but keep new values
      router.back()
      
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Failed to update profile',
        text2: error.message || 'Please try again'
      })
    } finally {
      setIsLoading(false)
    }
  }

  function resetForm() {
    setModal({
      type: 'confirm',
      title: 'Reset all changes?',
      confirmText: 'Reset',
      cancelText: 'Cancel',
      action: () => {
        form.reset({
          name: user?.name || '',
          email: user?.email || '',
          phone: user?.phone || '',
          location: user?.location || '',
          cityState: user?.cityState || '',
          isDealer: user?.isDealer || false,
          avatar: user?.avatar || ''
        })
        
        Toast.show({
          type: 'info',
          text1: 'Form reset',
          text2: 'All changes have been discarded'
        })
      }
    })
  }

  const { control, handleSubmit, formState, reset, watch } = form
  const watchedValues = watch()

  return {
    // Form
    control,
    handleSubmit,
    formState,
    reset,
    watchedValues,
    
    // States
    isLoading,
    user,
    
    // Actions
    onSubmit,
    resetForm,
    goBack,
    handleDiscardChanges
  }
}