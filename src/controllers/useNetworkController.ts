import { useEffect, useState } from 'react'
import * as Network from 'expo-network'
import { useNetworkStore } from '@store/networkStore'
import { useOfflineCacheStore } from '@store/offlineCacheStore'

interface NetworkInfo {
  isConnected: boolean
  isOnline: boolean
  networkType: string | null
  lastConnectedAt: string | null
  hasOfflineQueue: boolean
}

export default function useNetworkController() {
  const [isInitialized, setIsInitialized] = useState(false)
  
  const {
    isConnected,
    networkType,
    lastConnectedAt,
    setNetworkState,
    updateConnectionStatus,
    getConnectionInfo
  } = useNetworkStore()
  
  const {
    offlineQueue,
    clearExpiredCache
  } = useOfflineCacheStore()

  // Initialize network monitoring
  useEffect(() => {
    async function initializeNetwork() {
      try {
        // Get initial network state
        await updateConnectionStatus()
        
        // Clear any expired cache on startup
        clearExpiredCache()
        
        setIsInitialized(true)
      } catch (error) {
        console.error('Error initializing network monitoring:', error)
        setIsInitialized(true)
      }
    }

    initializeNetwork()
  }, [updateConnectionStatus, clearExpiredCache])

  // Monitor network changes
  useEffect(() => {
    if (!isInitialized) return

    let networkSubscription: ReturnType<typeof setInterval>

    async function checkNetworkStatus() {
      try {
        const networkState = await Network.getNetworkStateAsync()
        
        setNetworkState({
          isConnected: networkState.isConnected ?? false,
          networkType: networkState.type,
          isInternetReachable: networkState.isInternetReachable
        })
      } catch (error) {
        console.error('Error checking network status:', error)
        setNetworkState({
          isConnected: false,
          isInternetReachable: false
        })
      }
    }

    // Check network status periodically
    networkSubscription = setInterval(checkNetworkStatus, 5000) // Every 5 seconds

    // Cleanup
    return () => {
      if (networkSubscription) {
        clearInterval(networkSubscription)
      }
    }
  }, [isInitialized, setNetworkState])

  // Manual refresh of network status
  async function refreshNetworkStatus(): Promise<void> {
    try {
      await updateConnectionStatus()
    } catch (error) {
      console.error('Error refreshing network status:', error)
    }
  }

  // Get comprehensive network info
  async function getNetworkInfo(): Promise<NetworkInfo> {
    const connectionInfo = await getConnectionInfo()
    
    return {
      isConnected: connectionInfo.isConnected,
      isOnline: connectionInfo.isConnected && connectionInfo.isInternetReachable !== false,
      networkType: connectionInfo.networkType,
      lastConnectedAt: connectionInfo.lastConnectedAt,
      hasOfflineQueue: offlineQueue.length > 0
    }
  }

  // Check if device is online (connected + internet reachable)
  function isDeviceOnline(): boolean {
    return isConnected && useNetworkStore.getState().isInternetReachable !== false
  }

  // Check if device was recently online (within last hour)
  function wasRecentlyOnline(): boolean {
    if (!lastConnectedAt) return false
    
    const lastConnection = new Date(lastConnectedAt).getTime()
    const oneHourAgo = Date.now() - (60 * 60 * 1000) // 1 hour
    
    return lastConnection > oneHourAgo
  }

  return {
    // State
    isConnected,
    isOnline: isDeviceOnline(),
    networkType,
    lastConnectedAt,
    hasOfflineQueue: offlineQueue.length > 0,
    isInitialized,

    // Actions
    refreshNetworkStatus,
    getNetworkInfo,
    isDeviceOnline,
    wasRecentlyOnline
  }
}