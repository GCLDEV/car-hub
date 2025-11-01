import { useState, useEffect, useMemo } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { Share, Linking } from 'react-native'
import Toast from 'react-native-toast-message'

import { getCarById } from '@services/api/cars'
import { createOrFindConversation } from '@services/api/chat'
import { useFavoritesStore } from '@store/favoritesStore'
import useAuthGuard from '@hooks/useAuthGuard'

export default function useCarDetailsController() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  
  const { favorites, addFavorite, removeFavorite } = useFavoritesStore()
  const { checkAuth } = useAuthGuard()
  
  const [refreshing, setRefreshing] = useState(false)
  
  const { 
    data: car, 
    isLoading: loading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['car', id],
    queryFn: async () => {
      return await getCarById(id!)
    },
    enabled: !!id,
    staleTime: 30 * 1000,           // 30 segundos cache para detalhes
    gcTime: 5 * 60 * 1000,          // 5 minutos em memória
    refetchOnWindowFocus: true      // Atualiza quando volta ao app
  })

  const isFavorite = useMemo(() => {
    return favorites.includes(id!)
  }, [favorites, id])

  function toggleFavorite() {
    if (!id) return
    
    checkAuth(() => {
      if (isFavorite) {
        removeFavorite(id)
        Toast.show({ 
          type: 'info', 
          text1: 'Removido dos favoritos' 
        })
      } else {
        addFavorite(id)
        Toast.show({ 
          type: 'success', 
          text1: 'Adicionado aos favoritos' 
        })
      }
    })
  }

  async function handleContact() {
    if (!car) {
      return
    }
    
    checkAuth(async () => {
      try {
        // Verificar se temos dados do vendedor válidos
        if (!car.seller?.id || car.seller.id.startsWith('unknown-')) {
          console.error('❌ Invalid seller data:', car.seller)
          throw new Error('Este carro não possui informações válidas do vendedor. Não é possível iniciar uma conversa.')
        }

        // Mostrar loading
        Toast.show({ 
          type: 'info', 
          text1: 'Iniciando conversa...',
          text2: 'Aguarde um momento'
        })

        // Criar ou encontrar conversa com o vendedor sobre este carro
        const conversation = await createOrFindConversation(car.id, car.seller.id)
        
        // Navegar diretamente para a conversa criada/encontrada
        router.push(`/chat/${conversation.id}` as any)
        
        Toast.show({ 
          type: 'success', 
          text1: 'Chat iniciado',
          text2: `Conversa com ${car.seller.name || 'o vendedor'}`
        })
      } catch (error: any) {
        console.error('❌ Error creating conversation:', error)
        Toast.show({ 
          type: 'error', 
          text1: 'Erro ao iniciar chat',
          text2: error.message || 'Tente novamente mais tarde'
        })
      }
    })
  }

  async function handleShare() {
    if (!car) return
    
    try {
      const formattedPrice = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(car.price)
      await Share.share({
        message: `Confira este ${car.title} por ${formattedPrice}! 🚗\n\n📍 ${car.location}\n⚡ ${car.fuelType} • ${car.transmission}\n\nVeja mais detalhes no app Car Hub!`,
        title: `${car.title} - Car Hub`,
      })
    } catch (error) {
      Toast.show({ 
        type: 'error', 
        text1: 'Error sharing' 
      })
    }
  }

  function goBack() {
    router.back()
  }

  // Função para refresh manual dos dados do carro
  async function handleRefresh(): Promise<void> {
    if (!id) return

    setRefreshing(true)
    
    try {
      await refetch()
      
      Toast.show({
        type: 'success',
        text1: 'Car details updated',
        text2: 'Latest information loaded'
      })
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to refresh',
        text2: 'Please try again'
      })
    } finally {
      setRefreshing(false)
    }
  }

  return {
    car,
    loading,
    refreshing,
    error: error?.message,
    isFavorite,
    toggleFavorite,
    handleContact,
    handleShare,
    handleRefresh,
    goBack,
    similarCars: [] // TODO: implementar carros similares
  }
}