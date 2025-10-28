import React from 'react';
import { View } from 'react-native';

import { useModalStore } from '@store/modalStore';
import { VStack } from '@components/ui/vstack';
import { HStack } from '@components/ui/hstack';
import { Text } from '@components/ui/text';
import { Button, ButtonText } from '@components/ui/button';
import { MagnifyingGlass, XCircle, Funnel } from 'phosphor-react-native';
import { colors } from '@theme/colors';
import ModalWrapper from '../Wrapper';

interface ModalSearchProps {}

export default function ModalSearch(props: ModalSearchProps) {
    const { modal, setModal } = useModalStore();

    const close = () => {
        setModal(null);
    };

    const handleSearchHelp = () => {
        close();
        // Adicionar lógica para mostrar dicas de busca ou tutorial
    };

    const handleAdvancedFilters = () => {
        close();
        // Adicionar lógica para abrir filtros avançados
    };

    const searchData = modal?.searchData || {
        query: '',
        resultsCount: 0,
        suggestions: [],
        hasError: false,
        isEmpty: false
    };
    const {
        query,
        resultsCount,
        suggestions,
        hasError,
        isEmpty
    } = searchData;

    return (
        <ModalWrapper fadeclose={close} title="Search Results">
            <VStack space="lg" className="py-4">
                {/* Search Status */}
                <HStack className="items-center justify-between p-3 rounded-lg" 
                       style={{ backgroundColor: colors.neutral[800] }}>
                    <HStack className="items-center" space="md">
                        <MagnifyingGlass size={20} color={colors.accent[500]} />
                        <VStack>
                            <Text className="text-white font-medium">
                                "{query}"
                            </Text>
                            <Text className="text-neutral-400 text-sm">
                                {hasError ? 'Search failed' : 
                                 isEmpty ? 'No results found' :
                                 `${resultsCount} cars found`}
                            </Text>
                        </VStack>
                    </HStack>
                    
                    {hasError && (
                        <XCircle size={20} color={colors.error[500]} />
                    )}
                </HStack>

                {/* Suggestions */}
                {isEmpty && suggestions.length > 0 && (
                    <VStack space="md">
                        <Text className="text-white font-medium">
                            Try searching for:
                        </Text>
                        <VStack space="sm">
                            {suggestions.slice(0, 3).map((suggestion: string, index: number) => (
                                <Button
                                    key={index}
                                    variant="outline"
                                    size="sm"
                                    onPress={() => {
                                        close();
                                        modal?.onSuggestionSelect?.(suggestion);
                                    }}
                                    style={{ 
                                        borderColor: colors.neutral[600],
                                        backgroundColor: 'transparent'
                                    }}
                                >
                                    <ButtonText style={{ color: colors.neutral[300] }}>
                                        {suggestion}
                                    </ButtonText>
                                </Button>
                            ))}
                        </VStack>
                    </VStack>
                )}

                {/* Error Message */}
                {hasError && (
                    <View className="p-3 rounded-lg" style={{ backgroundColor: colors.error[900] }}>
                        <Text className="text-error-400 text-center">
                            Failed to search for cars. Please check your connection and try again.
                        </Text>
                    </View>
                )}

                {/* Action Buttons */}
                <VStack space="md">
                    {/* Advanced Filters Button */}
                    <Button 
                        onPress={handleAdvancedFilters}
                        variant="outline"
                        style={{ 
                            borderColor: colors.accent[500],
                            backgroundColor: 'transparent'
                        }}
                    >
                        <HStack className="items-center" space="sm">
                            <Funnel size={16} color={colors.accent[500]} />
                            <ButtonText style={{ color: colors.accent[500] }}>
                                Advanced Filters
                            </ButtonText>
                        </HStack>
                    </Button>

                    {/* Search Help Button */}
                    <Button 
                        onPress={handleSearchHelp}
                        variant="outline"
                        style={{ 
                            borderColor: colors.neutral[600],
                            backgroundColor: 'transparent'
                        }}
                    >
                        <ButtonText style={{ color: colors.neutral[300] }}>
                            Search Tips
                        </ButtonText>
                    </Button>

                    {/* Close Button */}
                    <Button 
                        onPress={close} 
                        variant='solid'
                        style={{ backgroundColor: colors.primary[500] }}
                    >
                        <ButtonText style={{ color: colors.neutral[50] }}>
                            {hasError ? 'Try Again' : 'Continue Searching'}
                        </ButtonText>
                    </Button>
                </VStack>
            </VStack>
        </ModalWrapper>
    );
}