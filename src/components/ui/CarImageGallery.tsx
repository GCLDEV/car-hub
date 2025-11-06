import React, { useState, useRef } from 'react'
import { Dimensions, FlatList, ViewToken } from 'react-native'
import { Box } from '@components/ui/box'
import { HStack } from '@components/ui/hstack'
import { Text } from '@components/ui/text'
import { Image } from '@components/ui/image'
import { colors } from '@theme/colors'

const { width } = Dimensions.get('window')
const imageHeight = 300

interface CarImageGalleryProps {
  images: string[]
}

export default function CarImageGallery({ images }: CarImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const flatListRef = useRef<FlatList>(null)

  // Garantir que sempre temos pelo menos uma imagem
  const safeImages = images.length > 0 
    ? images 
    : ['https://via.placeholder.com/400x300/333/fff?text=No+Image']

  function handleViewableItemsChanged({ viewableItems }: { viewableItems: ViewToken[] }) {
    if (viewableItems.length > 0 && viewableItems[0].index !== null) {
      setActiveIndex(viewableItems[0].index)
    }
  }

  function renderImageItem({ item, index }: { item: string; index: number }) {
    return (
      <Box className="relative" style={{ width, height: imageHeight }}>
        <Image 
          source={{ uri: item }}
          alt={`Car image ${index + 1}`}
          className="w-full h-full"
          style={{ 
            resizeMode: 'cover'
          }}
        />
      </Box>
    )
  }

  return (
    <Box className="relative w-full" style={{ height: imageHeight }}>
      {/* Carousel de Imagens */}
      <FlatList
        ref={flatListRef}
        data={safeImages}
        renderItem={renderImageItem}
        keyExtractor={(item, index) => `image-${index}`}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50
        }}
      />

      {/* Indicadores de Página (apenas se tiver mais de 1 imagem) */}
      {safeImages.length > 1 && (
        <Box className="absolute bottom-4 left-0 right-0 items-center">
          <HStack space="xs" className="px-3 py-2 rounded-full" style={{ backgroundColor: colors.alpha.black[60] }}>
            {safeImages.map((_, index) => (
              <Box
                key={index}
                className="rounded-full"
                style={{
                  width: 8,
                  height: 8,
                  backgroundColor: index === activeIndex 
                    ? colors.accent[500] 
                    : colors.alpha.white[40]
                }}
              />
            ))}
          </HStack>
        </Box>
      )}

      {/* Contador de Imagem (canto superior direito) */}
      {safeImages.length > 1 && (
        <Box 
          className="absolute top-4 right-4 px-3 py-1 rounded-full"
          style={{ backgroundColor: colors.alpha.black[60] }}
        >
          <Text className="text-white text-sm font-medium">
            {activeIndex + 1}/{safeImages.length}
          </Text>
        </Box>
      )}
    </Box>
  )
}