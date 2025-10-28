import api from './client'
import { useNetworkStore } from '@store/networkStore'
import { useOfflineCacheStore } from '@store/offlineCacheStore'
import { useAuthStore } from '@store/authStore'

// ========================================
// 🤍 FAVORITES API INTEGRATION
// ========================================

export interface Favorite {
  id: string
  car: {
    id: string
    title: string
    brand: string
    model: string
    year: number
    price: number
    images: string[]
    location: string
  }
  createdAt: string
}

export interface FavoritesResult {
  results: Favorite[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Buscar favoritos do usuário
export async function getUserFavorites(): Promise<FavoritesResult> {
  const networkState = useNetworkStore.getState()
  const cacheStore = useOfflineCacheStore.getState()
  const authStore = useAuthStore.getState()

  if (!authStore.isAuthenticated || !authStore.token) {
    throw new Error('User must be authenticated to fetch favorites')
  }

  const cacheKey = `favorites-${authStore.user?.id}`

  // Try cache first if offline
  if (!networkState.isConnected || !networkState.isInternetReachable) {
    const cachedFavorites = cacheStore.getCachedFavorites()
    if (cachedFavorites) {
      return cachedFavorites
    }
    throw new Error('No internet connection and no cached favorites available')
  }

  try {
    const response = await api.get('/favorites', {
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    })

    const favorites = response.data.data.map((fav: any): Favorite => ({
      id: fav.id.toString(),
      car: {
        id: fav.car.id.toString(),
        title: fav.car.title,
        brand: fav.car.brand,
        model: fav.car.model,
        year: fav.car.year,
        price: fav.car.price,
        images: fav.car.images?.map((img: any) => 
          img.url?.startsWith('http') ? img.url : `http://192.168.0.8:1337${img.url}`
        ) || [],
        location: fav.car.location
      },
      createdAt: fav.createdAt
    }))

    const result: FavoritesResult = {
      results: favorites,
      pagination: response.data.meta.pagination || {
        page: 1,
        limit: favorites.length,
        total: favorites.length,
        totalPages: 1,
        hasNext: false,
        hasPrev: false
      }
    }

    // Cache for offline access
    cacheStore.setCachedFavorites(result)

    return result
  } catch (error) {
    // Try cache as fallback
    const cachedFavorites = cacheStore.getCachedFavorites()
    if (cachedFavorites) {
      console.warn('API failed, returning cached favorites:', error)
      return cachedFavorites
    }
    throw error
  }
}

// Adicionar carro aos favoritos
export async function addToFavorites(carId: string): Promise<Favorite> {
  const networkState = useNetworkStore.getState()
  const authStore = useAuthStore.getState()

  if (!authStore.isAuthenticated || !authStore.token) {
    throw new Error('User must be authenticated to add favorites')
  }

  if (!networkState.isConnected || !networkState.isInternetReachable) {
    throw new Error('Internet connection required to add favorites')
  }

  try {
    const response = await api.post('/favorites', {
      data: {
        car: carId
      }
    }, {
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    })

    const favorite: Favorite = {
      id: response.data.data.id.toString(),
      car: {
        id: response.data.data.car.id.toString(),
        title: response.data.data.car.title,
        brand: response.data.data.car.brand,
        model: response.data.data.car.model,
        year: response.data.data.car.year,
        price: response.data.data.car.price,
        images: response.data.data.car.images?.map((img: any) => 
          img.url?.startsWith('http') ? img.url : `http://192.168.0.8:1337${img.url}`
        ) || [],
        location: response.data.data.car.location
      },
      createdAt: response.data.data.createdAt
    }

    return favorite
  } catch (error: any) {
    if (error.response?.status === 400) {
      throw new Error('Car is already in your favorites')
    }
    throw new Error('Failed to add car to favorites')
  }
}

// Remover carro dos favoritos (por car ID)
export async function removeFromFavorites(carId: string): Promise<void> {
  const networkState = useNetworkStore.getState()
  const authStore = useAuthStore.getState()

  if (!authStore.isAuthenticated || !authStore.token) {
    throw new Error('User must be authenticated to remove favorites')
  }

  if (!networkState.isConnected || !networkState.isInternetReachable) {
    throw new Error('Internet connection required to remove favorites')
  }

  try {
    await api.delete(`/favorites/by-car/${carId}`, {
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    })
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error('Favorite not found')
    }
    throw new Error('Failed to remove car from favorites')
  }
}

// Verificar se um carro está nos favoritos (usado para o ícone de coração)
export async function isCarFavorited(carId: string): Promise<boolean> {
  try {
    const favorites = await getUserFavorites()
    return favorites.results.some(fav => fav.car.id === carId)
  } catch (error) {
    // Se não conseguir verificar, assume que não é favorito
    return false
  }
}