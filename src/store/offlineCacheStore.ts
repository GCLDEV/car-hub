import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Car, CarSearchResult } from '@/types/car'

interface CachedData {
  data: CarSearchResult
  timestamp: string
  key: string
}

interface OfflineCacheState {
  // Cached cars data
  cachedCars: CachedData | null
  cachedCarDetails: Record<string, { car: Car; timestamp: string }>
  
  // Offline queue for actions
  offlineQueue: Array<{
    id: string
    type: 'create_car' | 'update_car' | 'delete_car' | 'favorite' | 'unfavorite'
    data: unknown
    timestamp: string
    retryCount: number
  }>

  // Cache management
  setCachedCars: (data: CarSearchResult, cacheKey: string) => void
  getCachedCars: (cacheKey: string) => CachedData | null
  setCachedCarDetail: (carId: string, car: Car) => void
  getCachedCarDetail: (carId: string) => Car | null
  
  // Offline queue management
  addToOfflineQueue: (action: {
    type: 'create_car' | 'update_car' | 'delete_car' | 'favorite' | 'unfavorite'
    data: unknown
  }) => void
  removeFromOfflineQueue: (actionId: string) => void
  getOfflineQueue: () => Array<{
    id: string
    type: 'create_car' | 'update_car' | 'delete_car' | 'favorite' | 'unfavorite'
    data: unknown
    timestamp: string
    retryCount: number
  }>
  clearOfflineQueue: () => void
  
  // Cache utilities
  isCacheValid: (timestamp: string, maxAgeMs?: number) => boolean
  clearExpiredCache: () => void
}

const DEFAULT_CACHE_DURATION = 15 * 60 * 1000 // 15 minutes

export const useOfflineCacheStore = create<OfflineCacheState>()(
  persist(
    (set, get) => ({
      // Initial state
      cachedCars: null,
      cachedCarDetails: {},
      offlineQueue: [],

      // Cache cars list
      setCachedCars: (data: CarSearchResult, cacheKey: string) => {
        set({
          cachedCars: {
            data,
            timestamp: new Date().toISOString(),
            key: cacheKey
          }
        })
      },

      // Get cached cars list
      getCachedCars: (cacheKey: string): CachedData | null => {
        const cached = get().cachedCars
        if (!cached || cached.key !== cacheKey) {
          return null
        }
        
        // Check if cache is still valid
        if (!get().isCacheValid(cached.timestamp)) {
          return null
        }
        
        return cached
      },

      // Cache individual car details
      setCachedCarDetail: (carId: string, car: Car) => {
        set((state) => ({
          cachedCarDetails: {
            ...state.cachedCarDetails,
            [carId]: {
              car,
              timestamp: new Date().toISOString()
            }
          }
        }))
      },

      // Get cached car details
      getCachedCarDetail: (carId: string): Car | null => {
        const cached = get().cachedCarDetails[carId]
        if (!cached) {
          return null
        }
        
        // Check if cache is still valid
        if (!get().isCacheValid(cached.timestamp)) {
          return null
        }
        
        return cached.car
      },

      // Add action to offline queue
      addToOfflineQueue: (action) => {
        const newAction = {
          id: `${Date.now()}-${Math.random()}`,
          ...action,
          timestamp: new Date().toISOString(),
          retryCount: 0
        }
        
        set((state) => ({
          offlineQueue: [...state.offlineQueue, newAction]
        }))
      },

      // Remove action from offline queue
      removeFromOfflineQueue: (actionId: string) => {
        set((state) => ({
          offlineQueue: state.offlineQueue.filter(action => action.id !== actionId)
        }))
      },

      // Get offline queue
      getOfflineQueue: () => {
        return get().offlineQueue
      },

      // Clear offline queue
      clearOfflineQueue: () => {
        set({ offlineQueue: [] })
      },

      // Check if cache is valid
      isCacheValid: (timestamp: string, maxAgeMs = DEFAULT_CACHE_DURATION): boolean => {
        const cacheTime = new Date(timestamp).getTime()
        const now = new Date().getTime()
        return (now - cacheTime) < maxAgeMs
      },

      // Clear expired cache
      clearExpiredCache: () => {
        const { cachedCars, cachedCarDetails, isCacheValid } = get()
        
        // Clear expired cars list cache
        if (cachedCars && !isCacheValid(cachedCars.timestamp)) {
          set({ cachedCars: null })
        }
        
        // Clear expired car details cache
        const validCarDetails: Record<string, { car: Car; timestamp: string }> = {}
        Object.entries(cachedCarDetails).forEach(([carId, cached]) => {
          if (isCacheValid(cached.timestamp)) {
            validCarDetails[carId] = cached
          }
        })
        
        set({ cachedCarDetails: validCarDetails })
      }
    }),
    {
      name: 'offline-cache-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Persist all cache data
      partialize: (state) => ({
        cachedCars: state.cachedCars,
        cachedCarDetails: state.cachedCarDetails,
        offlineQueue: state.offlineQueue
      })
    }
  )
)