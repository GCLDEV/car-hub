import { useState } from 'react'
import { useRouter } from 'expo-router'
import Toast from 'react-native-toast-message'

import { useAuthStore } from '@store/authStore'
import { loginUser } from '@services/api/auth'

interface LoginFormData {
  email: string
  password: string
}

export default function useLoginController() {
  const router = useRouter()
  const { login } = useAuthStore()

  const [form, setForm] = useState<LoginFormData>({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const formValue = (field: keyof LoginFormData) => {
    return form[field]
  }

  const changeForm = (value: string, field: keyof LoginFormData) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
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

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email)) {
      Toast.show({
        type: 'error',
        text1: 'Email inválido'
      })
      return false
    }

    return true
  }

  const handleLogin = async () => {
    if (!validateForm()) return

    setLoading(true)

    try {
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Por enquanto, vamos simular um login bem-sucedido
      const mockUser = {
        id: '1',
        name: 'Gabriel Silva',
        email: form.email,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
      }

      login(mockUser)

      Toast.show({
        type: 'success',
        text1: 'Login realizado com sucesso!',
        text2: `Bem-vindo, ${mockUser.name}!`
      })

      // Navegar para a home
      router.replace('/(tabs)/home')

    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao fazer login',
        text2: error?.message || 'Tente novamente'
      })
    } finally {
      setLoading(false)
    }
  }

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
    form,
    loading,
    showPassword,
    formValue,
    changeForm,
    handleLogin,
    handleForgotPassword,
    handleRegister,
    toggleShowPassword
  }
}