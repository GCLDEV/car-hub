import React from 'react'
import { Stack, useRouter } from 'expo-router'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { GluestackUIProvider } from '@components/ui/gluestack-ui-provider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StatusBar } from 'expo-status-bar'
import Toast from 'react-native-toast-message'

import GlobalHeader from '@components/ui/GlobalHeader'
import { colors } from '@theme/colors'

import '../../global.css'
import ModalController from '@components/Modal/Controller'
import { View } from 'react-native'

// Criar query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 10 * 60 * 1000, // 10 minutos (era cacheTime nas versões antigas)
    },
  },
})

export default function RootLayout() {
  const router = useRouter()

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GluestackUIProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar backgroundColor="transparent" style='light' translucent />
          <View className='flex-1'
            style={{ backgroundColor: colors.neutral[900] }}>
            <Stack
              screenOptions={{                
                contentStyle: {
                  backgroundColor: colors.neutral[900],
                },
                headerShown: false,
              }}
            >
              <Stack.Screen
                name="(tabs)"
              />
              <Stack.Screen
                name="car/[id]"
                options={({ route }) => ({
                  presentation: 'modal',                  
                })}
              />
              <Stack.Screen
                name="create-listing"
                options={{
                  presentation: 'modal',                  
                }}
              />
              <Stack.Screen
                name="auth/login"
                options={{
                  presentation: 'modal',                  
                }}
              />
              <Stack.Screen
                name="auth/register"
                options={{
                  presentation: 'modal',                  
                }}
              />
            </Stack>
          </View>

          <ModalController />

          <Toast />
        </QueryClientProvider>
      </GluestackUIProvider>
    </GestureHandlerRootView>
  )
}