import { useEffect } from 'react'
import { useRouter } from 'expo-router'
import Toast from 'react-native-toast-message'

import { useAuthStore } from '@store/authStore'
import { useFavoritesStore } from '@store/favoritesStore'
import { useUserListingsStore } from '@store/userListingsStore'

export default function useProfileController() {
  const router = useRouter()
  
  const { user, isAuthenticated, login, logout } = useAuthStore()
  const { favorites } = useFavoritesStore()
  const { listings: userListings, fetchUserListings, loading } = useUserListingsStore()

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchUserListings(user.id)
    }
  }, [isAuthenticated, user?.id])

  function handleLogin() {
    // Navegar para a tela de login
    router.push('/auth/login')
  }

  function handleLogout() {
    logout()
    
    Toast.show({
      type: 'info',
      text1: 'Signed out successfully'
    })
  }

  function navigateToCreateListing() {
    router.push('/create-listing' as any)
  }

  function navigateToMyListings() {
    router.push('/my-listings' as any)
  }

  function navigateToFavorites() {
    router.push('/(tabs)/favorites' as any)
  }

  function navigateToSettings() {
    Toast.show({
      type: 'info',
      text1: 'Settings under development'
    })
  }

  return {
    user,
    isAuthenticated,
    userListings,
    favoriteCount: favorites.length,
    loading,
    error: undefined, // TODO: implementar tratamento de erro
    handleLogin,
    handleLogout,
    navigateToCreateListing,
    navigateToMyListings,
    navigateToFavorites,
    navigateToSettings
  }
}