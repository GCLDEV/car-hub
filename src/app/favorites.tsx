import React from 'react'
import { FlatList, RefreshControl } from 'react-native'
import { VStack } from '@components/ui/vstack'
import { HStack } from '@components/ui/hstack'
import { Box } from '@components/ui/box'
import { Text } from '@components/ui/text'
import { Pressable } from '@components/ui/pressable'
import { Spinner } from '@components/ui/spinner'
import { ArrowLeft, Heart } from 'phosphor-react-native'
import { useRouter } from 'expo-router'

import { useFavoritesQuery } from '@hooks/useFavoritesQuery'
import CarCard from '@components/ui/CarCard'
import { colors } from '@theme/colors'
import { Car } from '@/types/car'
import { Favorite } from '@/services/api/favorites'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function FavoritesScreen() {
  const router = useRouter()
  const { 
    favoritesData, 
    isLoading, 
    error, 
    refetch, 
    isRefetching 
  } = useFavoritesQuery()

  function handleCarPress(carId: string) {
    router.push(`/car/${carId}` as any)
  }

  function renderCarItem({ item }: { item: Favorite }) {
    return (
      <CarCard
        car={item.car as Car}
        onPress={() => handleCarPress(item.car.id)}
      />
    )
  }

  function renderEmptyState() {
    return (
      <VStack className="flex-1 justify-center items-center px-6">
        <Box className="mb-6 p-6 rounded-full" style={{ backgroundColor: colors.neutral[800] }}>
          <Heart size={48} color={colors.neutral[500]} weight="regular" />
        </Box>
        <Text className="text-white text-xl font-bold mb-3 text-center">
          No favorites yet
        </Text>
        <Text className="text-neutral-400 text-base text-center leading-6">
          Start exploring cars and save your favorites to see them here
        </Text>
        <Pressable
          className="mt-8 px-6 py-3 rounded-xl"
          style={{ backgroundColor: colors.accent[500] }}
          onPress={() => router.push('/(tabs)/home' as any)}
        >
          <Text className="text-neutral-900 font-semibold">
            Explore Cars
          </Text>
        </Pressable>
      </VStack>
    )
  }

  function renderError() {
    return (
      <VStack className="flex-1 justify-center items-center px-6">
        <Text className="text-error-500 text-lg font-semibold mb-3 text-center">
          Failed to load favorites
        </Text>
        <Text className="text-neutral-400 text-base text-center leading-6 mb-6">
          {error?.message || 'Something went wrong'}
        </Text>
        <Pressable
          className="px-6 py-3 rounded-xl"
          style={{ backgroundColor: colors.accent[500] }}
          onPress={() => refetch()}
        >
          <Text className="text-neutral-900 font-semibold">
            Try Again
          </Text>
        </Pressable>
      </VStack>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.neutral[900] }}>
      {/* Header */}
      <HStack className="items-center px-4 py-3 border-b" style={{ borderBottomColor: colors.neutral[800] }}>
        <Pressable
          className="w-10 h-10 rounded-full justify-center items-center mr-3"
          style={{ backgroundColor: colors.neutral[800] }}
          onPress={() => router.back()}
        >
          <ArrowLeft size={20} color={colors.neutral[50]} />
        </Pressable>
        
        <Text className="text-white text-lg font-semibold flex-1">
          My Favorites
        </Text>
        
        {favoritesData?.results && (
          <Text className="text-neutral-400 text-sm">
            {favoritesData.results.length} cars
          </Text>
        )}
      </HStack>

      {/* Content */}
      <VStack className="flex-1">
        {isLoading && !favoritesData ? (
          <VStack className="flex-1 justify-center items-center">
            <Spinner size="large" color={colors.accent[500]} />
            <Text className="text-neutral-400 mt-4">Loading favorites...</Text>
          </VStack>
        ) : error ? (
          renderError()
        ) : !favoritesData?.results?.length ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={favoritesData.results}
            keyExtractor={(item) => item.id}
            renderItem={renderCarItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingTop: 16, paddingBottom: 32 }}
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={refetch}
                tintColor={colors.accent[500]}
                colors={[colors.accent[500]]}
              />
            }
          />
        )}
      </VStack>
    </SafeAreaView>
  )
}