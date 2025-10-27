import { useState, useEffect } from 'react'
import { useRouter } from 'expo-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import Toast from 'react-native-toast-message'

import { useAuthStore } from '@store/authStore'
import { createListingSchema, type CreateListingFormData } from '@/utils/validation'
import { carBrands, carModelsByBrand } from '@/constants/carBrands'
import { fuelTypes, transmissionTypes, carColors } from '@/constants/fuelTypes'
import { createCar } from '@/services/api/cars'
import type { Car } from '@/types/car'

export default function useCreateListingController() {
  const router = useRouter()
  const { user, isAuthenticated, token } = useAuthStore()
  
  const [selectedBrand, setSelectedBrand] = useState<string>('')
  const [availableModels, setAvailableModels] = useState<string[]>([])
  
  // Configuração do React Hook Form com Zod
  const form = useForm<CreateListingFormData>({
    resolver: zodResolver(createListingSchema),
    defaultValues: {
      title: '',
      brand: '',
      model: '',
      year: new Date().getFullYear().toString(),
      price: '',
      km: '',
      fuelType: '',
      transmission: '',
      color: '',
      description: '',
      location: '',
      doors: '4',
      seats: '5',
      engine: '',
      features: []
    },
    mode: 'onChange'
  })

  // Mutation para criar listagem
  const createListingMutation = useMutation({
    mutationFn: async (data: CreateListingFormData) => {
      return await createCar(data)
    },
    onSuccess: (response) => {
      Toast.show({
        type: 'success',
        text1: 'Anúncio criado com sucesso!',
        text2: 'Seu veículo foi listado no marketplace'
      })
      
      // Navegar para a home
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

  // Monitorar mudanças na marca para atualizar modelos
  const watchedBrand = form.watch('brand')
  
  useEffect(() => {
    if (watchedBrand && watchedBrand !== selectedBrand) {
      setSelectedBrand(watchedBrand)
      setAvailableModels(carModelsByBrand[watchedBrand] || [])
      // Reset model when brand changes
      if (form.getValues('model')) {
        form.setValue('model', '', { shouldValidate: true })
      }
    }
  }, [watchedBrand, selectedBrand, form])

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
    
    // Estados locais
    loading: createListingMutation.isPending,
    selectedBrand,
    availableModels,
    
    // Dados para selects
    carBrands,
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