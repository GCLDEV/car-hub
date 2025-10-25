import React, { useState } from 'react'
import { VStack } from '@components/ui/vstack'
import { HStack } from '@components/ui/hstack'
import { Box } from '@components/ui/box'
import { Text } from '@components/ui/text'
import { Pressable } from '@components/ui/pressable'
import { CaretDown, CaretUp } from 'phosphor-react-native'

import { colors } from '@theme/colors'

interface CarDescriptionProps {
  title: string
  description: string
  brand: string
  model: string
  year: number
}

export default function CarDescription({
  title,
  description,
  brand,
  model,
  year
}: CarDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  const shouldTruncate = description.length > 150
  const displayText = isExpanded || !shouldTruncate 
    ? description 
    : `${description.substring(0, 150)}...`

  return (
    <VStack space="md" className="px-4 py-4">
      {/* Título do Carro */}
      <VStack space="xs">
        <Text className="text-white text-2xl font-bold">
          {title || `${brand} ${model}`}
        </Text>
        <Text className="text-gray-400 text-base">
          {year} • {brand.toUpperCase()}
        </Text>
      </VStack>
      
      {/* Descrição */}
      <VStack space="sm">
        <Text className="text-white text-lg font-semibold">
          Description
        </Text>
        
        <Text className="text-gray-300 text-base leading-6">
          {displayText}
        </Text>
        
        {shouldTruncate && (
          <Pressable onPress={() => setIsExpanded(!isExpanded)}>
            <HStack space="xs" className="items-center">
              <Text 
                style={{ color: colors.accent[500] }}
                className="font-semibold"
              >
                {isExpanded ? 'Show Less' : 'Read More'}
              </Text>
              {isExpanded ? (
                <CaretUp size={16} color={colors.accent[500]} />
              ) : (
                <CaretDown size={16} color={colors.accent[500]} />
              )}
            </HStack>
          </Pressable>
        )}
      </VStack>
      
      {/* Divisor */}
      <Box 
        className="h-px w-full"
        style={{ backgroundColor: colors.neutral[800] }}
      />
    </VStack>
  )
}