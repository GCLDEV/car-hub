import React from 'react'
import { Pressable } from '@components/ui/pressable'
import { VStack } from '@components/ui/vstack'
import { HStack } from '@components/ui/hstack'
import { Box } from '@components/ui/box'
import { Text } from '@components/ui/text'
import { Image } from '@components/ui/image'
import { Badge, BadgeText } from '@components/ui/badge'
import FavoriteButton from './FavoriteButton'
import { 
  MapPin,
  CaretRight,
  Lightning,
} from 'phosphor-react-native'

import { colors } from '@theme/colors'
import { spacing } from '@theme/spacing'
import { typography } from '@theme/typography'
import { Car } from '@/types/car'
import { formatPrice, formatKm } from '@utils/formatters'

interface CarCardProps {
  car: Car
  onPress: () => void
}

export default function CarCard({ car, onPress }: CarCardProps) {
  // Helper functions para tratar dados vazios
  const getDisplayPrice = () => {
    if (!car.price || isNaN(car.price) || car.price <= 0) {
      return 'Price not available'
    }
    return formatPrice(car.price)
  }

  const getDisplayYear = () => {
    if (!car.year || isNaN(car.year)) {
      return '--'
    }
    return car.year.toString()
  }

  const getDisplayKm = () => {
    if (!car.km || isNaN(car.km)) {
      return '--'
    }
    return formatKm(car.km)
  }

  const getDisplayFuelType = () => {
    return car.fuelType?.trim() || '--'
  }

  const getDisplayLocation = () => {
    return car.cityState?.trim() || 'Location not informed'
  }

  const getDisplayTitle = () => {
    const brand = car.brand?.trim() || ''
    const model = car.model?.trim() || ''
    
    if (!brand && !model) {
      return 'Car without identification'
    }
    
    return `${brand} ${model}`.trim()
  }

  return (
    <Pressable
      onPress={onPress}
      className="rounded-3xl mx-4 mb-6 overflow-hidden"
      style={{ 
        backgroundColor: colors.neutral[800],
        borderWidth: 1,
        borderColor: colors.neutral[700]
      }}
    >
      {/* Imagem do carro ou placeholder */}
      <Box className="relative h-56">
        {car.images && car.images.length > 0 ? (
          <Image
            source={{ uri: car.images[0] }}
            alt={getDisplayTitle()}
            className="w-full h-full rounded-t-3xl"
            resizeMode="cover"
          />
        ) : (
          <Box 
            className="w-full h-full rounded-t-3xl justify-center items-center"
            style={{ backgroundColor: colors.neutral[700] }}
          >
            <Text className="text-neutral-400 text-sm font-medium">
              No image available
            </Text>
          </Box>
        )}
        
        {/* Overlay gradient */}
        <Box className="absolute inset-0 bg-black/30 rounded-t-3xl" />
        
        {/* Botão de favorito */}
        <Box className="absolute top-4 right-4">
          <FavoriteButton carId={car.id} size="md" />
        </Box>
        
        {/* Badge de destaque */}
        <Box className="absolute top-4 left-4">
          <Badge style={{ backgroundColor: colors.accent[500] }} className="px-3 py-1.5 rounded-full flex-row items-center">
            <Lightning size={12} color={colors.neutral[900]} weight="fill" />
            <BadgeText className="text-gray-900 text-xs font-semibold ml-1">
              Popular
            </BadgeText>
          </Badge>
        </Box>
      </Box>
      
      {/* Conteúdo */}
      <VStack space="md" className="p-5">
        <VStack space="xs">
          <Text className="text-white text-lg font-bold leading-6">
            {getDisplayTitle()}
          </Text>
          <Text 
            style={{ color: car.price && !isNaN(car.price) && car.price > 0 ? colors.accent[500] : colors.neutral[400] }} 
            className="text-2xl font-extrabold leading-8"
          >
            {getDisplayPrice()}
          </Text>
        </VStack>
        
        {/* Specs em grid */}
        <HStack space="md" className="justify-between">
          <VStack className="items-center flex-1">
            <Text className="text-gray-400 text-xs font-medium">
              Year
            </Text>
            <Text className="text-white text-sm font-semibold">
              {getDisplayYear()}
            </Text>
          </VStack>
          
          <VStack className="items-center flex-1">
            <Text className="text-gray-400 text-xs font-medium">
              KM
            </Text>
            <Text className="text-white text-sm font-semibold">
              {getDisplayKm()}
            </Text>
          </VStack>
          
          <VStack className="items-center flex-1">
            <Text className="text-gray-400 text-xs font-medium">
             Fuel
            </Text>
            <Text className="text-white text-sm font-semibold">
              {getDisplayFuelType()}
            </Text>
          </VStack>
        </HStack>
        
        {/* Localização */}
        <HStack space="xs" className="items-center">
          <MapPin size={14} color={colors.neutral[400]} />
          <Text className="text-gray-400 text-sm flex-1">
            {getDisplayLocation()}
          </Text>
          <CaretRight size={16} color={colors.neutral[600]} />
        </HStack>
      </VStack>
    </Pressable>
  )
}