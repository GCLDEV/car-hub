import { useEffect } from 'react'
import { useRouter } from 'expo-router'
import Toast from 'react-native-toast-message'

import { useAuthStore } from '@store/authStore'
import { useFavoritesStore } from '@store/favoritesStore'
import { useUserListingsStore } from '@store/userListingsStore'
import { useModalStore } from '@store/modalStore'
import useAuthGuard from '@hooks/useAuthGuard'

export default function useProfileController() {
  const router = useRouter()
  
  const { user, isAuthenticated, login, logout } = useAuthStore()
  const { favorites } = useFavoritesStore()
  const { listings: userListings, fetchUserListings, loading } = useUserListingsStore()
  const { setModal } = useModalStore()
  const { checkAuth } = useAuthGuard()

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

  function navigateToViews() {
    Toast.show({
      type: 'info',
      text1: 'Visualizações em desenvolvimento', 
      text2: 'Estatísticas de visualizações em breve!'
    })
  }

  function navigateToSettings() {
    Toast.show({
      type: 'info',
      text1: 'Configurações em desenvolvimento',
      text2: 'As configurações estarão disponíveis em breve!'
    })
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
    navigateToViews,
    navigateToSettings,
    navigateToNotifications,
    navigateToPrivacy,
    navigateToHelp
  }
}