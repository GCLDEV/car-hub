import { useState, useEffect, useMemo } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { Share, Linking } from 'react-native'
import Toast from 'react-native-toast-message'

import { getCarById } from '@services/api/cars'
import { useFavoritesStore } from '@store/favoritesStore'

export default function useCarDetailsController() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  
  const { favorites, addFavorite, removeFavorite } = useFavoritesStore()
  
  const { 
    data: car, 
    isLoading: loading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['car', id],
    queryFn: async () => {
      // Simular delay para visualizar skeleton (remover em produção)
      await new Promise(resolve => setTimeout(resolve, 2500))
      return await getCarById(id!)
    },
    enabled: !!id
  })

  const isFavorite = useMemo(() => {
    return favorites.includes(id!)
  }, [favorites, id])

  function toggleFavorite() {
    if (!id) return
    
    if (isFavorite) {
      removeFavorite(id)
      Toast.show({ 
        type: 'info', 
        text1: 'Removed from favorites' 
      })
    } else {
      addFavorite(id)
      Toast.show({ 
        type: 'success', 
        text1: 'Added to favorites' 
      })
    }
  }

  async function handleContact() {
    if (!car) return
    
    // Simular contato - abrir WhatsApp
    const phoneNumber = '5511999999999' // Número simulado
    const message = `Olá! Tenho interesse no ${car.title} por ${car.price}. Podemos conversar?`
    const whatsappUrl = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`
    
    try {
      const supported = await Linking.canOpenURL(whatsappUrl)
      if (supported) {
        await Linking.openURL(whatsappUrl)
      } else {
        Toast.show({ 
          type: 'error', 
          text1: 'WhatsApp não está instalado' 
        })
      }
    } catch (error) {
      Toast.show({ 
        type: 'error', 
        text1: 'Error opening WhatsApp' 
      })
    }
  }

  async function handleShare() {
    if (!car) return
    
    try {
      await Share.share({
        message: `Confira este ${car.title} por ${car.price}! 🚗`,
        title: car.title,
        url: `https://app.exemplo.com/car/${id}` // URL simulada
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

  return {
    car,
    loading,
    error: error?.message,
    isFavorite,
    toggleFavorite,
    handleContact,
    handleShare,
    goBack,
    similarCars: [] // TODO: implementar carros similares
  }
}