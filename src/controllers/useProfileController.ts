import { useEffect } from 'react'
import { useRouter } from 'expo-router'
import Toast from 'react-native-toast-message'

import { useAuthStore } from '@store/authStore'
import { useFavoritesStore } from '@store/favoritesStore'
import { useUserListingsStore } from '@store/userListingsStore'
import { useModalStore } from '@store/modalStore'

export default function useProfileController() {
  const router = useRouter()
  
  const { user, isAuthenticated, login, logout } = useAuthStore()
  const { favorites } = useFavoritesStore()
  const { listings: userListings, fetchUserListings, loading } = useUserListingsStore()
  const { setModal } = useModalStore()

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchUserListings(user.id)
    } else if (!isAuthenticated) {
      // Se não estiver logado, mostra modal perguntando se quer fazer login
      setModal({
        type: 'confirm',
        title: 'Você precisa estar logado para acessar seu perfil. Deseja fazer login agora?',
        confirmText: 'Fazer login',
        cancelText: 'Voltar',
        action: () => {
          router.push('/auth/login')
        }
      })
    }
  }, [isAuthenticated, user?.id, setModal, router])

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