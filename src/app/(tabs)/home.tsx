import React from 'react'
import { FlatList, RefreshControl } from 'react-native'
import { SafeAreaView } from '@components/ui/safe-area-view'
import { VStack } from '@components/ui/vstack'
import { HStack } from '@components/ui/hstack'
import { Text } from '@components/ui/text'

import LoadingState from '@components/ui/LoadingState'
import ErrorState from '@components/ui/ErrorState'
import EmptyState from '@components/ui/EmptyState'
import CarCard from '@components/ui/CarCard'
import HomeHeader from '@components/ui/HomeHeader'
import CarCategories from '@components/ui/CarCategories'
import { HomeContentSkeleton } from '@components/ui/CarSkeletons'
import NetworkStatusBanner from '@components/ui/NetworkStatusBanner'

import { colors } from '@theme/colors'
import useHomeController from '@controllers/useHomeController'
import { Car } from '@/types/car'
import Toast from 'react-native-toast-message'

interface CarItemProps {
  car: Car
  onPress: () => void
  onFavoritePress: () => void
  isFavorite: boolean
}

export default function HomeScreen() {
  const {
    cars,
    loading,
    error,
    refreshing,
    handleRefresh,
    handleLoadMore,
    handleCarPress,
    handleFavoritePress,
    isFavorite,
    navigateToSearch,
    navigateToCreateListing,
    handleCategorySelect,
    selectedCategory,
    isOnline,
    isConnected,
    hasOfflineQueue
  } = useHomeController()

  function renderCarItem({ item }: { item: Car }) {
    return (
      <CarCard
        car={item}
        onPress={() => handleCarPress(item.id)}
        onFavoritePress={() => handleFavoritePress(item.id)}
        isFavorite={isFavorite(item.id)}
      />
    )
  }

  function handleNotificationPress() {
    Toast.show({
      type: 'info',
      text1: 'Notificações em desenvolvimento',
      text2: 'Sistema de notificações estará disponível em breve!'
    })
  }

  function handleLocationPress() {
    Toast.show({
      type: 'info',
      text1: 'Seleção de localização em desenvolvimento',
      text2: 'Filtro por localização estará disponível em breve!'
    })
  }

  if (loading && cars.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.neutral[900] }}>
        <VStack className="flex-1">
          {/* Header moderno funcionando normalmente */}
          <HomeHeader
            userName="Jimmy"
            userLocation="New York City, USA"
            notificationCount={3}
            onNotificationPress={handleNotificationPress}
            onLocationPress={handleLocationPress}
            onSearchPress={navigateToSearch}
            onCreatePress={navigateToCreateListing}
          />
          
          {/* Skeleton apenas da barra de pesquisa para baixo */}
          <HomeContentSkeleton />
        </VStack>
      </SafeAreaView>
    )
  }

  if (error) {
    return (
      <ErrorState 
        message={error} 
        onRetry={handleRefresh}
      />
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.neutral[900] }}>
      <VStack className="flex-1">
        {/* Header moderno */}
        <HomeHeader
          userName="Jimmy"
          userLocation="New York City, USA"
          notificationCount={3}
          onNotificationPress={handleNotificationPress}
          onLocationPress={handleLocationPress}
          onSearchPress={navigateToSearch}
          onCreatePress={navigateToCreateListing}
        />

        {/* Network Status Banner */}
        <NetworkStatusBanner 
          isOnline={isOnline}
          isConnected={isConnected}
          hasOfflineQueue={hasOfflineQueue}
        />
        
        {/* Categorias */}
        <CarCategories 
          onCategoryPress={handleCategorySelect}
          selectedCategory={selectedCategory}
        />
        
        {/* Seção Popular New Cars */}
        <VStack space="md" className="flex-1">
          <HStack className="justify-between items-center px-4">
            <Text className="text-white text-lg font-bold">
              Popular New Cars
            </Text>
          </HStack>

          {/* Lista de carros */}
          {cars.length === 0 ? (
            <EmptyState
              title="Nenhum carro encontrado"
              message="Seja o primeiro a anunciar um carro!"
              icon="🚗"
            />
          ) : (
            <FlatList
              data={cars}
              keyExtractor={(item, index) => item.id || `car-${index}-${Date.now()}`}
              renderItem={renderCarItem}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.1}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                  tintColor="#FFF"
                />
              }
              contentContainerStyle={{
                paddingBottom: 100,
              }}
              showsVerticalScrollIndicator={false}
            />
          )}
        </VStack>
      </VStack>
    </SafeAreaView>
  )
}