import { useState } from 'react'
import { useRouter } from 'expo-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import Toast from 'react-native-toast-message'

import { useAuthStore } from '@store/authStore'
import { login as loginAPI } from '@services/api/auth'
import { loginSchema, type LoginFormData } from '@/utils/validation'
import type { LoginRequest } from '@/types'

export default function useLoginController() {
  const router = useRouter()
  const { login } = useAuthStore()
  
  const [showPassword, setShowPassword] = useState(false)
  
  // Configuração do React Hook Form com Zod
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    },
    mode: 'onChange' // Validação em tempo real
  })

  // Mutation para login
  const loginMutation = useMutation({
    mutationFn: async (data: LoginRequest) => {
      return await loginAPI(data)
    },
    onSuccess: (response) => {
      // Fazer login no store
      login(response.user, response.token)
      
      Toast.show({
        type: 'success',
        text1: 'Login realizado com sucesso!',
        text2: `Bem-vindo de volta, ${response.user.name}!`
      })
      
      // Navegar para a home
      router.replace('/(tabs)/home')
    },
    onError: (error: Error) => {
      Toast.show({
        type: 'error',
        text1: 'Erro ao fazer login',
        text2: error.message || 'Verifique suas credenciais'
      })
    }
  })



  const handleLogin = form.handleSubmit(async (data) => {
    console.log('🚀 handleLogin chamado com dados:', data)
    try {
      // Transformar dados do formulário para o formato da API
      const loginData: LoginRequest = {
        email: data.email.toLowerCase().trim(),
        password: data.password
      }
      
      console.log('📤 Enviando dados para API:', loginData)
      await loginMutation.mutateAsync(loginData)
    } catch (error) {
      // Erro já tratado no onError da mutation
      console.error('❌ Erro no login:', error)
    }
  })

  const handleForgotPassword = () => {
    Toast.show({
      type: 'info',
      text1: 'Recuperação de senha',
      text2: 'Funcionalidade em desenvolvimento'
    })
  }

  const handleRegister = () => {
    router.push('/auth/register')
  }

  const toggleShowPassword = () => {
    setShowPassword(prev => !prev)
  }

  return {
    // React Hook Form
    control: form.control,
    handleSubmit: form.handleSubmit,
    errors: form.formState.errors,
    
    // Estados locais
    loading: loginMutation.isPending,
    showPassword,
    
    // Ações
    onSubmit: () => {
      console.log('🔥 onSubmit chamado!')
      console.log('📋 Valores do formulário:', form.getValues())
      console.log('❌ Erros de validação:', form.formState.errors)
      console.log('✅ Formulário válido:', form.formState.isValid)
      handleLogin()
    },
    handleLogin,
    handleForgotPassword,
    handleRegister,
    toggleShowPassword
  }
}