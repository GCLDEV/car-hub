import React from 'react'
import { Pressable } from '@components/ui/pressable'
import { VStack } from '@components/ui/vstack'
import { HStack } from '@components/ui/hstack'
import { Box } from '@components/ui/box'
import { Text } from '@components/ui/text'
import { Image } from '@components/ui/image'
import { 
  Heart, 
  HeartStraight, 
  MapPin,
  Calendar,
  Gauge,
  Drop
} from 'phosphor-react-native'

import { colors } from '@theme/colors'
import { Car } from '@/types/car'
import { formatPrice, formatKm } from '@utils/formatters'

interface SearchCarCardProps {
  car: Car
  onPress: () => void
  onFavoritePress: () => void
  isFavorite: boolean
}

export default function SearchCarCard({ 
  car, 
  onPress, 
  onFavoritePress, 
  isFavorite 
}: SearchCarCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className="rounded-3xl mx-4 mb-4 overflow-hidden"
      style={{ 
        backgroundColor: colors.neutral[800],
        borderWidth: 1,
        borderColor: colors.neutral[700]
      }}
    >
      <HStack space="md" className="p-4">
        {/* Imagem do carro */}
        <Box className="relative w-24 h-24 rounded-2xl overflow-hidden">
          <Image
            source={{ uri: car.images?.[0] || 'https://via.placeholder.com/200x150/333/fff?text=No+Image' }}
            alt={car.title}
            className="w-full h-full"
            resizeMode="cover"
          />
          
          {/* Overlay gradient sutil */}
          <Box className="absolute inset-0 bg-black/20 rounded-2xl" />
        </Box>

        {/* Informações do carro */}
        <VStack className="flex-1 justify-between" space="xs">
          {/* Título e preço */}
          <VStack space="xs">
            <Text className="text-white text-lg font-bold" numberOfLines={1}>
              {car.title}
            </Text>
            <Text style={{ color: colors.accent[500] }} className="text-xl font-bold">
              {formatPrice(car.price)}
            </Text>
          </VStack>

          {/* Especificações em linha */}
          <HStack space="md" className="items-center">
            <HStack space="xs" className="items-center">
              <Calendar size={12} color={colors.neutral[400]} />
              <Text className="text-gray-400 text-xs">
                {car.year}
              </Text>
            </HStack>
            
            <HStack space="xs" className="items-center">
              <Gauge size={12} color={colors.neutral[400]} />
              <Text className="text-gray-400 text-xs">
                {formatKm(car.km)}
              </Text>
            </HStack>
            
            <HStack space="xs" className="items-center">
              <Drop size={12} color={colors.neutral[400]} />
              <Text className="text-gray-400 text-xs">
                {car.fuelType}
              </Text>
            </HStack>
          </HStack>
          
          {/* Localização */}
          <HStack space="xs" className="items-center">
            <MapPin size={12} color={colors.neutral[400]} />
            <Text className="text-gray-400 text-sm" numberOfLines={1}>
              {car.location || car.cityState}
            </Text>
          </HStack>
        </VStack>

        {/* Botão de favorito */}
        <Box className="justify-start items-end">
          <Pressable
            onPress={onFavoritePress}
            className="w-10 h-10 rounded-full justify-center items-center"
            style={{ backgroundColor: colors.neutral[700] }}
          >
            {isFavorite ? (
              <Heart size={18} color={colors.accent[500]} weight="fill" />
            ) : (
              <HeartStraight size={18} color={colors.neutral[400]} weight="regular" />
            )}
          </Pressable>
        </Box>
      </HStack>
    </Pressable>
  )
}