import { useModalStore } from '@store/modalStore';
import { useAuthStore } from '@store/authStore';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

/**
 * 🚪 Hook Centralizado de Logout
 * 
 * Use este hook sempre que precisar implementar logout na aplicação.
 * 
 * COMO USAR:
 * 
 * import { useLogout } from '@/hooks/useLogout';
 * 
 * function MeuComponente() {
 *   const { handleLogout } = useLogout();
 * 
 *   return (
 *     <Button onPress={handleLogout} title="Sair da Conta" />
 *   );
 * }
 * 
 * BENEFÍCIOS:
 * - Modal de confirmação automático
 * - Integração com auth store
 * - Toast de sucesso
 * - Redirecionamento automático
 * - Código centralizado (DRY)
 */
export function useLogout() {
  const { setModal } = useModalStore();
  const { logout } = useAuthStore();
  const router = useRouter();

  const performLogout = async () => {
    try {
      // Executar logout no store
      logout();
      
      // Toast de sucesso
      Toast.show({
        type: 'success',
        text1: 'Signed out successfully',
        text2: 'Você foi desconectado com sucesso'
      });

      // Redirecionar para login
      router.replace('/auth/login');
      
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Logout error',
        text2: 'Tente novamente'
      });
    }
  };

  const handleLogout = () => {
    setModal({
      type: 'confirm',
      title: 'Deseja sair da sua conta?',
      confirmText: 'Sair',
      cancelText: 'Cancelar',
      isDestructive: true,
      action: performLogout
    });
  };

  return {
    handleLogout,
    performLogout // Para uso direto sem confirmação, se necessário
  };
}