import React from 'react'
import { ScrollView } from 'react-native'
import { HStack } from '@components/ui/hstack'
import { VStack } from '@components/ui/vstack'
import { Box } from '@components/ui/box'
import { Text } from '@components/ui/text'
import { Pressable } from '@components/ui/pressable'
import { 
  Car, 
  Jeep, 
  Lightning,
  Baseball,
  GridFour
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
    id: 'all',
    name: 'All',
    icon: <GridFour size={24} color={colors.neutral[300]} weight="fill" />,
    count: 340
  },
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
    id: 'sport',
    name: 'Sport',
    icon: <Car size={24} color={colors.neutral[300]} weight="fill" />,
    count: 45
  },
  {
    id: 'eletricos',
    name: 'Elétricos',
    icon: <Lightning size={24} color={colors.neutral[300]} weight="fill" />,
    count: 32
  },
  {
    id: 'hatch',
    name: 'Hatch',
    icon: <Baseball size={24} color={colors.neutral[300]} weight="fill" />,
    count: 78
  }
]

function renderCategoryIcon(categoryId: string, isSelected: boolean) {
  const iconColor = isSelected ? colors.neutral[900] : colors.neutral[300]
  const iconSize = 24
  const iconWeight = 'fill' as const

  switch (categoryId) {
    case 'all':
      return <GridFour size={iconSize} color={iconColor} weight={iconWeight} />
    case 'sedan':
      return <Car size={iconSize} color={iconColor} weight={iconWeight} />
    case 'suv':
      return <Jeep size={iconSize} color={iconColor} weight={iconWeight} />
    case 'sport':
      return <Car size={iconSize} color={iconColor} weight={iconWeight} />
    case 'eletricos':
      return <Lightning size={iconSize} color={iconColor} weight={iconWeight} />
    case 'hatch':
      return <Baseball size={iconSize} color={iconColor} weight={iconWeight} />
    default:
      return <GridFour size={iconSize} color={iconColor} weight={iconWeight} />
  }
}

export default function CarCategories({ 
  onCategoryPress, 
  selectedCategory = 'all' 
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