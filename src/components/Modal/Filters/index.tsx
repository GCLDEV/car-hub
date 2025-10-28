import React, { useState } from 'react';
import { View } from 'react-native';

import { useModalStore } from '@store/modalStore';
import { VStack } from '@components/ui/vstack';
import { HStack } from '@components/ui/hstack';
import { Text } from '@components/ui/text';
import { Button, ButtonText } from '@components/ui/button';
import { Input, InputField } from '@components/ui/input';
import { Select, SelectTrigger, SelectInput, SelectItem, SelectContent, SelectDragIndicatorWrapper, SelectDragIndicator, SelectIcon, SelectPortal, SelectBackdrop } from '@components/ui/select';
import { Slider } from '@components/ui/slider';
import { ChevronDownIcon } from '@components/ui/icon';
import { 
  CurrencyDollar, 
  Calendar, 
  Car, 
  Drop,
  Lightning,
  X
} from 'phosphor-react-native';
import { colors } from '@theme/colors';
import ModalWrapper from '../Wrapper';

interface ModalFiltersProps {}

export default function ModalFilters(props: ModalFiltersProps) {
    const { modal, setModal } = useModalStore();
    
    // Pegar filtros atuais do modal data
    const currentFilters = modal?.filtersData || {};
    
    // Estados locais dos filtros inicializados com valores atuais
    const [priceRange, setPriceRange] = useState([
        currentFilters.priceFrom || 0, 
        currentFilters.priceTo || 500000
    ]);
    const [yearFrom, setYearFrom] = useState(currentFilters.yearFrom?.toString() || '');
    const [yearTo, setYearTo] = useState(currentFilters.yearTo?.toString() || '');
    const [selectedBrand, setSelectedBrand] = useState(currentFilters.brand || '');
    const [selectedFuelType, setSelectedFuelType] = useState(currentFilters.fuelType || '');
    const [selectedTransmission, setSelectedTransmission] = useState(currentFilters.transmission || '');
    const [maxKm, setMaxKm] = useState(currentFilters.kmTo || 200000);

    const close = () => {
        setModal(null);
    };

    const applyFilters = () => {
        const filters = {
            priceMin: priceRange[0],
            priceMax: priceRange[1],
            yearMin: yearFrom ? parseInt(yearFrom) : undefined,
            yearMax: yearTo ? parseInt(yearTo) : undefined,
            brand: selectedBrand || undefined,
            fuelType: selectedFuelType || undefined,
            transmission: selectedTransmission || undefined,
            maxKm
        };
        
        // Chamar callback se fornecido
        modal?.onApplyFilters?.(filters);
        close();
    };

    const clearFilters = () => {
        setPriceRange([0, 500000]);
        setYearFrom('');
        setYearTo('');
        setSelectedBrand('');
        setSelectedFuelType('');
        setSelectedTransmission('');
        setMaxKm(200000);
    };

    const brands = [
        'Toyota', 'Honda', 'Volkswagen', 'BMW', 'Mercedes-Benz', 
        'Audi', 'Ford', 'Chevrolet', 'Hyundai', 'Nissan', 'Fiat'
    ];

    const fuelTypes = [
        { label: 'Gasoline', value: 'gasolina' },
        { label: 'Ethanol', value: 'etanol' },
        { label: 'Flex', value: 'flex' },
        { label: 'Diesel', value: 'diesel' },
        { label: 'Electric', value: 'elétrico' }
    ];

    const transmissionTypes = [
        { label: 'Manual', value: 'manual' },
        { label: 'Automatic', value: 'automatic' }
    ];

    return (
        <ModalWrapper fadeclose={close} title="Search Filters">
            <VStack space="xl" className="py-4">
                {/* Price Range */}
                <VStack space="md">
                    <HStack className="items-center" space="sm">
                        <CurrencyDollar size={20} color={colors.accent[500]} />
                        <Text className="text-white font-semibold">Price Range</Text>
                    </HStack>
                    <VStack space="sm">
                        <HStack className="justify-between">
                            <Text className="text-neutral-400">
                                R$ {priceRange[0].toLocaleString()}
                            </Text>
                            <Text className="text-neutral-400">
                                R$ {priceRange[1].toLocaleString()}
                            </Text>
                        </HStack>
                        {/* Aqui seria o Slider - simplificado por ora */}
                        <View className="h-2 rounded-full" style={{ backgroundColor: colors.neutral[700] }}>
                            <View className="h-full w-1/2 rounded-full" style={{ backgroundColor: colors.accent[500] }} />
                        </View>
                    </VStack>
                </VStack>

                {/* Year Range */}
                <VStack space="md">
                    <HStack className="items-center" space="sm">
                        <Calendar size={20} color={colors.accent[500]} />
                        <Text className="text-white font-semibold">Year</Text>
                    </HStack>
                    <HStack space="md">
                        <Input className="flex-1" variant="outline">
                            <InputField
                                placeholder="From"
                                value={yearFrom}
                                onChangeText={setYearFrom}
                                keyboardType="numeric"
                                style={{ color: colors.neutral[50] }}
                                placeholderTextColor={colors.neutral[400]}
                            />
                        </Input>
                        <Input className="flex-1" variant="outline">
                            <InputField
                                placeholder="To"
                                value={yearTo}
                                onChangeText={setYearTo}
                                keyboardType="numeric"
                                style={{ color: colors.neutral[50] }}
                                placeholderTextColor={colors.neutral[400]}
                            />
                        </Input>
                    </HStack>
                </VStack>

                {/* Brand */}
                <VStack space="md">
                    <HStack className="items-center" space="sm">
                        <Car size={20} color={colors.accent[500]} />
                        <Text className="text-white font-semibold">Brand</Text>
                    </HStack>
                    <Select selectedValue={selectedBrand} onValueChange={setSelectedBrand}>
                        <SelectTrigger variant="outline" size="md">
                            <SelectInput placeholder="Select brand" style={{ color: colors.neutral[50] }} />
                            <SelectIcon className="mr-3" as={ChevronDownIcon} />
                        </SelectTrigger>
                        <SelectPortal>
                            <SelectBackdrop />
                            <SelectContent>
                                <SelectDragIndicatorWrapper>
                                    <SelectDragIndicator />
                                </SelectDragIndicatorWrapper>
                                {brands.map((brand) => (
                                    <SelectItem key={brand} label={brand} value={brand} />
                                ))}
                            </SelectContent>
                        </SelectPortal>
                    </Select>
                </VStack>

                {/* Fuel Type */}
                <VStack space="md">
                    <HStack className="items-center" space="sm">
                        <Drop size={20} color={colors.accent[500]} />
                        <Text className="text-white font-semibold">Fuel Type</Text>
                    </HStack>
                    <Select selectedValue={selectedFuelType} onValueChange={setSelectedFuelType}>
                        <SelectTrigger variant="outline" size="md">
                            <SelectInput placeholder="Select fuel type" style={{ color: colors.neutral[50] }} />
                            <SelectIcon className="mr-3" as={ChevronDownIcon} />
                        </SelectTrigger>
                        <SelectPortal>
                            <SelectBackdrop />
                            <SelectContent>
                                <SelectDragIndicatorWrapper>
                                    <SelectDragIndicator />
                                </SelectDragIndicatorWrapper>
                                {fuelTypes.map((fuel) => (
                                    <SelectItem key={fuel.value} label={fuel.label} value={fuel.value} />
                                ))}
                            </SelectContent>
                        </SelectPortal>
                    </Select>
                </VStack>

                {/* Transmission */}
                <VStack space="md">
                    <HStack className="items-center" space="sm">
                        <Lightning size={20} color={colors.accent[500]} />
                        <Text className="text-white font-semibold">Transmission</Text>
                    </HStack>
                    <Select selectedValue={selectedTransmission} onValueChange={setSelectedTransmission}>
                        <SelectTrigger variant="outline" size="md">
                            <SelectInput placeholder="Select transmission" style={{ color: colors.neutral[50] }} />
                            <SelectIcon className="mr-3" as={ChevronDownIcon} />
                        </SelectTrigger>
                        <SelectPortal>
                            <SelectBackdrop />
                            <SelectContent>
                                <SelectDragIndicatorWrapper>
                                    <SelectDragIndicator />
                                </SelectDragIndicatorWrapper>
                                {transmissionTypes.map((trans) => (
                                    <SelectItem key={trans.value} label={trans.label} value={trans.value} />
                                ))}
                            </SelectContent>
                        </SelectPortal>
                    </Select>
                </VStack>

                {/* Action Buttons */}
                <VStack space="md">
                    {/* Clear Filters */}
                    <Button 
                        onPress={clearFilters}
                        variant="outline"
                        style={{ 
                            borderColor: colors.neutral[600],
                            backgroundColor: 'transparent'
                        }}
                    >
                        <HStack className="items-center" space="sm">
                            <X size={16} color={colors.neutral[300]} />
                            <ButtonText style={{ color: colors.neutral[300] }}>
                                Clear All
                            </ButtonText>
                        </HStack>
                    </Button>

                    {/* Apply Filters */}
                    <Button 
                        onPress={applyFilters}
                        variant='solid'
                        style={{ backgroundColor: colors.accent[500] }}
                    >
                        <ButtonText style={{ color: colors.neutral[900], fontWeight: 'bold' }}>
                            Apply Filters
                        </ButtonText>
                    </Button>

                    {/* Cancel */}
                    <Button 
                        onPress={close}
                        variant="outline"
                        style={{ 
                            borderColor: colors.neutral[600],
                            backgroundColor: 'transparent'
                        }}
                    >
                        <ButtonText style={{ color: colors.neutral[300] }}>
                            Cancel
                        </ButtonText>
                    </Button>
                </VStack>
            </VStack>
        </ModalWrapper>
    );
}