import { useState, useEffect } from 'react'
import { useRouter } from 'expo-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Toast from 'react-native-toast-message'

import { useAuthStore } from '@store/authStore'
import { useModalStore } from '@store/modalStore'
import { useUserListingsStore } from '@store/userListingsStore'
import { useInvalidateCars } from '@hooks/useOptimizedCarQuery'
import { createListingSchema, type CreateListingFormData } from '@/utils/validation'
import { carBrands } from '@/constants/carBrands'
import { carCategories } from '@/constants/carCategories'
import { fuelTypes, transmissionTypes, carColors } from '@/constants/fuelTypes'
import { createCar } from '@/services/api/cars'
import type { Car } from '@/types/car'

export default function useCreateListingController() {
  const router = useRouter()
  const { user, isAuthenticated, token } = useAuthStore()
  const { setModal } = useModalStore()
  const { fetchUserListings } = useUserListingsStore()
  const queryClient = useQueryClient()
  const { invalidateAllCars, addCarToCache } = useInvalidateCars()
  
  // Configuração do React Hook Form com Zod
  const form = useForm({
    resolver: zodResolver(createListingSchema),
    defaultValues: {
      title: '',
      brand: '',
      model: '',
      category: '',
      year: new Date().getFullYear().toString(),
      price: '',
      km: '',
      fuelType: '',
      transmission: '',
      color: '',
      description: '',
      location: '',
      doors: '',
      seats: '',
      engine: '',
      features: [] as string[],
      images: []
    },
    mode: 'onChange'
  })

  // Mutation para criar listagem
  const createListingMutation = useMutation({
    mutationFn: async (data: CreateListingFormData) => {
      return await createCar(data)
    },
    onSuccess: (response) => {
      console.log('✅ Car created successfully:', response)
      
      Toast.show({
        type: 'success',
        text1: 'Anúncio criado com sucesso!',
        text2: 'Seu veículo e fotos foram listados no marketplace'
      })
      
      // 🔄 Invalidar cache para buscar dados atualizados (mais seguro que manipular cache)
      invalidateAllCars()
      
      // 📱 Atualizar listagens do usuário (Profile)
      fetchUserListings(user?.id || '')
      
      // 🏠 Navegar para a home (onde o carro já estará visível!)
      router.replace('/(tabs)/home')
    },
    onError: (error: Error) => {
      Toast.show({
        type: 'error',
        text1: 'Erro ao criar anúncio',
        text2: error.message || 'Tente novamente'
      })
    }
  })

  const handleCreateListing = form.handleSubmit(async (data) => {
    try {
      await createListingMutation.mutateAsync(data as unknown as CreateListingFormData)
    } catch (error) {
      console.error('❌ Erro ao criar listagem:', error)
    }
  })

  // Verificar autenticação ao carregar a tela
  useEffect(() => {
    if (!isAuthenticated) {
      // Se não estiver logado, mostra modal perguntando se quer fazer login
      setModal({
        type: 'confirm',
        title: 'Você precisa estar logado para criar um anúncio. Deseja fazer login agora?',
        confirmText: 'Fazer login',
        cancelText: 'Voltar',
        action: () => {
          router.push('/auth/login')
        }
      })
    }
  }, [isAuthenticated, setModal, router])



  // Gerar título automático baseado nos dados preenchidos
  const generateTitle = () => {
    const { brand, model, year } = form.getValues()
    if (brand && model && year) {
      const title = `${brand} ${model} ${year}`
      form.setValue('title', title, { shouldValidate: true })
    }
  }

  // Formatadores
  const formatPrice = (value: string): string => {
    const numbers = value.replace(/\D/g, '')
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0
    }).format(Number(numbers))
  }

  const formatKm = (value: string): string => {
    const numbers = value.replace(/\D/g, '')
    return new Intl.NumberFormat('pt-BR').format(Number(numbers)) + ' km'
  }

  return {
    // React Hook Form
    control: form.control,
    handleSubmit: form.handleSubmit,
    errors: form.formState.errors,
    watch: form.watch,
    setValue: form.setValue,
    
    // Estados locais
    loading: createListingMutation.isPending,
    
    // Dados para selects
    carBrands,
    carCategories,
    fuelTypes,
    transmissionTypes,
    carColors,
    
    // Ações
    onSubmit: handleCreateListing,
    generateTitle,
    
    // Utilitários
    formatPrice,
    formatKm,
    getFieldError: (fieldName: keyof CreateListingFormData) => {
      return form.formState.errors[fieldName]?.message
    },
    isFieldInvalid: (fieldName: keyof CreateListingFormData) => {
      return !!form.formState.errors[fieldName]
    },
    canSubmit: form.formState.isValid && !createListingMutation.isPending
  }
}