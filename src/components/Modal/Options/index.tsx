import React, { useState } from 'react';
import { View } from 'react-native';
import { Camera, Image as ImageIcon } from 'phosphor-react-native';

import { useModalStore } from '@store/modalStore';
import { Button, ButtonText } from '@components/ui/button';
import { HStack } from '@components/ui/hstack';
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
        try {
            if (typeof action === 'function') {
                await action();
            }
        } catch (error) {
            console.error('Error executing modal option action:', error);
        } finally {
            setLoading(null);
            close();
        }
    };

    const getButtonStyle = (variant?: string) => {
        switch (variant) {
            case 'primary':
                return { backgroundColor: colors.accent[500] };
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

    const getButtonVariant = (variant?: string): 'solid' | 'outline' | 'link' => {
        // Garantir que sempre retornamos um variant válido
        return 'solid';
    };

    const getTextStyle = (variant?: string) => {
        switch (variant) {
            case 'secondary':
                return { color: colors.neutral[200] };
            default:
                return { color: colors.neutral[900] };
        }
    };

    const getIcon = (title: string, variant?: string) => {
        const iconColor = variant === 'secondary' ? colors.neutral[200] : colors.neutral[900];
        
        if (title.toLowerCase().includes('camera') || title.toLowerCase().includes('take')) {
            return <Camera size={20} color={iconColor} weight="bold" />;
        }
        if (title.toLowerCase().includes('photo') || title.toLowerCase().includes('library') || title.toLowerCase().includes('gallery') || title.toLowerCase().includes('choose')) {
            return <ImageIcon size={20} color={iconColor} weight="bold" />;
        }
        return null;
    };

    const isPhotoModal = modal?.title?.toLowerCase().includes('photo');

    return (
        <ModalWrapper fadeclose={close} title={modal?.title || 'Choose an option'}>
            <View style={{ gap: 12 }}>
                {modal?.options?.map((option, index) => {
                    if (!option) return null;
                    const icon = getIcon(option?.title || '', option?.variant);
                    return (
                        <Button
                            key={index}
                            onPress={() => handleOptionPress(index, option?.action || (() => {}))}
                            style={getButtonStyle(option?.variant)}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                                {icon}
                                <ButtonText style={getTextStyle(option?.variant)}>
                                    {option?.title || 'Option'}
                                </ButtonText>
                            </View>
                        </Button>
                    );
                })}
                
                <View style={{ marginTop: 8, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.neutral[800] }}>
                    <Button 
                        onPress={close}
                        style={{ 
                            borderColor: colors.neutral[700],
                            backgroundColor: colors.neutral[800]
                        }}
                    >
                        <ButtonText style={{ color: colors.neutral[300] }}>
                            Cancel
                        </ButtonText>
                    </Button>
                </View>
            </View>
        </ModalWrapper>
    );
}