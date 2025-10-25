import React, { useState } from 'react';
import { View } from 'react-native';

import { useModalStore } from '@store/modalStore';
import { Button, ButtonText } from '@components/ui/button';
import { colors } from '@theme/colors';
import ModalWrapper from '../Wrapper';

interface ModalOptionsProps {}

export default function ModalOptions(props: ModalOptionsProps) {
    const { modal, setModal } = useModalStore();
    const [loading, setLoading] = useState<number | null>(null);

    const close = () => {
        setModal(null);
    };

    const handleOptionPress = async (index: number, action: () => void) => {
        setLoading(index);
        await action();
        setLoading(null);
        close();
    };

    const getButtonStyle = (variant?: string) => {
        switch (variant) {
            case 'primary':
                return { backgroundColor: colors.primary[500] };
            case 'secondary':
                return { backgroundColor: colors.neutral[800] };
            case 'success':
                return { backgroundColor: colors.success[500] };
            case 'danger':
                return { backgroundColor: colors.error[500] };
            default:
                return { backgroundColor: colors.primary[500] };
        }
    };

    const getTextStyle = (variant?: string) => {
        switch (variant) {
            case 'secondary':
                return { color: colors.neutral[200] };
            default:
                return { color: colors.neutral[50] };
        }
    };

    return (
        <ModalWrapper fadeclose={close} title={modal?.title || 'Escolha uma opção'}>
            <View className="space-y-3">
                {modal?.options?.map((option, index) => (
                    <Button
                        key={index}
                        onPress={() => handleOptionPress(index, option.action)}
                        variant='solid'
                        style={getButtonStyle(option.variant)}
                        disabled={loading !== null}
                    >
                        <ButtonText style={getTextStyle(option.variant)}>
                            {option.title}
                        </ButtonText>
                    </Button>
                ))}
                
                <View className="mt-4">
                    <Button 
                        onPress={close} 
                        variant='outline'
                        style={{ 
                            borderColor: colors.neutral[700],
                            backgroundColor: colors.neutral[800] 
                        }}
                    >
                        <ButtonText style={{ color: colors.neutral[200] }}>
                            Cancelar
                        </ButtonText>
                    </Button>
                </View>
            </View>
        </ModalWrapper>
    );
}