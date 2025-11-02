import React from 'react'
import { ScrollView, KeyboardAvoidingView, Platform, View } from 'react-native'
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
import { Pressable } from '@components/ui/pressable'

import AuthInput from '@components/ui/AuthInput'
import AuthSelect from '@components/ui/AuthSelect'
import AuthButton from '@components/ui/AuthButton'
import ImageUploader from '@components/ui/ImageUploader'

import { colors } from '@theme/colors'
import useEditListingController from '@controllers/useEditListingController'
import { useRouter } from 'expo-router'

export default function EditListingScreen() {
  const router = useRouter()
  
  const {
    control,
    loading,
    errors,
    carBrands,
    carCategories,
    fuelTypes,
    transmissionTypes,
    carColors,
    onSubmit,
    watch,
    setValue,
    car,
    loadingCar
  } = useEditListingController()

  // Watch images para o componente ImageUploader
  const watchedImages = watch('images')

  const handleBack = () => {
    router.back()
  }

  if (loadingCar) {
    return (
      <SafeAreaView 
        className="flex-1"
        style={{ backgroundColor: colors.neutral[900] }}
      >
        <VStack className="flex-1 justify-center items-center">
          <Text className="text-white text-lg font-semibold">
            Carregando anúncio...
          </Text>
        </VStack>
      </SafeAreaView>
    )
  }

  if (!car) {
    return (
      <SafeAreaView 
        className="flex-1"
        style={{ backgroundColor: colors.neutral[900] }}
      >
        <VStack className="flex-1 justify-center items-center px-6">
          <Text className="text-white text-lg font-semibold mb-4">
            Anúncio não encontrado
          </Text>
          <AuthButton
            title="Voltar"
            onPress={handleBack}
            variant="secondary"
          />
        </VStack>
      </SafeAreaView>
    )
  }

  return (
    <View 
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
              <Pressable
                onPress={handleBack}
                className="w-10 h-10 rounded-full items-center justify-center"
                style={{ backgroundColor: colors.neutral[800] }}
              >
                <ArrowLeft size={20} color={colors.neutral[100]} weight="bold" />
              </Pressable>
              
              <Center>
                <Box 
                  className="w-12 h-12 rounded-xl items-center justify-center"
                  style={{ backgroundColor: '#F1C40F' }}
                >
                  <Car size={24} color={colors.neutral[900]} weight="fill" />
                </Box>
              </Center>
              
              <Box className="w-10" />
            </HStack>

            {/* Title */}
            <VStack space="sm" className="mb-6">
              <Text 
                className="text-3xl font-bold text-center"
                style={{ color: colors.neutral[100] }}
              >
                Editar Anúncio
              </Text>
              <Text 
                className="text-base text-center"
                style={{ color: colors.neutral[400] }}
              >
                Atualize as informações do seu veículo
              </Text>
            </VStack>

            {/* Form */}
            <VStack space="lg" className="mb-8">
              
              {/* Basic Information */}
              <VStack space="md">
                <Text 
                  className="text-lg font-semibold"
                  style={{ color: colors.neutral[200] }}
                >
                  Informações Básicas
                </Text>

                <AuthInput
                  label="Marca"
                  name="brand"
                  control={control}
                  placeholder="Toyota, Honda, Ford..."
                  icon={<Car size={20} color={colors.neutral[400]} />}
                  error={errors.brand}
                />

                <AuthInput
                  label="Modelo"
                  name="model"
                  control={control}
                  placeholder="Corolla, Civic, Focus..."
                  icon={<Car size={20} color={colors.neutral[400]} />}
                  error={errors.model}
                />

                <AuthSelect
                  label="Categoria"
                  name="category"
                  control={control}
                  placeholder="Selecione a categoria do veículo"
                  icon={<Car size={20} color={colors.neutral[400]} />}
                  options={carCategories.map(category => ({ label: category, value: category }))}
                  error={errors.category}
                />

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
                  label="Quilometragem (km) - Opcional"
                  name="km"
                  control={control}
                  placeholder="50000 (opcional)"
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

              {/* Imagens */}
              <VStack space="md">
                <Text 
                  className="text-lg font-semibold"
                  style={{ color: colors.neutral[200] }}
                >
                  Fotos do Veículo
                </Text>

                <ImageUploader
                  images={watchedImages || []}
                  onImagesChange={(images) => {
                    setValue('images', images, { shouldValidate: true })
                  }}
                  multiple={true}
                  maxImages={10}
                  label="Editar fotos"
                  placeholder="Editar fotos do seu veículo"
                  required={true}
                  error={errors.images?.message}
                />

                <Text 
                  className="text-xs"
                  style={{ color: colors.neutral[500] }}
                >
                  Mantenha pelo menos uma foto do seu veículo. Máximo 10 fotos.
                </Text>
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
                  label="Tipo de Combustível - Opcional"
                  name="fuelType"
                  control={control}
                  placeholder="Selecione o tipo de combustível (opcional)"
                  icon={<Engine size={20} color={colors.neutral[400]} />}
                  options={fuelTypes.map(fuel => ({ label: fuel, value: fuel }))}
                  error={errors.fuelType}
                />

                <AuthSelect
                  label="Transmissão - Opcional"
                  name="transmission"
                  control={control}
                  placeholder="Selecione o tipo de transmissão (opcional)"
                  icon={<GearSix size={20} color={colors.neutral[400]} />}
                  options={transmissionTypes.map(trans => ({ label: trans, value: trans }))}
                  error={errors.transmission}
                />

                <AuthSelect
                  label="Cor - Opcional"
                  name="color"
                  control={control}
                  placeholder="Selecione a cor do veículo (opcional)"
                  icon={<Palette size={20} color={colors.neutral[400]} />}
                  options={carColors.map(color => ({ label: color, value: color }))}
                  error={errors.color}
                />

                <AuthInput
                  label="Motor - Opcional"
                  name="engine"
                  control={control}
                  placeholder="1.0, 1.6, 2.0... (opcional)"
                  icon={<Engine size={20} color={colors.neutral[400]} />}
                  error={errors.engine}
                />

                <AuthInput
                  label="Número de Portas - Opcional"
                  name="doors"
                  control={control}
                  placeholder="4 (opcional)"
                  icon={<Car size={20} color={colors.neutral[400]} />}
                  keyboardType="numeric"
                  error={errors.doors}
                />

                <AuthInput
                  label="Número de Lugares - Opcional"
                  name="seats"
                  control={control}
                  placeholder="5 (opcional)"
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
                  placeholder="Ex: Civic 2020 automático baixa quilometragem"
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
                  label="Descrição - Opcional"
                  name="description"
                  control={control}
                  placeholder="Descreva o estado do veículo, opcionais... (opcional)"
                  icon={<FileText size={20} color={colors.neutral[400]} />}
                  error={errors.description}
                />
              </VStack>
            </VStack>

            {/* Update Button */}
            <AuthButton
              title="Atualizar Anúncio"
              onPress={() => onSubmit()}
              loading={loading}
              loadingText="Salvando alterações..."
              className="mb-8"
              variant="primary"
            />
          </VStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}