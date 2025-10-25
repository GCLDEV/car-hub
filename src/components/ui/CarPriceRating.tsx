import React from 'react'
import { HStack } from '@components/ui/hstack'
import { VStack } from '@components/ui/vstack'
import { Box } from '@components/ui/box'
import { Text } from '@components/ui/text'
import { Pressable } from '@components/ui/pressable'
import { Star, Heart, HeartStraight } from 'phosphor-react-native'

import { colors } from '@theme/colors'
import { formatPrice } from '@utils/formatters'

interface CarPriceRatingProps {
  price: number
  rating?: number
  isFavorite: boolean
  onFavoritePress: () => void
}

export default function CarPriceRating({
  price,
  rating = 9.5,
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
      
      {/* Rating e Favorito */}
      <HStack space="md" className="items-center">
        {/* Rating */}
        <HStack space="xs" className="items-center">
          <Box 
            style={{ backgroundColor: colors.accent[500] }}
            className="w-8 h-8 rounded-full justify-center items-center"
          >
            <Star size={14} color={colors.neutral[900]} weight="fill" />
          </Box>
          <Text className="text-white font-semibold text-lg">
            {rating}
          </Text>
          <Text className="text-gray-400 text-sm">
            /overall
          </Text>
        </HStack>
        
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
    </HStack>
  )
}