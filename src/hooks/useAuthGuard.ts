import { useCallback } from 'react'
import { useRouter } from 'expo-router'
import { useAuthStore } from '@store/authStore'
import { useModalStore } from '@store/modalStore'

/**
 * Hook para verificar autenticação antes de executar ações
 * 
 * COMO USAR:
 * 
 * const { checkAuth } = useAuthGuard()
 * 
 * // Em qualquer ação que precisa de login
 * const handleFavorite = () => {
 *   checkAuth(() => {
 *     // Código que só executa se estiver logado
 *     addToFavorites(carId)
 *   })
 * }
 */

export default function useAuthGuard() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const { setModal } = useModalStore()

  const checkAuth = useCallback((callback: () => void) => {
    if (isAuthenticated) {
      // Se estiver logado, executa a ação diretamente
      callback()
    } else {
      // Se não estiver logado, mostra modal de confirmação
      setModal({
        type: 'confirm',
        title: 'Para realizar esta ação, você precisa estar logado. Deseja fazer login agora?',
        confirmText: 'Fazer login',
        cancelText: 'Cancelar',
        action: () => {
          // Redireciona para tela de login
          router.push('/auth/login')
        }
      })
    }
  }, [isAuthenticated, setModal, router])

  return {
    checkAuth,
    isAuthenticated
  }
}