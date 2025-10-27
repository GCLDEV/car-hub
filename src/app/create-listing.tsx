import React from 'react'
import { ScrollView, KeyboardAvoidingView, Platform, Pressable } from 'react-native'
import { SafeAreaView } from '@components/ui/safe-area-view'
import { 
  Car, 
  ArrowLeft,
  Palette,
  Engine,
  GearSix,
  MapPin,
  CurrencyCircleDollar,
  Gauge,
  Calendar,
  FileText
} from 'phosphor-react-native'

import { VStack } from '@components/ui/vstack'
import { HStack } from '@components/ui/hstack'
import { Text } from '@components/ui/text'
import { Box } from '@components/ui/box'
import { Center } from '@components/ui/center'

import AuthInput from '@components/ui/AuthInput'
import AuthSelect from '@components/ui/AuthSelect'
import AuthButton from '@components/ui/AuthButton'

import { colors } from '@theme/colors'
import useCreateListingController from '@controllers/useCreateListingController'
import { useRouter } from 'expo-router'

export default function CreateListingScreen() {
  const router = useRouter()
  
  const {
    control,
    loading,
    errors,
    carBrands,
    fuelTypes,
    transmissionTypes,
    carColors,
    availableModels,
    onSubmit,
    generateTitle
  } = useCreateListingController()

  const handleBack = () => {
    router.back()
  }

  return (
    <SafeAreaView 
      className="flex-1"
      style={{ backgroundColor: colors.neutral[900] }}
    >
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <VStack className="flex-1 px-6 pt-12 pb-6" space="lg">
            
            {/* Header */}
            <HStack className="items-center justify-between mb-4">
              <Pressable onPress={handleBack} className="p-2">
                <ArrowLeft size={24} color={colors.neutral[100]} />
              </Pressable>
              
              <Center>
                <Box 
                  className="w-12 h-12 rounded-xl items-center justify-center"
                  style={{ backgroundColor: '#F1C40F' }}
                >
                  <Car size={24} color={colors.neutral[900]} weight="fill" />
                </Box>
              </Center>
              
              <Box className="w-8" />
            </HStack>

            {/* Title */}
            <VStack space="sm" className="mb-6">
              <Text 
                className="text-3xl font-bold text-center"
                style={{ color: colors.neutral[100] }}
              >
                Anunciar Veículo
              </Text>
              <Text 
                className="text-base text-center"
                style={{ color: colors.neutral[400] }}
              >
                Preencha as informações do seu carro
              </Text>
            </VStack>

            {/* Form */}
            <VStack space="lg" className="mb-8">
              
              {/* Informações Básicas */}
              <VStack space="md">
                <Text 
                  className="text-lg font-semibold"
                  style={{ color: colors.neutral[200] }}
                >
                  Informações Básicas
                </Text>

                <AuthSelect
                  label="Marca"
                  name="brand"
                  control={control}
                  placeholder="Selecione a marca"
                  icon={<Car size={20} color={colors.neutral[400]} />}
                  options={carBrands.map(brand => ({ label: brand, value: brand }))}
                  error={errors.brand}
                />

                {availableModels.length > 0 && (
                  <AuthSelect
                    label="Modelo"
                    name="model"
                    control={control}
                    placeholder="Selecione o modelo"
                    icon={<Car size={20} color={colors.neutral[400]} />}
                    options={availableModels.map(model => ({ label: model, value: model }))}
                    error={errors.model}
                  />
                )}

                <AuthInput
                  label="Ano"
                  name="year"
                  control={control}
                  placeholder="2020"
                  icon={<Calendar size={20} color={colors.neutral[400]} />}
                  keyboardType="numeric"
                  error={errors.year}
                />

                <AuthInput
                  label="Quilometragem (km)"
                  name="km"
                  control={control}
                  placeholder="50000"
                  icon={<Gauge size={20} color={colors.neutral[400]} />}
                  keyboardType="numeric"
                  error={errors.km}
                />

                <AuthInput
                  label="Preço (R$)"
                  name="price"
                  control={control}
                  placeholder="50000"
                  icon={<CurrencyCircleDollar size={20} color={colors.neutral[400]} />}
                  keyboardType="numeric"
                  error={errors.price}
                />
              </VStack>

              {/* Características */}
              <VStack space="md">
                <Text 
                  className="text-lg font-semibold"
                  style={{ color: colors.neutral[200] }}
                >
                  Características
                </Text>

                <AuthSelect
                  label="Combustível"
                  name="fuelType"
                  control={control}
                  placeholder="Tipo de combustível"
                  icon={<Engine size={20} color={colors.neutral[400]} />}
                  options={fuelTypes.map(fuel => ({ label: fuel, value: fuel }))}
                  error={errors.fuelType}
                />

                <AuthSelect
                  label="Câmbio"
                  name="transmission"
                  control={control}
                  placeholder="Tipo de câmbio"
                  icon={<GearSix size={20} color={colors.neutral[400]} />}
                  options={transmissionTypes.map(trans => ({ label: trans, value: trans }))}
                  error={errors.transmission}
                />

                <AuthSelect
                  label="Cor"
                  name="color"
                  control={control}
                  placeholder="Cor do veículo"
                  icon={<Palette size={20} color={colors.neutral[400]} />}
                  options={carColors.map(color => ({ label: color, value: color }))}
                  error={errors.color}
                />

                <AuthInput
                  label="Motor"
                  name="engine"
                  control={control}
                  placeholder="1.0, 1.6, 2.0..."
                  icon={<Engine size={20} color={colors.neutral[400]} />}
                  error={errors.engine}
                />

                <AuthInput
                  label="Número de Portas"
                  name="doors"
                  control={control}
                  placeholder="4"
                  icon={<Car size={20} color={colors.neutral[400]} />}
                  keyboardType="numeric"
                  error={errors.doors}
                />

                <AuthInput
                  label="Número de Lugares"
                  name="seats"
                  control={control}
                  placeholder="5"
                  icon={<Car size={20} color={colors.neutral[400]} />}
                  keyboardType="numeric"
                  error={errors.seats}
                />
              </VStack>

              {/* Detalhes */}
              <VStack space="md">
                <Text 
                  className="text-lg font-semibold"
                  style={{ color: colors.neutral[200] }}
                >
                  Detalhes
                </Text>

                <AuthInput
                  label="Título do Anúncio"
                  name="title"
                  control={control}
                  placeholder="Ex: Civic 2020 automático baixa km"
                  icon={<FileText size={20} color={colors.neutral[400]} />}
                  error={errors.title}
                />

                <AuthInput
                  label="Localização"
                  name="location"
                  control={control}
                  placeholder="São Paulo, SP"
                  icon={<MapPin size={20} color={colors.neutral[400]} />}
                  error={errors.location}
                />

                <AuthInput
                  label="Descrição"
                  name="description"
                  control={control}
                  placeholder="Descreva o estado do veículo, opcionais, histórico..."
                  icon={<FileText size={20} color={colors.neutral[400]} />}
                  error={errors.description}
                />
              </VStack>
            </VStack>

            {/* Create Button */}
            <AuthButton
              title="Criar Anúncio"
              onPress={() => onSubmit()}
              loading={loading}
              loadingText="Criando anúncio..."
              className="mb-8"
              variant="primary"
            />
          </VStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}