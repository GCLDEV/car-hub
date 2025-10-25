import React from 'react'
import { ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { VStack } from '@components/ui/vstack'
import { HStack } from '@components/ui/hstack'
import { Box } from '@components/ui/box'
import { Text } from '@components/ui/text'
import { Pressable } from '@components/ui/pressable'

import CarImageGallery from '@components/ui/CarImageGallery'
import CarDescription from '@components/ui/CarDescription'
import CarPriceRating from '@components/ui/CarPriceRating'
import CarSpecsGrid from '@components/ui/CarSpecsGrid'
import CarActionButtons from '@components/ui/CarActionButtons'
import LoadingState from '@components/ui/LoadingState'
import ErrorState from '@components/ui/ErrorState'
import { CarDetailSkeleton } from '@components/ui/CarSkeletons'

import { colors } from '@theme/colors'
import { ArrowLeft, Share, Heart } from 'phosphor-react-native'
import useController from './controller'

export default function CarDetailsScreen() {
  const {
    car,
    loading,
    error,
    isFavorite,
    toggleFavorite,
    handleContact,
    handleShare,
    goBack,
    similarCars
  } = useController()

  if (loading) {
    return (
      <SafeAreaView 
        style={{ flex: 1, backgroundColor: colors.neutral[900] }}
      >
        {/* Header com botão de voltar funcionando */}
        <HStack 
          className="justify-between items-center px-4 py-3"
          style={{ 
            backgroundColor: colors.alpha.black[30],
          }}
        >
          <Pressable
            onPress={goBack}
            className="w-10 h-10 rounded-full items-center justify-center"
            style={{ backgroundColor: colors.alpha.black[50] }}
          >
            <ArrowLeft size={24} color={colors.neutral[100]} weight="bold" />
          </Pressable>
          
          <HStack space="sm">
            <Pressable
              className="w-10 h-10 rounded-full items-center justify-center"
              style={{ backgroundColor: colors.alpha.black[50] }}
            >
              <Share size={20} color={colors.neutral[100]} weight="bold" />
            </Pressable>
            
            <Pressable
              className="w-10 h-10 rounded-full items-center justify-center"
              style={{ backgroundColor: colors.alpha.black[50] }}
            >
              <Heart size={20} color={colors.neutral[100]} weight="bold" />
            </Pressable>
          </HStack>
        </HStack>
        
        {/* Skeleton do conteúdo */}
        <ScrollView showsVerticalScrollIndicator={false}>
          <CarDetailSkeleton />
        </ScrollView>
      </SafeAreaView>
    )
  }
  
  if (error) return <ErrorState message={error} onRetry={goBack} />
  if (!car) return null

  // Mock de imagens múltiplas (já que a API retorna apenas uma)
  const carImages = [
    car.images?.[0] || 'https://via.placeholder.com/1920x1080/333/fff?text=No+Image',
    car.images?.[0] || 'https://via.placeholder.com/1920x1080/333/fff?text=No+Image',
    car.images?.[0] || 'https://via.placeholder.com/1920x1080/333/fff?text=No+Image'
  ]

  // Especificações para o grid
  const carSpecsData = {
    year: car.year || 2020,
    km: car.km || 45000,
    fuelType: car.fuelType || 'Gasoline',
    transmission: car.transmission || 'Manual',
    engine: 'V6 3.0L',
    color: car.color || 'Black'
  }

  const handleCall = () => {
    // TODO: Implementar ligação para vendedor
  }

  const handleChat = () => {
    // TODO: Implementar chat com vendedor
  }

  const handleTestDrive = () => {
    // TODO: Implementar agendamento de test drive
  }

  return (
    <SafeAreaView 
      style={{ flex: 1, backgroundColor: colors.neutral[900] }}
    >
      {/* Header com botão de voltar */}
      <HStack 
        className="justify-between items-center px-4 py-3"
        style={{ 
          backgroundColor: colors.alpha.black[30],
          
        }}
      >
        <Pressable
          onPress={goBack}
          className="w-10 h-10 rounded-full items-center justify-center"
          style={{ backgroundColor: colors.alpha.black[50] }}
        >
          <ArrowLeft size={24} color={colors.neutral[100]} weight="bold" />
        </Pressable>
        
        <HStack space="sm">
          <Pressable
            onPress={handleShare}
            className="w-10 h-10 rounded-full items-center justify-center"
            style={{ backgroundColor: colors.alpha.black[50] }}
          >
            <Share size={20} color={colors.neutral[100]} weight="bold" />
          </Pressable>
          
          <Pressable
            onPress={toggleFavorite}
            className="w-10 h-10 rounded-full items-center justify-center"
            style={{ backgroundColor: colors.alpha.black[50] }}
          >
            <Heart 
              size={20} 
              color={isFavorite ? colors.error[500] : colors.neutral[100]} 
              weight={isFavorite ? "fill" : "bold"}
            />
          </Pressable>
        </HStack>
      </HStack>
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
      >
        <VStack className="flex-1">
          {/* Galeria de Imagens */}
          <CarImageGallery images={carImages} />
          
          {/* Descrição */}
          <CarDescription 
            title={car.title}
            description={car.description || `Este ${car.title} é uma excelente opção para quem busca conforto, economia e tecnologia. Equipado com motor potente e transmissão ${car.transmission || 'manual'}, oferece uma condução suave e eficiente. Ideal para uso urbano e viagens longas. Veículo em excelente estado de conservação.`}
            brand={car.title?.split(' ')[0] || 'Honda'}
            model={car.title?.split(' ')[1] || 'Civic'}
            year={car.year || 2020}
          />
          
          {/* Preço e Rating */}
          <CarPriceRating 
            price={car.price || 85000}
            rating={9.5}
            isFavorite={isFavorite}
            onFavoritePress={toggleFavorite}
          />
          
          {/* Especificações */}
          <Box className="px-4">
            <CarSpecsGrid {...carSpecsData} />
          </Box>
          
          {/* Botões de Ação */}
          <CarActionButtons 
            onCallPress={handleCall}
            onChatPress={handleChat}
            onTestDrivePress={handleTestDrive}
          />
        </VStack>
      </ScrollView>
    </SafeAreaView>
  )
}