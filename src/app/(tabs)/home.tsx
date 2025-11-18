import React, { useEffect } from 'react'
import { FlatList, RefreshControl } from 'react-native'
import { SafeAreaView } from '@components/ui/safe-area-view'
import { useRouter } from 'expo-router'
import { VStack } from '@components/ui/vstack'
import { HStack } from '@components/ui/hstack'
import { Text } from '@components/ui/text'

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
import { useAuthStore } from '@/store/authStore'

export default function HomeScreen() {
  const router = useRouter()
  
  const {
    cars,
    loading,
    error,
    refreshing,
    handleRefresh,
    handleLoadMore,
    handleCarPress,
    navigateToSearch,
    openFiltersModal,
    handleClearFilters,
    handleCategorySelect,
    selectedCategory,
    activeFiltersCount,

    isOnline,
    isConnected,
    hasOfflineQueue,

    // Notification data
    expoPushToken,
    notification,
    notificationError
  } = useHomeController()

  const { user } = useAuthStore()

  // Monitor notifications received
  useEffect(() => {
    if (notification) {
      console.log('📱 Notification received on Home:', notification.request.content)
      
      // Show toast for new notification
      Toast.show({
        type: 'info',
        text1: notification.request.content.title || 'Nova notificação',
        text2: notification.request.content.body,
        position: 'top',
      })
    }
  }, [notification])

  // Monitor push token
  useEffect(() => {
    if (expoPushToken) {
      console.log('🔔 Push token obtained:', expoPushToken)
    }
  }, [expoPushToken])

  // Monitor notification errors
  useEffect(() => {
    if (notificationError) {
      console.error('❌ Notification error:', notificationError)
      Toast.show({
        type: 'error',
        text1: 'Erro nas notificações',
        text2: 'Não foi possível configurar as notificações push',
        position: 'top',
      })
    }
  }, [notificationError])

  function renderCarItem({ item }: { item: Car }) {
    return (
      <CarCard
        car={item}
        onPress={() => handleCarPress(item.id)}
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



  function navigateToSettings() {
    router.push('/settings')
  }

  if (loading && cars.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.neutral[900] }}>
        <VStack className="flex-1">
          {/* Header moderno funcionando normalmente */}
          <HomeHeader
            userName={user?.name || 'User'}
            userAvatar={user?.avatar}
            notificationCount={3}
            activeFiltersCount={activeFiltersCount}
            onNotificationPress={handleNotificationPress}
            onSettingsPress={navigateToSettings}
            onSearchPress={navigateToSearch}
            onFiltersPress={openFiltersModal}
            onClearFiltersPress={handleClearFilters}
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
          userName={user?.name || 'User'}
          userAvatar={user?.avatar}
          notificationCount={3}
          activeFiltersCount={activeFiltersCount}
          onNotificationPress={handleNotificationPress}
          onSettingsPress={navigateToSettings}
          onSearchPress={navigateToSearch}
          onFiltersPress={openFiltersModal}
          onClearFiltersPress={handleClearFilters}
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
          <VStack className="px-4" space="xs">
            <HStack className="justify-between items-center">
              <Text className="text-white text-lg font-bold">
                Popular New Cars
              </Text>
            </HStack>
            <Text className="text-neutral-400 text-sm">
              Explore cars from other users. Their ads appear on the profile.
            </Text>
          </VStack>

          {/* Lista de carros */}
          {cars.length === 0 ? (
            <EmptyState
              title="No cars found"
              message="Be the first to advertise a car!"
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