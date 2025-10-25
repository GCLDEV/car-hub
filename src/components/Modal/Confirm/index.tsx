import React, { useState } from 'react';
import { View } from 'react-native';

import { useModalStore } from '@store/modalStore';
import { Button, ButtonText } from '@components/ui/button';
import { colors } from '@theme/colors';
import ModalWrapper from '../Wrapper';


interface ModalConfirmProps {}

export default function ModalConfirm(props: ModalConfirmProps) {
    const { modal, setModal } = useModalStore()
    const [loading, setLoading] = useState<boolean>(false)

    const close = () => {
        setModal(null)
    }

    const refuse = () => {
        close()
    }

    const confirm = async () => {
        if (modal?.action && typeof modal.action === 'function') {
            setLoading(true)
            await modal.action()
            setLoading(false)
        }
        close()
    }

    return (
        <>
            <ModalWrapper fadeclose={close} title={modal?.title}>
                <Button 
                    onPress={confirm} 
                    variant={modal?.isDestructive ? 'solid' : 'solid'} 
                    className="mb-4"
                    style={{ 
                        backgroundColor: modal?.isDestructive ? colors.error[500] : colors.primary[500] 
                    }}
                >
                    <ButtonText style={{ color: colors.neutral[50] }}>
                        {modal?.confirmText || 'Confirmar'}
                    </ButtonText>
                </Button>
                
                <Button 
                    onPress={refuse} 
                    variant='outline' 
                    style={{ 
                        borderColor: colors.neutral[700],
                        backgroundColor: colors.neutral[800] 
                    }}
                >
                    <ButtonText style={{ color: colors.neutral[200] }}>
                        {modal?.cancelText || 'Cancelar'}
                    </ButtonText>
                </Button>
            </ModalWrapper>
        </>
    );
}



