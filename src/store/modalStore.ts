import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

/**
 * 📱 MODAL STORE - Gerenciamento Global de Modals
 * 
 * COMO USAR:
 * 
 * // Importar o hook
 * import { useModalStore } from '@/store/modalStore';
 * 
 * // No componente
 * const { setModal } = useModalStore();
 * 
 * // Modal de confirmação simples
 * setModal({
 *   type: 'confirm',
 *   title: 'Deseja excluir este item?',
 *   action: () => deleteItem()
 * });
 * 
 * // Modal de confirmação destrutivo (botão vermelho)
 * setModal({
 *   type: 'confirm',
 *   title: 'Remover veículo permanentemente?',
 *   confirmText: 'Remover',
 *   cancelText: 'Cancelar',
 *   isDestructive: true,
 *   action: () => removeVehicle()
 * });
 * 
 * // Fechar modal
 * setModal(null);
 * 
 * // Modal de múltiplas opções
 * setModal({
 *   type: 'options',
 *   title: 'Escolha uma opção',
 *   options: [
 *     { title: '📷 Câmera', action: () => openCamera(), variant: 'primary' },
 *     { title: '🖼️ Galeria', action: () => openGallery(), variant: 'secondary' }
 *   ]
 * });
 * 
 * // Outros tipos de modal
 * setModal({ type: 'info', title: 'Informação importante' });
 */

// Tipos para o estado do modal
export interface ModalState {
  type?: 'confirm' | 'info' | 'options' | string;
  title?: string;
  action?: () => void;
  // Opções para customizar o modal de confirmação
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  // Opções para modal de múltiplas escolhas
  options?: Array<{
    title: string;
    action: () => void;
    variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'white' | 'outline';
  }>;
}

// Interface da store de modal
interface ModalStoreState {
  // Estado
  modal: ModalState | null;
  
  // Ações
  setModal: (modal: ModalState | null) => void;
}

// Criação da store de modal
export const useModalStore = create<ModalStoreState>()(
  devtools(
    (set) => ({
      // Estado inicial
      modal: null,

      // Setar modal
      setModal: (modal: ModalState | null) => {
        set(
          {
            modal,
          },
          false,
          'modal/setModal'
        );
      },
    }),
    {
      name: 'ModalStore',
    }
  )
);


