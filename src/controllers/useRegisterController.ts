import { useState } from 'react'
import { useRouter } from 'expo-router'
import Toast from 'react-native-toast-message'

import { useAuthStore } from '@store/authStore'

interface RegisterFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export default function useRegisterController() {
  const router = useRouter()
  const { login } = useAuthStore()

  const [form, setForm] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const formValue = (field: keyof RegisterFormData) => {
    return form[field]
  }

  const changeForm = (value: string, field: keyof RegisterFormData) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    if (!form.name.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Nome é obrigatório'
      })
      return false
    }

    if (!form.email.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Email é obrigatório'
      })
      return false
    }

    if (!form.password.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Senha é obrigatória'
      })
      return false
    }

    if (form.password !== form.confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Senhas não conferem'
      })
      return false
    }

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email)) {
      Toast.show({
        type: 'error',
        text1: 'Email inválido'
      })
      return false
    }

    // Validação de senha mínima
    if (form.password.length < 6) {
      Toast.show({
        type: 'error',
        text1: 'Senha deve ter pelo menos 6 caracteres'
      })
      return false
    }

    return true
  }

  const handleRegister = async () => {
    if (!validateForm()) return

    setLoading(true)

    try {
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Por enquanto, vamos simular um registro bem-sucedido
      const newUser = {
        id: '2',
        name: form.name,
        email: form.email,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
      }

      login(newUser, 'mock-jwt-token')

      Toast.show({
        type: 'success',
        text1: 'Conta criada com sucesso!',
        text2: `Bem-vindo, ${newUser.name}!`
      })

      // Navegar para a home
      router.replace('/(tabs)/home')

    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao criar conta',
        text2: error?.message || 'Tente novamente'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = () => {
    router.push('/auth/login')
  }

  const toggleShowPassword = () => {
    setShowPassword(prev => !prev)
  }

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(prev => !prev)
  }

  return {
    form,
    loading,
    showPassword,
    showConfirmPassword,
    formValue,
    changeForm,
    handleRegister,
    handleLogin,
    toggleShowPassword,
    toggleShowConfirmPassword
  }
}