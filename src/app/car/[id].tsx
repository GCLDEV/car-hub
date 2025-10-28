import React from 'react'
import { ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'

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
    Toast.show({
      type: 'info',
      text1: 'Funcionalidade em desenvolvimento',
      text2: 'A ligação direta estará disponível em breve!'
    })
  }

  const handleChat = () => {
    Toast.show({
      type: 'info',
      text1: 'Chat em desenvolvimento',
      text2: 'O chat com vendedores estará disponível em breve!'
    })
  }

  const handleTestDrive = () => {
    Toast.show({
      type: 'info',
      text1: 'Test Drive em desenvolvimento',
      text2: 'O agendamento de test drive estará disponível em breve!'
    })
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
          <CarImageGallery images={car.images || []} />
          
          {/* Descrição */}
          <CarDescription 
            title={car.title}
            description={car.description}
            brand={car.brand}
            model={car.model}
            year={car.year}
          />
          
          {/* Preço e Rating */}
          <CarPriceRating 
            price={car.price}
            rating={4.5} 
            isFavorite={isFavorite}
            onFavoritePress={toggleFavorite}
          />
          
          {/* Especificações */}
          <Box className="px-4">
            <CarSpecsGrid 
              year={car.year}
              km={car.km}
              fuelType={car.fuelType}
              transmission={car.transmission}
              engine={car.specs?.engine}
              color={car.color}
            />
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