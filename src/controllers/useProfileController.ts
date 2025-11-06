import { useEffect, useState } from 'react'
import { useRouter } from 'expo-router'
import { useQueryClient } from '@tanstack/react-query'
import Toast from 'react-native-toast-message'

import { useAuthStore } from '@store/authStore'
import { useFavoritesStore } from '@store/favoritesStore'
import { useUserListingsStore } from '@store/userListingsStore'
import { useModalStore } from '@store/modalStore'
import useAuthGuard from '@hooks/useAuthGuard'
import { useQueryInvalidation } from '@hooks/useQueryInvalidation'

export default function useProfileController() {
  const router = useRouter()
  const queryClient = useQueryClient()
  
  const { user, isAuthenticated, login, logout } = useAuthStore()
  const { favorites } = useFavoritesStore()
  const { listings: userListings, fetchUserListings, loading } = useUserListingsStore()
  const { setModal } = useModalStore()
  const { checkAuth } = useAuthGuard()
  const { invalidateByContext } = useQueryInvalidation()
  
  const [refreshing, setRefreshing] = useState(false)

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
    router.push('/(tabs)/create-listing' as any)
  }

  function navigateToMyListings() {
    Toast.show({
      type: 'info',
      text1: 'Meus anúncios em desenvolvimento',
      text2: 'Esta funcionalidade estará disponível em breve!'
    })
  }

  function navigateToFavorites() {
    checkAuth(() => {
      router.push('/favorites' as any)
    })
  }

  function navigateToChats() {
    checkAuth(() => {
      router.push('/chat' as any)
    })
  }

  function navigateToViews() {
    Toast.show({
      type: 'info',
      text1: 'Visualizações em desenvolvimento', 
      text2: 'Estatísticas de visualizações em breve!'
    })
  }

  function navigateToEditProfile() {
    checkAuth(() => {
      router.push('/edit-profile')
    })
  }

  function navigateToSettings() {
    router.push('/settings')
  }

  function navigateToHelp() {
    Toast.show({
      type: 'info',
      text1: 'Ajuda em desenvolvimento',
      text2: 'Central de ajuda estará disponível em breve!'
    })
  }

  function navigateToNotifications() {
    Toast.show({
      type: 'info',
      text1: 'Notificações em desenvolvimento',
      text2: 'Sistema de notificações estará disponível em breve!'
    })
  }

  function navigateToPrivacy() {
    Toast.show({
      type: 'info', 
      text1: 'Privacidade em desenvolvimento',
      text2: 'Controles de privacidade estarão disponíveis em breve!'
    })
  }

  // Função para refresh manual dos dados do perfil
  async function handleRefresh(): Promise<void> {
    if (!isAuthenticated || !user?.id) return

    setRefreshing(true)
    
    try {
      // 🔄 Usar hook global de invalidação para refresh manual
      await invalidateByContext('manual-refresh')
      
      // Recarregar listings do usuário através do store
      await fetchUserListings(user.id)
      
      Toast.show({
        type: 'success',
        text1: 'Profile refreshed',
        text2: 'Your data has been updated'
      })
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to refresh',
        text2: 'Please try again'
      })
    } finally {
      setRefreshing(false)
    }
  }

  return {
    user,
    isAuthenticated,
    userListings,
    favoriteCount: favorites.length,
    loading,
    refreshing,
    error: undefined, // TODO: implementar tratamento de erro
    handleLogin,
    handleLogout,
    handleRefresh,
    navigateToCreateListing,
    navigateToMyListings,
    navigateToFavorites,
    navigateToChats,
    navigateToViews,
    navigateToEditProfile,
    navigateToSettings,
    navigateToNotifications,
    navigateToPrivacy,
    navigateToHelp
  }
}