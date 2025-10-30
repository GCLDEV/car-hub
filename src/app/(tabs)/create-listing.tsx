import React from 'react'
import { ScrollView, KeyboardAvoidingView, Platform, Pressable, View } from 'react-native'
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
import ImageUploader from '@components/ui/ImageUploader'

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
    carCategories,
    fuelTypes,
    transmissionTypes,
    carColors,
    onSubmit,
    generateTitle,
    watch,
    setValue
  } = useCreateListingController()

  // Watch images para o componente ImageUploader
  const watchedImages = watch('images')

  const handleBack = () => {
    router.back()
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
              <Box className='px-4'></Box>
              
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
                Fill in your car information
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
                  Basic Information
                </Text>

                <AuthInput
                  label="Brand"
                  name="brand"
                  control={control}
                  placeholder="Toyota, Honda, Ford..."
                  icon={<Car size={20} color={colors.neutral[400]} />}
                  error={errors.brand}
                />

                <AuthInput
                  label="Model"
                  name="model"
                  control={control}
                  placeholder="Corolla, Civic, Focus..."
                  icon={<Car size={20} color={colors.neutral[400]} />}
                  error={errors.model}
                />

                <AuthSelect
                  label="Category"
                  name="category"
                  control={control}
                  placeholder="Select vehicle category"
                  icon={<Car size={20} color={colors.neutral[400]} />}
                  options={carCategories.map(category => ({ label: category, value: category }))}
                  error={errors.category}
                />

                <AuthInput
                  label="Year"
                  name="year"
                  control={control}
                  placeholder="2020"
                  icon={<Calendar size={20} color={colors.neutral[400]} />}
                  keyboardType="numeric"
                  error={errors.year}
                />

                <AuthInput
                  label="Mileage (km) - Optional"
                  name="km"
                  control={control}
                  placeholder="50000 (opcional)"
                  icon={<Gauge size={20} color={colors.neutral[400]} />}
                  keyboardType="numeric"
                  error={errors.km}
                />

                <AuthInput
                  label="Price (R$)"
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
                  Vehicle Photos
                </Text>

                <ImageUploader
                  images={watchedImages || []}
                  onImagesChange={(images) => {
                    setValue('images', images, { shouldValidate: true })
                  }}
                  multiple={true}
                  maxImages={10}
                  label="Add photos"
                  placeholder="Add photos of your vehicle"
                  required={true}
                  error={errors.images?.message}
                />

                <Text 
                  className="text-xs"
                  style={{ color: colors.neutral[500] }}
                >
                  Add at least one photo of your vehicle. Maximum 10 photos.
                </Text>
              </VStack>

              {/* Características */}
              <VStack space="md">
                <Text 
                  className="text-lg font-semibold"
                  style={{ color: colors.neutral[200] }}
                >
                  Features
                </Text>

                <AuthSelect
                  label="Fuel Type - Optional"
                  name="fuelType"
                  control={control}
                  placeholder="Select fuel type (opcional)"
                  icon={<Engine size={20} color={colors.neutral[400]} />}
                  options={fuelTypes.map(fuel => ({ label: fuel, value: fuel }))}
                  error={errors.fuelType}
                />

                <AuthSelect
                  label="Transmission - Optional"
                  name="transmission"
                  control={control}
                  placeholder="Select transmission type (opcional)"
                  icon={<GearSix size={20} color={colors.neutral[400]} />}
                  options={transmissionTypes.map(trans => ({ label: trans, value: trans }))}
                  error={errors.transmission}
                />

                <AuthSelect
                  label="Color - Optional"
                  name="color"
                  control={control}
                  placeholder="Select vehicle color (opcional)"
                  icon={<Palette size={20} color={colors.neutral[400]} />}
                  options={carColors.map(color => ({ label: color, value: color }))}
                  error={errors.color}
                />

                <AuthInput
                  label="Engine - Optional"
                  name="engine"
                  control={control}
                  placeholder="1.0, 1.6, 2.0... (opcional)"
                  icon={<Engine size={20} color={colors.neutral[400]} />}
                  error={errors.engine}
                />

                <AuthInput
                  label="Number of Doors - Optional"
                  name="doors"
                  control={control}
                  placeholder="4 (opcional)"
                  icon={<Car size={20} color={colors.neutral[400]} />}
                  keyboardType="numeric"
                  error={errors.doors}
                />

                <AuthInput
                  label="Number of Seats - Optional"
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
                  Details
                </Text>

                <AuthInput
                  label="Ad Title"
                  name="title"
                  control={control}
                  placeholder="Ex: 2020 Civic automatic low mileage"
                  icon={<FileText size={20} color={colors.neutral[400]} />}
                  error={errors.title}
                />

                <AuthInput
                  label="Location"
                  name="location"
                  control={control}
                  placeholder="São Paulo, SP"
                  icon={<MapPin size={20} color={colors.neutral[400]} />}
                  error={errors.location}
                />

                <AuthInput
                  label="Description - Optional"
                  name="description"
                  control={control}
                  placeholder="Describe vehicle condition, options... (opcional)"
                  icon={<FileText size={20} color={colors.neutral[400]} />}
                  error={errors.description}
                />
              </VStack>
            </VStack>

            {/* Create Button */}
            <AuthButton
              title="Create Listing"
              onPress={() => onSubmit()}
              loading={loading}
              loadingText={watchedImages?.length > 0 ? "Uploading photos..." : "Creating listing..."}
              className="mb-8"
              variant="primary"
            />
          </VStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}