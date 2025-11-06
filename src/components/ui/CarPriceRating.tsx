import React from 'react'
import { HStack } from '@components/ui/hstack'
import { VStack } from '@components/ui/vstack'
import { Text } from '@components/ui/text'
import { Pressable } from '@components/ui/pressable'
import { Heart, HeartStraight } from 'phosphor-react-native'

import { colors } from '@theme/colors'
import { formatPrice } from '@utils/formatters'

interface CarPriceRatingProps {
  price: number
  isFavorite: boolean
  onFavoritePress: () => void
}

export default function CarPriceRating({
  price,
  isFavorite,
  onFavoritePress
}: CarPriceRatingProps) {
  return (
    <HStack className="justify-between items-center px-4 py-4">
      {/* Preço */}
      <VStack space="xs">
        <Text className="text-gray-400 text-sm font-medium">
          Recent Price
        </Text>
        <Text 
          style={{ color: colors.accent[500] }} 
          className="text-2xl font-bold"
        >
          {formatPrice(price)}
        </Text>
      </VStack>
      
      {/* Favorito */}
      <Pressable
        onPress={onFavoritePress}
        style={{ backgroundColor: colors.neutral[800] }}
        className="w-12 h-12 rounded-2xl justify-center items-center"
      >
        {isFavorite ? (
          <Heart size={20} color={colors.accent[500]} weight="fill" />
        ) : (
          <HeartStraight size={20} color={colors.neutral[300]} weight="regular" />
        )}
      </Pressable>
    </HStack>
  )
}
