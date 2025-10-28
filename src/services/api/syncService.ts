import { useNetworkStore } from '@store/networkStore'
import { useOfflineCacheStore } from '@store/offlineCacheStore'
import { useFavoritesStore } from '@store/favoritesStore'
import api from './client'

interface OfflineAction {
  id: string
  type: 'create_car' | 'update_car' | 'delete_car' | 'favorite' | 'unfavorite'
  data: unknown
  timestamp: string
  retryCount: number
}

// Sync offline queue when connection is restored
export async function syncOfflineQueue(): Promise<void> {
  const networkState = useNetworkStore.getState()
  const cacheStore = useOfflineCacheStore.getState()
  
  // Only sync if online
  if (!networkState.isConnected || !networkState.isInternetReachable) {
    console.log('Cannot sync: device is offline')
    return
  }

  const queue = cacheStore.getOfflineQueue()
  
  if (queue.length === 0) {
    console.log('No offline actions to sync')
    return
  }

  console.log(`Syncing ${queue.length} offline actions...`)

  for (const action of queue) {
    try {
      await processOfflineAction(action)
      
      // Remove from queue on success
      cacheStore.removeFromOfflineQueue(action.id)
      
      console.log(`Successfully synced action: ${action.type}`)
      
    } catch (error) {
      console.error(`Failed to sync action ${action.type}:`, error)
      
      // Don't retry certain errors
      if (error instanceof Error && 
          (error.message.includes('404') || error.message.includes('400'))) {
        console.log(`Removing invalid action from queue: ${action.type}`)
        cacheStore.removeFromOfflineQueue(action.id)
      }
    }
  }

  console.log('Offline sync completed')
}

// Process individual offline action
async function processOfflineAction(action: OfflineAction): Promise<void> {
  switch (action.type) {
    case 'favorite':
    case 'unfavorite':
      await processFavoriteAction(action)
      break
      
    case 'create_car':
      await processCreateCarAction(action)
      break
      
    case 'update_car':
      await processUpdateCarAction(action)
      break
      
    case 'delete_car':
      await processDeleteCarAction(action)
      break
      
    default:
      throw new Error(`Unknown action type: ${action.type}`)
  }
}

// Process favorite/unfavorite actions
async function processFavoriteAction(action: OfflineAction): Promise<void> {
  const data = action.data as { carId: string }
  
  // For now, favorites are handled locally only
  // In a real app, you might sync with a backend favorites API
  console.log(`Processed ${action.type} for car ${data.carId}`)
}

// Process create car actions
async function processCreateCarAction(action: OfflineAction): Promise<void> {
  const data = action.data as {
    title: string
    brand: string
    model: string
    year: number
    price: number
    // ... other car fields
  }
  
  // This would call the actual API to create the car
  const response = await api.post('/cars', { data })
  console.log(`Created car with ID: ${response.data.data.id}`)
}

// Process update car actions
async function processUpdateCarAction(action: OfflineAction): Promise<void> {
  const data = action.data as {
    carId: string
    updates: Record<string, unknown>
  }
  
  const response = await api.put(`/cars/${data.carId}`, { data: data.updates })
  console.log(`Updated car ${data.carId}`)
}

// Process delete car actions  
async function processDeleteCarAction(action: OfflineAction): Promise<void> {
  const data = action.data as { carId: string }
  
  await api.delete(`/cars/${data.carId}`)
  console.log(`Deleted car ${data.carId}`)
}

// Background sync service
export function startBackgroundSync(): void {
  const networkState = useNetworkStore.getState()
  
  // Monitor network changes and sync when coming online
  const checkAndSync = () => {
    if (networkState.isConnected && networkState.isInternetReachable) {
      syncOfflineQueue().catch(error => {
        console.error('Background sync failed:', error)
      })
    }
  }
  
  // Check every 10 seconds when online
  setInterval(() => {
    if (networkState.isConnected) {
      checkAndSync()
    }
  }, 10000)
}

// Manual sync trigger
export async function forceSyncOfflineQueue(): Promise<{ 
  success: boolean
  syncedCount: number 
  errorCount: number 
}> {
  const cacheStore = useOfflineCacheStore.getState()
  const initialQueueLength = cacheStore.getOfflineQueue().length
  
  try {
    await syncOfflineQueue()
    
    const remainingQueueLength = cacheStore.getOfflineQueue().length
    const syncedCount = initialQueueLength - remainingQueueLength
    
    return {
      success: true,
      syncedCount,
      errorCount: remainingQueueLength
    }
  } catch (error) {
    console.error('Force sync failed:', error)
    return {
      success: false,
      syncedCount: 0,
      errorCount: initialQueueLength
    }
  }
}