import React from 'react'
import { ScrollView, RefreshControl } from 'react-native'
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

// Funções utilitárias para tratamento de dados
function formatPrice(price: unknown): number {
  const numPrice = Number(price)
  return isNaN(numPrice) || numPrice <= 0 ? 0 : numPrice
}

function formatYear(year: unknown): number {
  const numYear = Number(year)
  const currentYear = new Date().getFullYear()
  return isNaN(numYear) || numYear < 1900 || numYear > currentYear + 1 ? 0 : numYear
}

function formatKm(km: unknown): number {
  const numKm = Number(km)
  return isNaN(numKm) || numKm < 0 ? 0 : numKm
}

function formatString(value: unknown, fallback = 'Não informado'): string {
  if (typeof value === 'string' && value.trim()) return value.trim()
  return fallback
}

export default function CarDetailsScreen() {
  const {
    car,
    loading,
    refreshing,
    error,
    isFavorite,
    toggleFavorite,
    handleContact,
    handleShare,
    handleRefresh,
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
        <ScrollView 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.accent[500]}
              colors={[colors.accent[500]]}
            />
          }
        >
          <CarDetailSkeleton />
        </ScrollView>
      </SafeAreaView>
    )
  }
  
  if (error) return <ErrorState message={error} onRetry={goBack} />
  if (!car) return null

  // Dados tratados e formatados
  const safeCarData = {
    title: formatString(car.title, 'Veículo sem nome'),
    description: formatString(car.description, 'Descrição não disponível'),
    brand: formatString(car.brand, 'Marca não informada'),
    model: formatString(car.model, 'Modelo não informado'),
    year: formatYear(car.year),
    price: formatPrice(car.price),
    km: formatKm(car.km),
    fuelType: formatString(car.fuelType, 'Combustível não informado'),
    transmission: formatString(car.transmission, 'Câmbio não informado'),
    color: formatString(car.color, 'Cor não informada'),
    images: Array.isArray(car.images) && car.images.length > 0 
      ? car.images 
      : ['https://via.placeholder.com/1920x1080/333/fff?text=Imagem+Indisponível']
  }

  // Especificações para o grid com dados tratados
  const carSpecsData = {
    year: safeCarData.year,
    km: safeCarData.km ,
    fuelType: safeCarData.fuelType,
    transmission: safeCarData.transmission,
    engine: formatString(car.specs?.engine, 'engine not informed'),
    color: safeCarData.color
  }

  const handleCall = () => {
    Toast.show({
      type: 'info',
      text1: 'Funcionalidade em desenvolvimento',
      text2: 'A ligação direta estará disponível em breve!'
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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.accent[500]}
            colors={[colors.accent[500]]}
          />
        }
      >
        <VStack className="flex-1">
          {/* Galeria de Imagens */}
          <CarImageGallery images={safeCarData.images} />
          
          {/* Descrição */}
          <CarDescription 
            title={safeCarData.title}
            description={safeCarData.description}
            brand={safeCarData.brand}
            model={safeCarData.model}
            year={safeCarData.year}
          />
          
          {/* Preço e Rating */}
          <CarPriceRating 
            price={safeCarData.price}
            isFavorite={isFavorite}
            onFavoritePress={toggleFavorite}
          />
          
          {/* Especificações */}
          <Box className="px-4">
            <CarSpecsGrid 
              year={carSpecsData.year}
              km={carSpecsData.km}
              fuelType={carSpecsData.fuelType}
              transmission={carSpecsData.transmission}
              engine={carSpecsData.engine}
              color={carSpecsData.color}
            />
          </Box>
          
          {/* Botões de Ação */}
          <CarActionButtons 
            onCallPress={handleCall}
            onChatPress={handleContact}
            onTestDrivePress={handleTestDrive}
          />
        </VStack>
      </ScrollView>
    </SafeAreaView>
  )
}