import React from 'react'
import { ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'

import { VStack } from '@components/ui/vstack'
import { Text } from '@components/ui/text'

import { colors } from '@theme/colors'

export default function CreateListingScreen() {
  const router = useRouter()

  const handleBack = () => {
    router.back()
  }

  return (
    <SafeAreaView 
      style={{ flex: 1, backgroundColor: colors.neutral[900] }}
    >
      <ScrollView 
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
      >
        <VStack className="flex-1 p-4">
          <Text className="text-white text-lg">
            Tela de criação de anúncio em desenvolvimento...
          </Text>
          
          <Text className="text-gray-400 mt-4">
            Se você consegue ver este header dourado, o problema estava no GlobalHeader component.
          </Text>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  )
}