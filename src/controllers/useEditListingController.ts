import { useState, useEffect } from 'react'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Toast from 'react-native-toast-message'

import { useAuthStore } from '@store/authStore'
import { useModalStore } from '@store/modalStore'
import { useUserListingsStore } from '@store/userListingsStore'
import { useInvalidateCars } from '@hooks/useOptimizedCarQuery'
import { createListingSchema, type CreateListingFormData } from '@/utils/validation'
import { carBrands } from '@/constants/carBrands'
import { carCategories } from '@/constants/carCategories'
import { fuelTypes, transmissionTypes, carColors } from '@/constants/fuelTypes'
import { getCarById, updateCar } from '@/services/api/cars'
import type { Car } from '@/types/car'

export default function useEditListingController() {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()
  const { user, isAuthenticated, token } = useAuthStore()
  const { setModal } = useModalStore()
  const { fetchUserListings } = useUserListingsStore()
  const queryClient = useQueryClient()
  const { invalidateAllCars } = useInvalidateCars()
  
  // Query para buscar dados do carro
  const { 
    data: car, 
    isLoading: loadingCar, 
    error: carError 
  } = useQuery({
    queryKey: ['car', id],
    queryFn: () => getCarById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

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

  // Preencher formulário com dados do carro quando carregado
  useEffect(() => {
    if (car) {
      // Verificar se o usuário é o dono do anúncio
      if (car.seller?.id !== user?.id) {
        Toast.show({
          type: 'error',
          text1: 'Acesso negado',
          text2: 'Você só pode editar seus próprios anúncios'
        })
        router.back()
        return
      }

      form.reset({
        title: car.title || '',
        brand: car.brand || '',
        model: car.model || '',
        category: car.category || '',
        year: car.year?.toString() || new Date().getFullYear().toString(),
        price: car.price?.toString() || '',
        km: car.km?.toString() || '',
        fuelType: car.fuelType || '',
        transmission: car.transmission || '',
        color: car.color || '',
        description: car.description || '',
        location: car.location || '',
        doors: car.specs?.doors?.toString() || '',
        seats: car.specs?.seats?.toString() || '',
        engine: car.specs?.engine || '',
        features: car.specs?.features || [],
        images: car.images || []
      })
    }
  }, [car, user, router, form])

  // Mutation para atualizar listagem
  const updateListingMutation = useMutation({
    mutationFn: async (data: CreateListingFormData) => {
      if (!id) throw new Error('ID do anúncio não encontrado')
      return await updateCar(id, data)
    },
    onSuccess: () => {
      Toast.show({
        type: 'success',
        text1: 'Anúncio atualizado!',
        text2: 'As alterações foram salvas com sucesso'
      })
      
      // 🔄 Invalidar cache para buscar dados atualizados
      invalidateAllCars()
      queryClient.invalidateQueries({ queryKey: ['car', id] })
      
      // 📱 Atualizar listagens do usuário (Profile)
      fetchUserListings(user?.id || '')
      
      // 🏠 Navegar de volta
      router.back()
    },
    onError: (error: Error) => {
      Toast.show({
        type: 'error',
        text1: 'Erro ao atualizar anúncio',
        text2: error.message || 'Tente novamente'
      })
    }
  })

  const handleUpdateListing = form.handleSubmit(async (data) => {
    try {
      await updateListingMutation.mutateAsync(data as unknown as CreateListingFormData)
    } catch (error) {
      console.error('❌ Erro ao atualizar listagem:', error)
    }
  })

  // Verificar autenticação ao carregar a tela
  useEffect(() => {
    if (!isAuthenticated) {
      setModal({
        type: 'confirm',
        title: 'Você precisa estar logado para editar anúncios. Deseja fazer login agora?',
        confirmText: 'Fazer login',
        cancelText: 'Voltar',
        action: () => {
          router.push('/auth/login')
        }
      })
    }
  }, [isAuthenticated, setModal, router])

  // Verificar se houve erro ao carregar o carro
  useEffect(() => {
    if (carError) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao carregar anúncio',
        text2: 'Não foi possível carregar os dados do anúncio'
      })
      router.back()
    }
  }, [carError, router])

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
    loading: updateListingMutation.isPending,
    loadingCar,
    car,
    
    // Dados para selects
    carBrands,
    carCategories,
    fuelTypes,
    transmissionTypes,
    carColors,
    
    // Ações
    onSubmit: handleUpdateListing,
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
    canSubmit: form.formState.isValid && !updateListingMutation.isPending
  }
}