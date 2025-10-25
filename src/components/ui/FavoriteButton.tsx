import React from 'react'
import { Pressable } from './pressable'
import { Heart, HeartStraight } from 'phosphor-react-native'
import { colors } from '@theme/colors'

interface FavoriteButtonProps {
  isFavorite: boolean
  onPress: () => void
  size?: 'sm' | 'md' | 'lg'
}

export default function FavoriteButton({ 
  isFavorite, 
  onPress, 
  size = 'md' 
}: FavoriteButtonProps) {
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

  return (
    <Pressable 
      className={`
        ${sizeClasses[size]} 
        justify-center items-center 
        bg-white/90 rounded-full 
        shadow-md active:scale-95
      `}
      onPress={onPress}
    >
      {isFavorite ? (
        <Heart 
          size={iconSizes[size]} 
          color={colors.error[500]} 
          weight="fill" 
        />
      ) : (
        <HeartStraight 
          size={iconSizes[size]} 
          color={colors.neutral[400]} 
        />
      )}
    </Pressable>
  )
}