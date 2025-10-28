import React from 'react'
import { ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { VStack } from '@components/ui/vstack'
import { HStack } from '@components/ui/hstack'
import { Heading } from '@components/ui/heading'
import { Button, ButtonText } from '@components/ui/button'

import ErrorState from '@components/ui/ErrorState'
import ProfileHeader from '@components/ui/ProfileHeader'
import ProfileMenu from '@components/ui/ProfileMenu'
import { HomeContentSkeleton, ProfileContentSkeleton } from '@components/ui/CarSkeletons'

import useProfileController from '@controllers/useProfileController'
import { useModalStore } from '@store/modalStore'
import { useRouter } from 'expo-router'
import { colors } from '@theme/colors'

export default function ProfileScreen() {
const {
    user,
    isAuthenticated,
    userListings,
    favoriteCount,
    loading,
    error,
    handleLogin,
    handleLogout,
    navigateToCreateListing,
    navigateToMyListings,
    navigateToFavorites,
    navigateToViews,
    navigateToSettings,
    navigateToNotifications,
    navigateToPrivacy,
    navigateToHelp
  } = useProfileController()

  const { setModal } = useModalStore()
  const router = useRouter()

  // Estado para controlar skeleton de teste
  const [showSkeleton, setShowSkeleton] = React.useState(false)

  // Renderizar skeleton se estiver ativo
  if (showSkeleton) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.neutral[900] }}>
        <VStack className="flex-1">
          <VStack className="px-4 pt-4 pb-2">
            <HStack className="justify-between items-center">
              <Heading className="text-white text-xl font-bold">
                🧪 Testando Skeleton
              </Heading>
              <Button
                size="sm"
                style={{ backgroundColor: colors.error[500] }}
                onPress={() => setShowSkeleton(false)}
              >
                <ButtonText className="text-white">Parar</ButtonText>
              </Button>
            </HStack>
          </VStack>
          <HomeContentSkeleton />
        </VStack>
      </SafeAreaView>
    )
  }

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.neutral[900] }}>
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
        >
          {/* Header funcionando normalmente durante loading */}
          <ProfileHeader
            isAuthenticated={false} // Assumir guest durante loading
            user={undefined}
            userListings={[]}
            favoriteCount={0}
            onNotificationPress={() => {}}
            onSettingsPress={() => {}}
            onCreateListingPress={() => {}}
            onLoginPress={() => {}}
          />

          {/* Skeleton do conteúdo */}
          <ProfileContentSkeleton />
        </ScrollView>
      </SafeAreaView>
    )
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={() => { }}
      />
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.neutral[900] }}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <ProfileHeader
          isAuthenticated={isAuthenticated}
          user={user || undefined}
          userListings={userListings}
          favoriteCount={favoriteCount}
          onNotificationPress={() => {}}
          onSettingsPress={navigateToSettings}
          onCreateListingPress={navigateToCreateListing}
          onLoginPress={handleLogin}
        />

        {/* Menu */}
        <ProfileMenu
          isAuthenticated={isAuthenticated}
          userListings={userListings}
          favoriteCount={favoriteCount}
          onMyListings={navigateToMyListings}
          onFavorites={navigateToFavorites}
          onViews={navigateToViews}
          onSettings={navigateToSettings}
          onNotifications={navigateToNotifications}
          onPrivacy={navigateToPrivacy}
          onHelp={navigateToHelp}
          onLogout={handleLogout}
        />

      </ScrollView>
    </SafeAreaView>
  )
}