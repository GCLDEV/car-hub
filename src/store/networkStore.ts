import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Network from 'expo-network'

export interface NetworkState {
  isConnected: boolean
  networkType: string | null
  isInternetReachable: boolean | null
  lastConnectedAt: string | null
}

interface NetworkStore extends NetworkState {
  // Actions
  setNetworkState: (state: Partial<NetworkState>) => void
  updateConnectionStatus: () => Promise<void>
  getConnectionInfo: () => Promise<NetworkState>
}

export const useNetworkStore = create<NetworkStore>()(
  persist(
    (set, get) => ({
      // Initial state
      isConnected: true,
      networkType: null,
      isInternetReachable: null,
      lastConnectedAt: null,

      // Set network state
      setNetworkState: (newState: Partial<NetworkState>) => {
        set((state) => {
          const updatedState = { ...state, ...newState }
          
          // Update lastConnectedAt when going from offline to online
          if (newState.isConnected && !state.isConnected) {
            updatedState.lastConnectedAt = new Date().toISOString()
          }
          
          return updatedState
        })
      },

      // Update connection status using Expo Network
      updateConnectionStatus: async () => {
        try {
          const networkState = await Network.getNetworkStateAsync()
          
          const newState: Partial<NetworkState> = {
            isConnected: networkState.isConnected ?? false,
            networkType: networkState.type,
            isInternetReachable: networkState.isInternetReachable
          }

          get().setNetworkState(newState)
        } catch (error) {
          console.error('Error updating network status:', error)
          // Assume offline if we can't check
          get().setNetworkState({ 
            isConnected: false, 
            isInternetReachable: false 
          })
        }
      },

      // Get current connection info
      getConnectionInfo: async (): Promise<NetworkState> => {
        await get().updateConnectionStatus()
        const { isConnected, networkType, isInternetReachable, lastConnectedAt } = get()
        return { isConnected, networkType, isInternetReachable, lastConnectedAt }
      }
    }),
    {
      name: 'network-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist essential state
      partialize: (state) => ({
        lastConnectedAt: state.lastConnectedAt
      })
    }
  )
)