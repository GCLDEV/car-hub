import React from 'react'
import { VStack } from '@components/ui/vstack'
import { HStack } from '@components/ui/hstack'
import { Box } from '@components/ui/box'
import { Text } from '@components/ui/text'
import { Pressable } from '@components/ui/pressable'
import { 
  MagnifyingGlass,
  TrendUp,
  Star,
  Clock
} from 'phosphor-react-native'

import { colors } from '@theme/colors'

interface SearchSuggestionsProps {
  onSuggestionPress: (suggestion: string) => void
}

const popularSearches = [
  'Honda Civic',
  'Toyota Corolla', 
  'Volkswagen Golf',
  'Ford Ka',
  'Chevrolet Onix'
]

const recentSearches = [
  'BMW X1',
  'Audi A3',
  'Hyundai HB20'
]

export default function SearchSuggestions({ onSuggestionPress }: SearchSuggestionsProps) {
  return (
    <VStack space="lg" className="px-4 py-6">
      {/* Buscas populares */}
      <VStack space="md">
        <HStack space="xs" className="items-center">
          <TrendUp size={20} color={colors.accent[500]} />
            <Text className="text-white text-lg font-bold">
            Popular Searches
            </Text>
        </HStack>
        
        <VStack space="sm">
          {popularSearches.map((search, index) => (
            <Pressable
              key={`popular-${search}-${index}`}
              onPress={() => onSuggestionPress(search)}
              className="p-3 rounded-xl"
              style={{ backgroundColor: colors.neutral[800] }}
            >
              <HStack space="sm" className="items-center">
                <MagnifyingGlass size={16} color={colors.neutral[400]} />
                <Text className="text-white text-base flex-1">
                  {search}
                </Text>
              </HStack>
            </Pressable>
          ))}
        </VStack>
      </VStack>
      
      {/* Buscas recentes */}
      <VStack space="md">
        <HStack space="xs" className="items-center">
          <Clock size={20} color={colors.neutral[400]} />
            <Text className="text-white text-lg font-bold">
            Recent Searches
            </Text>
        </HStack>
        
        <VStack space="sm">
          {recentSearches.map((search, index) => (
            <Pressable
              key={`recent-${search}-${index}`}
              onPress={() => onSuggestionPress(search)}
              className="p-3 rounded-xl"
              style={{ backgroundColor: colors.neutral[800] }}
            >
              <HStack space="sm" className="items-center">
                <Clock size={16} color={colors.neutral[400]} />
                <Text className="text-white text-base flex-1">
                  {search}
                </Text>
              </HStack>
            </Pressable>
          ))}
        </VStack>
      </VStack>
      
      {/* Dica */}
      <Box 
        className="p-4 rounded-2xl"
        style={{ backgroundColor: colors.neutral[800] }}
      >
        <HStack space="sm" className="items-center">
          <Star size={20} color={colors.accent[500]} />
          <VStack className="flex-1" space="xs">
            <Text className="text-white font-semibold">
              Tip
            </Text>
            <Text className="text-gray-400 text-sm">
              Use keywords like brand, model or year to find more precise results
            </Text>
          </VStack>
        </HStack>
      </Box>
    </VStack>
  )
}