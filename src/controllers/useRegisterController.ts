import { useState } from 'react'
import { useRouter } from 'expo-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import Toast from 'react-native-toast-message'

import { useAuthStore } from '@store/authStore'
import { registerUser } from '@/services/api/auth'
import { registerSchema, type RegisterFormData, formatPhoneNumber } from '@/utils/validation'
import type { RegisterRequest } from '@/types'

export default function useRegisterController() {
  const router = useRouter()
  const { login } = useAuthStore()
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  // Configuração do React Hook Form com Zod
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      location: '',
      isDealer: false,
      acceptTerms: false
    },
    mode: 'onChange' // Validação em tempo real
  })

  // Mutation para registro
  const registerMutation = useMutation({
    mutationFn: async (data: RegisterRequest) => {
      return await registerUser(data)
    },
    onSuccess: (response) => {
      // Fazer login automático após registro
      login(response.user, response.token)
      
      Toast.show({
        type: 'success',
        text1: 'Conta criada com sucesso!',
        text2: `Bem-vindo, ${response.user.name}!`
      })
      
      // Navegar para a home
      router.replace('/(tabs)/home')
    },
    onError: (error: Error) => {
      Toast.show({
        type: 'error',
        text1: 'Erro ao criar conta',
        text2: error.message || 'Tente novamente'
      })
    }
  })

  const handleRegister = form.handleSubmit(async (data) => {
    try {
      // Transformar dados do formulário para o formato da API
      const registerData: RegisterRequest = {
        name: data.name.trim(),
        email: data.email.toLowerCase().trim(),
        password: data.password,
        phone: data.phone || '',
        location: data.location || '',
        isDealer: data.isDealer || false
      }
      
      await registerMutation.mutateAsync(registerData)
    } catch (error) {
      // Erro já tratado no onError da mutation
    }
  })

  const handleLogin = () => {
    router.push('/auth/login')
  }

  const toggleShowPassword = () => {
    setShowPassword(prev => !prev)
  }

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(prev => !prev)
  }

  // Formatação automática do telefone
  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value)
    form.setValue('phone', formatted, { shouldValidate: true })
  }

  // Validação de email em tempo real
  const validateEmailAvailability = async (email: string) => {
    // TODO: Implementar verificação de email disponível
    // Por enquanto, retorna true
    return true
  }

  return {
    // React Hook Form
    control: form.control,
    handleSubmit: form.handleSubmit,
    errors: form.formState.errors,
    
    // Estados locais
    loading: registerMutation.isPending,
    showPassword,
    showConfirmPassword,
    
    // Ações
    onSubmit: () => {
      handleRegister()
    },
    handleLogin,
    toggleShowPassword,
    toggleShowConfirmPassword,
    
    // Utilitários (compatibilidade com versão antiga)
    form,
    formState: form.formState,
    handleRegister,
    handlePhoneChange,
    validateEmailAvailability,
    getFieldError: (fieldName: keyof RegisterFormData) => {
      return form.formState.errors[fieldName]?.message
    },
    isFieldInvalid: (fieldName: keyof RegisterFormData) => {
      return !!form.formState.errors[fieldName]
    },
    canSubmit: form.formState.isValid && !registerMutation.isPending
  }
}