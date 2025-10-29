import React from 'react'
import { RefreshControl, FlatList, Pressable } from 'react-native'
import { SafeAreaView } from '@components/ui/safe-area-view'
import { 
  Car, 
  Plus,
  DotsThreeVertical,
  Eye,
  Heart,
  Share,
  PencilSimple,
  Trash,
  CurrencyCircleDollar
} from 'phosphor-react-native'

import { VStack } from '@components/ui/vstack'
import { HStack } from '@components/ui/hstack'
import { Text } from '@components/ui/text'
import { Box } from '@components/ui/box'
import { Center } from '@components/ui/center'
import { Image } from '@components/ui/image'
import { Spinner } from '@components/ui/spinner'

import { colors } from '@theme/colors'
import useMyListingsController from '@controllers/useMyListingsController'
import type { Car as CarType } from '@/types/car'

// Componente do card de carro
function MyListingCard({ car, onPress, onEdit, onDelete, onMarkAsSold, onShare, getStatusColor, getStatusLabel }: {
  car: CarType
  onPress: () => void
  onEdit: () => void
  onDelete: () => void
  onMarkAsSold: () => void
  onShare: () => void
  getStatusColor: (status: string) => string
  getStatusLabel: (status: string) => string
}) {
  const [showOptions, setShowOptions] = React.useState(false)

  return (
    <Pressable 
      onPress={onPress}
      className="mb-4"
    >
      <Box 
        className="rounded-xl p-4 border"
        style={{ 
          backgroundColor: colors.neutral[800],
          borderColor: colors.neutral[700]
        }}
      >
        {/* Header com título e status */}
        <HStack className="justify-between items-start mb-3">
          <VStack className="flex-1 mr-3">
            <Text 
              className="text-lg font-bold"
              style={{ color: colors.neutral[100] }}
              numberOfLines={1}
            >
              {car.title}
            </Text>
            <Text 
              className="text-sm"
              style={{ color: colors.neutral[400] }}
            >
              {car.brand} {car.model} • {car.year}
            </Text>
          </VStack>

          {/* Status badge */}
          <Box 
            className="px-3 py-1 rounded-full"
            style={{ backgroundColor: getStatusColor(car.status) + '20' }}
          >
            <Text 
              className="text-xs font-semibold"
              style={{ color: getStatusColor(car.status) }}
            >
              {getStatusLabel(car.status)}
            </Text>
          </Box>
        </HStack>

        {/* Imagem e informações */}
        <HStack className="mb-3">
          {/* Imagem */}
          <Box className="w-20 h-20 rounded-lg overflow-hidden mr-3">
            {car.images && car.images.length > 0 ? (
              <Image
                source={{ uri: car.images[0] }}
                className="w-full h-full"
                style={{ backgroundColor: colors.neutral[700] }}
              />
            ) : (
              <Center 
                className="w-full h-full"
                style={{ backgroundColor: colors.neutral[700] }}
              >
                <Car size={24} color={colors.neutral[500]} />
              </Center>
            )}
          </Box>

          {/* Informações principais */}
          <VStack className="flex-1">
            {/* Preço */}
            <HStack className="items-center mb-2">
              <CurrencyCircleDollar size={16} color={colors.accent[500]} />
              <Text 
                className="text-lg font-bold ml-1"
                style={{ color: colors.accent[500] }}
              >
                R$ {car.price.toLocaleString()}
              </Text>
            </HStack>

            {/* Estatísticas */}
            <HStack className="items-center">
              <Eye size={14} color={colors.neutral[400]} />
              <Text 
                className="text-xs ml-1 mr-4"
                style={{ color: colors.neutral[400] }}
              >
                {car.views} views
              </Text>

              {car.km && (
                <>
                  <Text 
                    className="text-xs mr-1"
                    style={{ color: colors.neutral[400] }}
                  >
                    •
                  </Text>
                  <Text 
                    className="text-xs"
                    style={{ color: colors.neutral[400] }}
                  >
                    {car.km.toLocaleString()} km
                  </Text>
                </>
              )}
            </HStack>
          </VStack>
        </HStack>

        {/* Ações */}
        <HStack className="justify-between items-center pt-3 border-t" style={{ borderTopColor: colors.neutral[700] }}>
          <Text 
            className="text-xs"
            style={{ color: colors.neutral[500] }}
          >
            Posted {new Date(car.createdAt).toLocaleDateString()}
          </Text>

          <HStack className="items-center">
            {/* Compartilhar */}
            <Pressable 
              onPress={onShare}
              className="p-2 mr-2"
            >
              <Share size={18} color={colors.neutral[400]} />
            </Pressable>

            {/* Editar (apenas se disponível) */}
            {car.status === 'available' && (
              <Pressable 
                onPress={onEdit}
                className="p-2 mr-2"
              >
                <PencilSimple size={18} color={colors.neutral[400]} />
              </Pressable>
            )}

            {/* Marcar como vendido (apenas se disponível) */}
            {car.status === 'available' && (
              <Pressable 
                onPress={onMarkAsSold}
                className="p-2 mr-2"
              >
                <CurrencyCircleDollar size={18} color={colors.success[500]} />
              </Pressable>
            )}

            {/* Deletar */}
            <Pressable 
              onPress={onDelete}
              className="p-2"
            >
              <Trash size={18} color={colors.error[500]} />
            </Pressable>
          </HStack>
        </HStack>
      </Box>
    </Pressable>
  )
}

// Componente de estado vazio
function EmptyState({ onCreateListing }: { onCreateListing: () => void }) {
  return (
    <Center className="flex-1 px-8">
      <Box 
        className="w-20 h-20 rounded-full items-center justify-center mb-6"
        style={{ backgroundColor: colors.accent[500] + '20' }}
      >
        <Car size={32} color={colors.accent[500]} weight="fill" />
      </Box>

      <Text 
        className="text-xl font-bold text-center mb-2"
        style={{ color: colors.neutral[100] }}
      >
        No listings yet
      </Text>
      
      <Text 
        className="text-base text-center mb-8"
        style={{ color: colors.neutral[400] }}
      >
        Create your first car listing and start selling!
      </Text>

      <Pressable
        onPress={onCreateListing}
        className="bg-accent-500 px-8 py-4 rounded-xl flex-row items-center"
        style={{ backgroundColor: colors.accent[500] }}
      >
        <Plus size={20} color={colors.neutral[900]} weight="bold" />
        <Text 
          className="text-base font-bold ml-2"
          style={{ color: colors.neutral[900] }}
        >
          Create Listing
        </Text>
      </Pressable>
    </Center>
  )
}

export default function MyListingsScreen() {
  const {
    // Dados
    cars,
    isAuthenticated,
    
    // Estados
    isLoading,
    refreshing,
    isEmpty,
    hasActiveCars,
    hasSoldCars,
    
    // Ações
    handleRefresh,
    handleCarPress,
    handleCreateListing,
    handleEditCar,
    handleDeleteCar,
    handleMarkAsSold,
    handleShareCar,
    requireAuth,
    getStatusColor,
    getStatusLabel
  } = useMyListingsController()

  // Se não estiver logado, mostrar tela de login
  if (!isAuthenticated) {
    return (
      <SafeAreaView 
        className="flex-1 px-6"
        style={{ backgroundColor: colors.neutral[900] }}
      >
        <Center className="flex-1">
          <Box 
            className="w-20 h-20 rounded-full items-center justify-center mb-6"
            style={{ backgroundColor: colors.neutral[800] }}
          >
            <Car size={32} color={colors.neutral[400]} />
          </Box>

          <Text 
            className="text-xl font-bold text-center mb-2"
            style={{ color: colors.neutral[100] }}
          >
            Login Required
          </Text>
          
          <Text 
            className="text-base text-center"
            style={{ color: colors.neutral[400] }}
          >
            Please login to view your listings
          </Text>
        </Center>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView 
      className="flex-1"
      style={{ backgroundColor: colors.neutral[900] }}
    >
      <VStack className="flex-1">
        
        {/* Header */}
        <HStack className="justify-between items-center px-6 pt-4 pb-6">
          <VStack>
            <Text 
              className="text-2xl font-bold"
              style={{ color: colors.neutral[100] }}
            >
              My Listings
            </Text>
            <Text 
              className="text-sm"
              style={{ color: colors.neutral[400] }}
            >
              {hasActiveCars} active • {hasSoldCars} sold
            </Text>
          </VStack>

          <Pressable
            onPress={() => requireAuth(handleCreateListing)}
            className="w-12 h-12 rounded-xl items-center justify-center"
            style={{ backgroundColor: colors.accent[500] }}
          >
            <Plus size={24} color={colors.neutral[900]} weight="bold" />
          </Pressable>
        </HStack>

        {/* Conteúdo */}
        {isLoading ? (
          <Center className="flex-1">
            <Spinner size="large" />
            <Text 
              className="text-sm mt-4"
              style={{ color: colors.neutral[400] }}
            >
              Loading your listings...
            </Text>
          </Center>
        ) : isEmpty ? (
          <EmptyState onCreateListing={() => requireAuth(handleCreateListing)} />
        ) : (
          <FlatList
            data={cars}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <MyListingCard
                car={item}
                onPress={() => handleCarPress(item)}
                onEdit={() => handleEditCar(item)}
                onDelete={() => handleDeleteCar(item)}
                onMarkAsSold={() => handleMarkAsSold(item)}
                onShare={() => handleShareCar(item)}
                getStatusColor={getStatusColor}
                getStatusLabel={getStatusLabel}
              />
            )}
            contentContainerStyle={{ 
              padding: 24,
              paddingTop: 0
            }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor={colors.accent[500]}
                colors={[colors.accent[500]]}
              />
            }
          />
        )}
      </VStack>
    </SafeAreaView>
  )
}