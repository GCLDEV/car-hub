import React from 'react'
import { ScrollView } from 'react-native'
import { HStack } from '@components/ui/hstack'
import { VStack } from '@components/ui/vstack'
import { Box } from '@components/ui/box'
import { Text } from '@components/ui/text'
import { Pressable } from '@components/ui/pressable'
import { 
  Car, 
  Motorcycle, 
  Truck, 
  Jeep, 
  Bicycle 
} from 'phosphor-react-native'

import { colors } from '@theme/colors'

interface CategoryItem {
  id: string
  name: string
  icon: React.ReactNode
  count?: number
}

interface CarCategoriesProps {
  onCategoryPress: (categoryId: string) => void
  selectedCategory?: string
}

const categories: CategoryItem[] = [
  {
    id: 'sedan',
    name: 'Sedan',
    icon: <Car size={24} color={colors.neutral[300]} weight="fill" />,
    count: 120
  },
  {
    id: 'suv',
    name: 'SUV',
    icon: <Jeep size={24} color={colors.neutral[300]} weight="fill" />,
    count: 85
  },
  {
    id: 'truck',
    name: 'Pickup',
    icon: <Truck size={24} color={colors.neutral[300]} weight="fill" />,
    count: 45
  },
  {
    id: 'motorcycle',
    name: 'Moto',
    icon: <Motorcycle size={24} color={colors.neutral[300]} weight="fill" />,
    count: 67
  },
  {
    id: 'bicycle',
    name: 'Bike',
    icon: <Bicycle size={24} color={colors.neutral[300]} weight="fill" />,
    count: 23
  }
]

function renderCategoryIcon(categoryId: string, isSelected: boolean) {
  const iconColor = isSelected ? colors.neutral[900] : colors.neutral[300]
  const iconSize = 24
  const iconWeight = 'fill' as const

  switch (categoryId) {
    case 'sedan':
      return <Car size={iconSize} color={iconColor} weight={iconWeight} />
    case 'suv':
      return <Jeep size={iconSize} color={iconColor} weight={iconWeight} />
    case 'truck':
      return <Truck size={iconSize} color={iconColor} weight={iconWeight} />
    case 'motorcycle':
      return <Motorcycle size={iconSize} color={iconColor} weight={iconWeight} />
    case 'bicycle':
      return <Bicycle size={iconSize} color={iconColor} weight={iconWeight} />
    default:
      return <Car size={iconSize} color={iconColor} weight={iconWeight} />
  }
}

export default function CarCategories({ 
  onCategoryPress, 
  selectedCategory = 'sedan' 
}: CarCategoriesProps) {
  return (
    <VStack space="md" className="py-4">
      <Text className="text-white text-lg font-bold px-4">
        Categories
      </Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingRight: 32 }}
      >
        <HStack space="md">
          {categories.map((category) => {
            const isSelected = selectedCategory === category.id
            
            return (
              <Pressable
                key={category.id}
                onPress={() => onCategoryPress(category.id)}
                style={{
                  backgroundColor: isSelected ? colors.accent[500] : colors.neutral[800],
                  borderColor: colors.neutral[700],
                  borderWidth: isSelected ? 0 : 1
                }}
                className="w-20 h-20 rounded-2xl justify-center items-center"
              >
                <VStack space="xs" className="items-center">
                  <Box className={isSelected ? 'opacity-100' : 'opacity-70'}>
                    {renderCategoryIcon(category.id, isSelected)}
                  </Box>
                  <Text 
                    className={`text-xs font-medium ${
                      isSelected ? 'text-gray-900' : 'text-gray-400'
                    }`}
                  >
                    {category.name}
                  </Text>
                </VStack>
              </Pressable>
            )
          })}
        </HStack>
      </ScrollView>
    </VStack>
  )
}