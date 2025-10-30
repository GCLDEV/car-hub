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

    const getIcon = (title: string, variant?: string) => {
        const iconColor = variant === 'secondary' ? colors.neutral[200] : colors.neutral[50];
        
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
            <View className="space-y-4">
                {isPhotoModal && (
                    <View className="mb-2">
                        <ButtonText 
                            className="text-center text-sm"
                            style={{ color: colors.neutral[400] }}
                        >
                            Choose how you want to add your profile photo
                        </ButtonText>
                    </View>
                )}
                {modal?.options?.map((option, index) => {
                    const icon = getIcon(option.title, option.variant);
                    return (
                        <Button
                            key={index}
                            onPress={() => handleOptionPress(index, option.action)}
                            variant='solid'
                            style={{
                                ...getButtonStyle(option.variant),
                                paddingVertical: 16,
                                borderRadius: 12
                            }}
                            disabled={loading !== null}
                        >
                            <HStack className="items-center justify-center" space="sm">
                                {icon}
                                <ButtonText 
                                    style={{
                                        ...getTextStyle(option.variant),
                                        fontSize: 16,
                                        fontWeight: '600'
                                    }}
                                >
                                    {option.title}
                                </ButtonText>
                            </HStack>
                        </Button>
                    );
                })}
                
                <View className="mt-2 pt-2 gap-4" style={{ borderTopWidth: 1, borderTopColor: colors.neutral[800] }}>
                    <Button 
                        onPress={close} 
                        variant='outline'
                        style={{ 
                            borderColor: colors.neutral[700],
                            backgroundColor: colors.neutral[800],
                            paddingVertical: 14,
                            borderRadius: 12
                        }}
                    >
                        <ButtonText style={{ 
                            color: colors.neutral[300],
                            fontSize: 16,
                            fontWeight: '500'
                        }}>
                            Cancel
                        </ButtonText>
                    </Button>
                </View>
            </View>
        </ModalWrapper>
    );
}