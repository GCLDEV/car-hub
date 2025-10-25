import { X } from 'phosphor-react-native';
import React, { ReactNode } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';

import { colors } from '@theme/colors';

interface ModalWrapperProps {
    fadeclose?: () => void;
    close?: () => void;
    title?: string;
    icon?: string;
    children: ReactNode;
}

export default function ModalWrapper({
    fadeclose,
    close,
    title,
    icon,
    children
}: ModalWrapperProps) {
    
    return (
        <>
            {/* Modal Container com fundo escuro */}
            <Animated.View 
                entering={FadeIn.duration(300)}
                className="absolute inset-0"
                style={{ backgroundColor: colors.alpha.black[80] }}
            >
                {/* Área de toque para fechar */}
                <TouchableOpacity 
                    onPress={fadeclose ? fadeclose : close}
                    className="flex-1 p-5"
                    activeOpacity={1}
                />
                
                {/* Modal Body */}
                <Animated.View 
                    entering={FadeInUp.delay(300).duration(300)}
                    className="px-6 py-6 rounded-t-3xl overflow-hidden"
                    style={{ 
                        backgroundColor: colors.neutral[900],
                        borderTopColor: colors.neutral[800],
                        borderTopWidth: 1
                    }}
                >
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* Header */}
                        <View className="flex-row items-center justify-between mb-8">
                            {/* Espaçador esquerdo */}
                            <View className="w-6" />
                            
                            {/* Título e ícone centralizados */}
                            <View className="flex-row items-center flex-1">
                                {title && (
                                    <Text 
                                        className="text-xl font-bold text-center flex-1"
                                        style={{ 
                                            color: colors.neutral[50] 
                                        }}
                                    >
                                        {title}
                                    </Text>
                                )}
                                {icon && (
                                    <View className="ml-2">
                                        {/* Aqui você pode adicionar o ícone se necessário */}
                                    </View>
                                )}
                            </View>
                            
                            {/* Botão de fechar ou espaçador */}
                            {close ? (
                                <TouchableOpacity 
                                    onPress={close}
                                    className="w-6 h-6 items-center justify-center"
                                >
                                    <X 
                                        size={24} 
                                        color={colors.neutral[400]} 
                                        weight="regular"
                                    />
                                </TouchableOpacity>
                            ) : (
                                <View className="w-6" />
                            )}
                        </View>
                        
                        {/* Conteúdo do Modal */}
                        <View className="pb-20">
                            {children}
                        </View>
                    </ScrollView>
                </Animated.View>
            </Animated.View>
        </>
    );
}



