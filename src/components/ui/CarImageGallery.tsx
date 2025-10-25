import React from 'react'
import { Dimensions } from 'react-native'
import { Box } from '@components/ui/box'
import { Image } from '@components/ui/image'

const { width } = Dimensions.get('window')
const imageHeight = 300 // Altura fixa de 300px para melhor visualização

interface CarImageGalleryProps {
  images: string[]
}

export default function CarImageGallery({ images }: CarImageGalleryProps) {
  // Usar apenas a primeira imagem por enquanto
  const firstImage = images[0] || 'https://via.placeholder.com/400x300/333/fff?text=No+Image'

  return (
    <Box className="relative w-full" style={{ height: imageHeight }}>
      <Image 
        source={{ uri: firstImage }}
        alt="Car image"
        className="w-full h-full"
        style={{ 
          resizeMode: 'cover'
        }}
      />
    </Box>
  )
}