import React from 'react'
import { Pressable } from './pressable'
import { Heart } from 'phosphor-react-native'
import { useFavoritesQuery } from '@hooks/useFavoritesQuery'
import { useAuthStore } from '@store/authStore'
import { useModalStore } from '@store/modalStore'
import { colors } from '@theme/colors'

interface FavoriteButtonProps {
  carId: string
  size?: 'sm' | 'md' | 'lg'
  showAuthModal?: boolean
}

export default function FavoriteButton({ 
  carId,
  size = 'md',
  showAuthModal = true
}: FavoriteButtonProps) {
  const { isAuthenticated } = useAuthStore()
  const { setModal } = useModalStore()
  const { 
    isFavorite, 
    addToFavorites, 
    removeFromFavorites, 
    isAddingFavorite, 
    isRemovingFavorite 
  } = useFavoritesQuery()
  
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10', 
    lg: 'w-12 h-12'
  }

  const iconSizes = {
    sm: 18,
    md: 22,
    lg: 26
  }
  
  const isFav = isFavorite(carId)
  const isProcessing = isAddingFavorite || isRemovingFavorite
  
  const handlePress = () => {
    // Check authentication
    if (!isAuthenticated) {
      if (showAuthModal) {
        setModal({
          type: 'info',
          title: 'Please login to save cars to your favorites'
        })
      }
      return
    }
    
    // Toggle favorite status
    if (isFav) {
      removeFromFavorites(carId)
    } else {
      addToFavorites(carId)
    }
  }

  return (
    <Pressable 
      className={`
        ${sizeClasses[size]} 
        justify-center items-center 
        bg-white/90 rounded-full 
        shadow-md active:scale-95
        ${isProcessing ? 'opacity-50' : ''}
      `}
      onPress={handlePress}
      disabled={isProcessing}
    >
      <Heart 
        size={iconSizes[size]} 
        color={isFav ? colors.error[500] : colors.neutral[400]}
        weight={isFav ? 'fill' : 'regular'}
      />
    </Pressable>
  )
}