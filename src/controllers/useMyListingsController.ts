import { useState } from 'react'
import { useRouter } from 'expo-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import Toast from 'react-native-toast-message'

import { useAuthStore } from '@store/authStore'
import { useModalStore } from '@store/modalStore'
import { getUserCars, deleteCar, updateCarStatus } from '@/services/api/cars'
import { useInvalidateCars } from '@hooks/useOptimizedCarQuery'
import type { Car } from '@/types/car'

export default function useMyListingsController() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const { setModal } = useModalStore()
  const { invalidateAllCars, invalidateUserCars } = useInvalidateCars()
  const queryClient = useQueryClient()

  const [refreshing, setRefreshing] = useState(false)
  const [selectedCar, setSelectedCar] = useState<Car | null>(null)

  // Query para buscar carros do usuário
  const {
    data: cars = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['user-cars', user?.id],
    queryFn: () => getUserCars(),
    enabled: !!user && isAuthenticated,
    staleTime: 1 * 60 * 1000,         // 1 minuto cache (dados do usuário mudam menos)
    gcTime: 5 * 60 * 1000,            // 5 minutos em memória
    refetchOnWindowFocus: true,       // Atualiza quando volta ao app
    refetchOnMount: true,             // Sempre busca dados frescos
  })

  // Estados calculados
  const isEmpty = !isLoading && cars.length === 0
  const hasActiveCars = cars.filter((car: Car) => car.status === 'available').length
  const hasSoldCars = cars.filter((car: Car) => car.status === 'sold').length

  // Refresh manual
  async function handleRefresh(): Promise<void> {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }

  // Navegar para detalhes do carro
  function handleCarPress(car: Car): void {
    router.push(`/car/${car.id}`)
  }

  // Navegar para criar novo anúncio
  function handleCreateListing(): void {
    if (!isAuthenticated) {
      setModal({
        type: 'info',
        title: 'Login Required',
      })
      return
    }
    router.push('/(tabs)/create-listing')
  }

  // Navegar para editar anúncio
  function handleEditCar(car: Car): void {
    router.push({
      pathname: '/edit-listing/[id]',
      params: { id: car.id }
    })
  }

  // Confirmar e deletar carro
  function handleDeleteCar(car: Car): void {
    setSelectedCar(car)
    setModal({
      type: 'confirm',
      title: `Delete "${car.title}"?`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      action: confirmDeleteCar,
      isDestructive: true,
    })
  }

  // Executar delete do carro
  async function confirmDeleteCar(): Promise<void> {
    if (!selectedCar) return

    try {
      await deleteCar(selectedCar.id)
      
      // Update otimizado do cache
      queryClient.setQueryData(['user-cars', user?.id], (oldData: Car[]) => {
        return oldData?.filter(car => car.id !== selectedCar.id) || []
      })

      // Invalidar outros caches relacionados
      invalidateAllCars()
      
      Toast.show({
        type: 'success',
        text1: 'Listing deleted successfully',
        text2: 'Your car has been removed from the marketplace'
      })
      
      setSelectedCar(null)
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Failed to delete listing',
        text2: error.message || 'Please try again'
      })
    }
  }

  // Marcar como vendido
  function handleMarkAsSold(car: Car): void {
    setSelectedCar(car)
    setModal({
      type: 'confirm',
      title: `Mark "${car.title}" as sold?`,
      confirmText: 'Mark as Sold',
      cancelText: 'Cancel',
      action: confirmMarkAsSold,
    })
  }

  // Confirmar marcar como vendido
  async function confirmMarkAsSold(): Promise<void> {
    if (!selectedCar) return

    try {
      // Atualizar status via API
      const updatedCar = await updateCarStatus(selectedCar.id, 'sold')
      
      // Update otimizado do cache
      queryClient.setQueryData(['user-cars', user?.id], (oldData: Car[]) => {
        return oldData?.map(car => 
          car.id === selectedCar.id ? updatedCar : car
        ) || []
      })

      // Invalidar cache geral
      invalidateAllCars()
      
      Toast.show({
        type: 'success',
        text1: 'Marked as sold!',
        text2: 'Congratulations on your sale!'
      })
      
      setSelectedCar(null)
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Failed to update status',
        text2: error.message || 'Please try again'
      })
    }
  }

  // Compartilhar anúncio
  function handleShareCar(car: Car): void {
    // TODO: Implementar compartilhamento nativo
    setModal({
      type: 'info',
      title: 'Share feature coming soon!',
    })
  }

  // Verificar se usuário está logado
  function requireAuth(callback: () => void): void {
    if (!isAuthenticated) {
      setModal({
        type: 'info',
        title: 'Login required to continue',
      })
      return
    }
    callback()
  }

  return {
    // Dados
    cars,
    user,
    isAuthenticated,
    
    // Estados
    isLoading,
    refreshing,
    isEmpty,
    hasActiveCars,
    hasSoldCars,
    error,
    
    // Ações
    handleRefresh,
    handleCarPress,
    handleCreateListing,
    handleEditCar,
    handleDeleteCar,
    handleMarkAsSold,
    handleShareCar,
    requireAuth,
    
    // Utilidades
    getStatusColor: (status: string) => {
      switch (status) {
        case 'available': return '#10B981' // Verde
        case 'sold': return '#F59E0B' // Amarelo
        case 'reserved': return '#3B82F6' // Azul
        default: return '#6B7280' // Cinza
      }
    },
    
    getStatusLabel: (status: string) => {
      switch (status) {
        case 'available': return 'Active'
        case 'sold': return 'Sold'
        case 'reserved': return 'Reserved'
        default: return status
      }
    }
  }
}