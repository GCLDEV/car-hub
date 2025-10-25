import React from 'react'
import { VStack } from '@components/ui/vstack'
import { HStack } from '@components/ui/hstack'
import { Box } from '@components/ui/box'
import { Text } from '@components/ui/text'
import { Input, InputField } from '@components/ui/input'
import { Pressable } from '@components/ui/pressable'
import { 
  MagnifyingGlass, 
  Sliders,
  Funnel
} from 'phosphor-react-native'

import { colors } from '@theme/colors'

interface SearchHeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  onFilterPress: () => void
  onSearchSubmit?: () => void
  resultCount?: number
}

export default function SearchHeader({
  searchQuery,
  onSearchChange,
  onFilterPress,
  onSearchSubmit,
  resultCount = 0
}: SearchHeaderProps) {
  return (
    <VStack space="md" className="px-4 pt-4 pb-6" style={{ backgroundColor: colors.neutral[900] }}>
      {/* Título */}
      <HStack className="justify-between items-center">
        <VStack space="xs">
          <Text className="text-white text-2xl font-bold">
            Encontre seu carro
          </Text>
          <Text className="text-gray-400 text-base">
            {resultCount > 0 ? `${resultCount} carros encontrados` : 'Digite para buscar'}
          </Text>
        </VStack>
      </HStack>
      
      {/* Barra de busca */}
      <HStack space="md" className="items-center">
        <Box className="flex-1">
          <Input 
            variant="outline"
            size="md"
            className="h-12 rounded-2xl border-0"
            style={{ 
              backgroundColor: colors.neutral[800] + '90', // glassmorphism
            }}
          >
            <InputField
              placeholder="🔍 Buscar marca, modelo, ano..."
              value={searchQuery}
              onChangeText={onSearchChange}
              onSubmitEditing={onSearchSubmit}
              className="px-4"
              style={{ 
                color: colors.neutral[50],
                fontSize: 16
              }}
              placeholderTextColor={colors.neutral[400]}
              returnKeyType="search"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </Input>
        </Box>
        
        {/* Botão filtros */}
        <Pressable
          onPress={onFilterPress}
          className="w-12 h-12 rounded-2xl justify-center items-center"
          style={{ backgroundColor: colors.accent[500] }}
        >
          <Funnel size={20} color={colors.neutral[900]} weight="bold" />
        </Pressable>
      </HStack>
    </VStack>
  )
}