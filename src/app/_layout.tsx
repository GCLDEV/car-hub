import React, { useEffect } from 'react'
import { Stack, useRouter } from 'expo-router'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { GluestackUIProvider } from '@components/ui/gluestack-ui-provider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StatusBar } from 'expo-status-bar'
import Toast from 'react-native-toast-message'

import GlobalHeader from '@components/ui/GlobalHeader'
import { useAuthStore } from '@store/authStore'
import { useFavoritesStore } from '@store/favoritesStore'
import { colors } from '@theme/colors'

import '../../global.css'
import ModalController from '@components/Modal/Controller'
import { View } from 'react-native'

// Criar query client com configuração offline-first
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry if offline
        if (error?.message?.includes('No internet connection')) {
          return false
        }
        // Retry up to 3 times for other errors
        return failureCount < 3
      },
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 30 * 60 * 1000, // 30 minutos - longer cache for offline
      networkMode: 'offlineFirst', // Keep trying even when offline
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: true, // Refetch when network comes back
    },
    mutations: {
      retry: (failureCount, error) => {
        // Don't retry mutations if offline - add to queue instead
        if (error?.message?.includes('No internet connection')) {
          return false
        }
        return failureCount < 2
      },
      networkMode: 'online', // Only run mutations when online
    },
  },
})

export default function RootLayout() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const { syncFavorites } = useFavoritesStore()

  // Sync favorites on app startup if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      syncFavorites().catch(console.warn)
    }
  }, [isAuthenticated, syncFavorites])

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
              <Stack.Screen
                name="settings"
                options={{
                  presentation: 'card',                  
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