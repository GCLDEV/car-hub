import React from 'react';
import { View } from 'react-native';

import { useModalStore } from '@store/modalStore';
import { Button, ButtonText } from '@components/ui/button';
import { colors } from '@theme/colors';
import ModalWrapper from '../Wrapper';

interface ModalInfoProps {}

export default function ModalInfo(props: ModalInfoProps) {
    const { modal, setModal } = useModalStore();

    const close = () => {
        setModal(null);
    };

    return (
        <ModalWrapper fadeclose={close} title={modal?.title || 'Informação'}>
            <View className="py-4">
                <Button 
                    onPress={close} 
                    variant='solid'
                    style={{ backgroundColor: colors.primary[500] }}
                >
                    <ButtonText style={{ color: colors.neutral[50] }}>
                        OK
                    </ButtonText>
                </Button>
            </View>
        </ModalWrapper>
    );
}