import { Car, CarFilters, CarSearchResult } from '@/types/car'
import api, { SERVER_BASE_URL } from './client'
import type { CreateListingFormData } from '@/utils/validation'
import { uploadMultipleImages } from './upload'
import { useNetworkStore } from '@store/networkStore'
import { useOfflineCacheStore } from '@store/offlineCacheStore'

// ========================================
// 🚀 STRAPI API INTEGRATION
// ========================================

// Transform Strapi car response to app Car format
function transformStrapiCar(strapiCar: any): Car {
  return {
    id: strapiCar.id.toString(),
    title: strapiCar.title,
    brand: strapiCar.brand,
    model: strapiCar.model,
    year: strapiCar.year,
    price: typeof strapiCar.price === 'string' ? parseInt(strapiCar.price) : strapiCar.price,
    km: strapiCar.km,
    fuelType: strapiCar.fuelType,
    transmission: strapiCar.transmission,
    category: strapiCar.category,
    color: strapiCar.color,
    description: strapiCar.description,
    location: strapiCar.location,
    cityState: strapiCar.cityState || strapiCar.location,
    images: strapiCar.images?.map((img: any) => {
      // Se já tem URL completa (S3), usar diretamente
      if (img.url?.startsWith('http')) {
        return img.url;
      }
      // Se é URL relativa do Strapi, construir URL completa
      if (img.url) {
        return `${SERVER_BASE_URL}${img.url}`;
      }
      // Fallback para placeholder apenas se não houver imagem
      return null;
    }).filter(Boolean) || [],
    specs: {
      engine: strapiCar.engine || '',
      doors: strapiCar.doors || 4,
      seats: strapiCar.seats || 5,
      features: strapiCar.features || []
    },
    seller: {
      id: strapiCar.seller?.id ? strapiCar.seller.id.toString() : `unknown-${strapiCar.id}`,
      name: strapiCar.seller?.username || strapiCar.seller?.name || 'Vendedor Autorizado',
      phone: strapiCar.seller?.phone || '(11) 99999-9999',
      location: strapiCar.location,
      isDealer: strapiCar.seller?.isDealer || false,
      verifiedPhone: true
    },
    status: strapiCar.status || 'available',
    views: strapiCar.views || 0,
    createdAt: strapiCar.createdAt,
    updatedAt: strapiCar.updatedAt
  }
}

// Generate cache key for filters
function generateCacheKey(filters?: CarFilters): string {
  if (!filters) return 'cars-all'
  
  const keyParts: string[] = ['cars']
  if (filters.category) keyParts.push(`cat-${filters.category}`)
  if (filters.brand) keyParts.push(`brand-${filters.brand}`)
  if (filters.model) keyParts.push(`model-${filters.model}`)
  if (filters.fuelType) keyParts.push(`fuel-${filters.fuelType}`)
  if (filters.transmission) keyParts.push(`trans-${filters.transmission}`)
  if (filters.location) keyParts.push(`loc-${filters.location}`)
  if (filters.priceFrom || filters.priceTo) {
    keyParts.push(`price-${filters.priceFrom || 0}-${filters.priceTo || 999999}`)
  }
  
  return keyParts.join('-')
}

// Buscar lista de carros da API Strapi (com cache offline)
export async function getCarsList(filters?: CarFilters): Promise<CarSearchResult> {
  const networkState = useNetworkStore.getState()
  const cacheStore = useOfflineCacheStore.getState()
  const cacheKey = generateCacheKey(filters)

  // Try to get from cache first if offline or as fallback
  const cachedData = cacheStore.getCachedCars(cacheKey)
  
  // If offline, return cached data or throw error (less restrictive check)
  if (networkState.isConnected === false) {
    if (cachedData) {
      return cachedData.data
    }
    throw new Error('No internet connection and no cached data available')
  }

  try {
    // Build query parameters for Strapi
    const params: any = {
      'populate[images]': true,
      'populate[seller]': true,
      'sort': 'createdAt:desc',
      'pagination[pageSize]': 25  // Default page size
    }

    // Add filters if provided
    if (filters) {
      if (filters.category) {
        params['filters[category][$eq]'] = filters.category
      }
      if (filters.brand) params['filters[brand][$eq]'] = filters.brand
      if (filters.model) params['filters[model][$eq]'] = filters.model
      if (filters.yearFrom) params['filters[year][$gte]'] = filters.yearFrom
      if (filters.yearTo) params['filters[year][$lte]'] = filters.yearTo
      if (filters.priceFrom) params['filters[price][$gte]'] = filters.priceFrom
      if (filters.priceTo) params['filters[price][$lte]'] = filters.priceTo
      if (filters.fuelType) params['filters[fuelType][$eq]'] = filters.fuelType
      if (filters.transmission) params['filters[transmission][$eq]'] = filters.transmission
      if (filters.location) params['filters[location][$containsi]'] = filters.location
      if (filters.page) {
        params['pagination[page]'] = filters.page
        params['pagination[pageSize]'] = 25  // Consistent page size
      }
    }

    const response = await api.get('/cars', { params })
    
    const cars = response.data.data.map(transformStrapiCar)
    const pagination = response.data.meta.pagination

    const result: CarSearchResult = {
      results: cars,
      pagination: {
        page: pagination.page,
        limit: pagination.pageSize,
        total: pagination.total,
        totalPages: pagination.pageCount,
        hasNext: pagination.page < pagination.pageCount,
        hasPrev: pagination.page > 1
      }
    }

    // Cache the result for offline access
    cacheStore.setCachedCars(result, cacheKey)

    return result
  } catch (error) {
    // If API fails but we have cached data, return it
    if (cachedData) {
      console.warn('API failed, returning cached data:', error)
      return cachedData.data
    }
    
    // Otherwise, throw the error
    throw error
  }
}



// Busca avançada com endpoint customizado do Strapi
export async function searchCarsAdvanced(filters?: CarFilters): Promise<CarSearchResult> {
  const networkState = useNetworkStore.getState()
  const cacheStore = useOfflineCacheStore.getState()
  const cacheKey = generateCacheKey(filters)

  // Try to get from cache first if offline or as fallback
  const cachedData = cacheStore.getCachedCars(cacheKey)
  
  // If offline, return cached data or throw error
  if (!networkState.isConnected || !networkState.isInternetReachable) {
    if (cachedData) {
      return cachedData.data
    }
    throw new Error('No internet connection and no cached data available')
  }

  try {
    // Build query parameters for custom search endpoint
    const params: any = {}

    if (filters) {
      // General search query
      if (filters.q) params.q = filters.q
      
      // Specific filters
      if (filters.brand) params.brand = filters.brand
      if (filters.model) params.model = filters.model
      if (filters.category) params.category = filters.category
      if (filters.fuelType) params.fuelType = filters.fuelType
      if (filters.transmission) params.transmission = filters.transmission
      if (filters.color) params.color = filters.color
      if (filters.location) params.location = filters.location
      
      // Range filters
      if (filters.yearFrom) params.yearFrom = filters.yearFrom
      if (filters.yearTo) params.yearTo = filters.yearTo
      if (filters.priceFrom) params.priceFrom = filters.priceFrom
      if (filters.priceTo) params.priceTo = filters.priceTo
      if (filters.kmFrom) params.kmFrom = filters.kmFrom
      if (filters.kmTo) params.kmTo = filters.kmTo
      
      // Sorting and pagination
      if (filters.sortBy) params.sortBy = filters.sortBy
      if (filters.page) params.page = filters.page
      if (filters.limit) params.pageSize = filters.limit
    }

    const response = await api.get('/cars/search', { params })
    
    const cars = response.data.data.map(transformStrapiCar)
    const pagination = response.data.meta.pagination

    const result: CarSearchResult = {
      results: cars,
      pagination: {
        page: pagination.page,
        limit: pagination.pageSize,
        total: pagination.total,
        totalPages: pagination.pageCount,
        hasNext: pagination.page < pagination.pageCount,
        hasPrev: pagination.page > 1
      }
    }

    // Cache the result for offline access
    cacheStore.setCachedCars(result, cacheKey)

    return result
  } catch (error) {
    // If API fails but we have cached data, return it
    if (cachedData) {
      console.warn('Advanced search API failed, returning cached data:', error)
      return cachedData.data
    }
    
    // Otherwise, throw the error
    throw error
  }
}

// Buscar carro por ID da API Strapi (com cache offline)
export async function getCarById(id: string): Promise<Car | null> {
  const networkState = useNetworkStore.getState()
  const cacheStore = useOfflineCacheStore.getState()

  // Try to get from cache first if offline
  const cachedCar = cacheStore.getCachedCarDetail(id)
  
  // If offline, return cached data or throw error
  if (!networkState.isConnected || !networkState.isInternetReachable) {
    if (cachedCar) {
      return cachedCar
    }
    throw new Error('No internet connection and no cached car data available')
  }

  try {
    const response = await api.get(`/cars/${id}`, {
      params: {
        'populate[images]': true,
        'populate[seller]': true
      }
    })
    
    const car = transformStrapiCar(response.data.data)
    
    // Cache the car details for offline access
    cacheStore.setCachedCarDetail(id, car)
    
    return car
  } catch (error) {
    // If API fails but we have cached data, return it
    if (cachedCar) {
      console.warn('API failed, returning cached car data:', error)
      return cachedCar
    }
    
    // Otherwise, throw the error
    throw error
  }
}

// Buscar carros por texto (search) - com cache offline
export async function searchCars(query: string, filters?: CarFilters): Promise<CarSearchResult> {
  const networkState = useNetworkStore.getState()
  const cacheStore = useOfflineCacheStore.getState()
  
  // Generate cache key for search
  const searchFilters = { ...filters, search: query }
  const cacheKey = generateCacheKey(searchFilters)
  
  // Try to get from cache first if offline
  const cachedData = cacheStore.getCachedCars(cacheKey)
  
  // If offline, return cached data or perform local search
  if (!networkState.isConnected || !networkState.isInternetReachable) {
    if (cachedData) {
      return cachedData.data
    }
    
    // Try to search in all cached cars as fallback
    const allCachedData = cacheStore.getCachedCars('cars-all')
    if (allCachedData) {
      const filteredResults = allCachedData.data.results.filter(car => 
        car.title.toLowerCase().includes(query.toLowerCase()) ||
        car.brand.toLowerCase().includes(query.toLowerCase()) ||
        car.model.toLowerCase().includes(query.toLowerCase())
      )
      
      return {
        results: filteredResults,
        pagination: {
          page: 1,
          limit: filteredResults.length,
          total: filteredResults.length,
          totalPages: 1,
          hasNext: false,
          hasPrev: false
        }
      }
    }
    
    throw new Error('No internet connection and no cached search data available')
  }

  try {
    const params: any = {
      'populate[images]': true,
      'populate[seller]': true,
      'sort': 'createdAt:desc',
      // Search in title, brand, and model
      '$or': [
        { title: { '$containsi': query } },
        { brand: { '$containsi': query } },
        { model: { '$containsi': query } }
      ]
    }

    // Add additional filters
    if (filters) {
      if (filters.brand) params.brand = filters.brand
      if (filters.model) params.model = filters.model
      if (filters.yearFrom) params.yearFrom = filters.yearFrom
      if (filters.yearTo) params.yearTo = filters.yearTo
      if (filters.priceFrom) params.priceFrom = filters.priceFrom
      if (filters.priceTo) params.priceTo = filters.priceTo
      if (filters.fuelType) params.fuelType = filters.fuelType
      if (filters.transmission) params.transmission = filters.transmission
      if (filters.location) params.location = filters.location
      if (filters.page) {
        params['pagination[page]'] = filters.page
        params['pagination[pageSize]'] = 10
      }
      
    }

    const response = await api.get('/cars/search', { params })
    
    const cars = response.data.data.map(transformStrapiCar)
    const pagination = response.data.meta.pagination

    const result: CarSearchResult = {
      results: cars,
      pagination: {
        page: pagination.page,
        limit: pagination.pageSize,
        total: pagination.total,
        totalPages: pagination.pageCount,
        hasNext: pagination.page < pagination.pageCount,
        hasPrev: pagination.page > 1
      }
    }

    // Cache the search result
    cacheStore.setCachedCars(result, cacheKey)

    return result
  } catch (error) {
    // If API fails but we have cached data, return it
    if (cachedData) {
      console.warn('Search API failed, returning cached data:', error)
      return cachedData.data
    }
    
    throw error
  }
}

// Criar novo carro no Strapi
export async function createCar(data: CreateListingFormData): Promise<Car> {
  try {
    // Passo 1: Fazer upload das imagens se existirem
    let imageIds: number[] = []
    if (data.images && data.images.length > 0) {
      const imageResults = await uploadMultipleImages(data.images)
      imageIds = imageResults.map(img => img.id)
    }

    // Passo 2: Transformar dados do form para o formato do Strapi
    const carData = {
      data: {
        title: data.title,
        brand: data.brand,
        model: data.model,
        category: data.category, // Campo obrigatório
        year: Number(data.year),
        price: Number(data.price.toString().replace(/\D/g, '')),
        location: data.location,
        cityState: data.location, // Usar location também como cityState
        status: 'available',
        features: data.features || [],
        // Associar as imagens enviadas
        images: imageIds,
        // ✅ O seller é automaticamente definido pelo controller do Strapi baseado no token JWT
        
        // Campos opcionais - só enviar se existirem e não forem vazios
        ...(data.km && data.km.trim() !== '' && { km: Number(data.km.toString().replace(/\D/g, '')) }),
        ...(data.fuelType && data.fuelType.trim() !== '' && { fuelType: data.fuelType }),
        ...(data.transmission && data.transmission.trim() !== '' && { transmission: data.transmission }),
        ...(data.color && data.color.trim() !== '' && { color: data.color }),
        ...(data.description && data.description.trim() !== '' && { description: data.description }),
        ...(data.engine && data.engine.trim() !== '' && { engine: data.engine }),
        ...(data.doors && data.doors.trim() !== '' && { doors: Number(data.doors) }),
        ...(data.seats && data.seats.trim() !== '' && { seats: Number(data.seats) })
      }
    }

    const response = await api.post('/cars', carData)

    // Usar a função transformStrapiCar para consistência
    const car = transformStrapiCar(response.data.data)
    return car
  } catch (error: any) {
    // Extrair erros específicos do Strapi
    const strapiError = error.response?.data?.error
    if (strapiError?.details?.errors) {
      const errorMessages = strapiError.details.errors.map((err: any) => 
        `${err.path?.join('.')}: ${err.message}`
      ).join(', ')
      throw new Error(`Erro de validação: ${errorMessages}`)
    }
    
    throw new Error(error.response?.data?.error?.message || 'Erro ao criar anúncio')
  }
}

// Buscar carros do usuário logado
export async function getUserCars(): Promise<Car[]> {
  try {
    const response = await api.get('/cars/me', {
      params: {
        'populate[images]': true,
        'populate[seller]': true,
        'sort': 'createdAt:desc'
      }
    })
    
    return response.data.data.map(transformStrapiCar)
  } catch (error: any) {
    throw new Error(error.response?.data?.error?.message || 'Erro ao buscar seus anúncios')
  }
}

// Deletar carro do usuário
export async function deleteCar(id: string): Promise<void> {
  try {
    await api.delete(`/cars/${id}`)
  } catch (error: any) {
    throw new Error(error.response?.data?.error?.message || 'Erro ao deletar anúncio')
  }
}

// Atualizar status do carro
export async function updateCarStatus(id: string, status: 'available' | 'sold' | 'reserved'): Promise<Car> {
  try {
    const response = await api.put(`/cars/${id}`, {
      data: { status }
    })
    
    return transformStrapiCar(response.data.data)
  } catch (error: any) {
    throw new Error(error.response?.data?.error?.message || 'Erro ao atualizar status')
  }
}

// Atualizar carro existente no Strapi
export async function updateCar(id: string, data: CreateListingFormData): Promise<Car> {
  try {
    // Passo 1: Fazer upload das novas imagens se existirem
    let imageIds: number[] = []
    if (data.images && data.images.length > 0) {
      // Separar imagens existentes (que já são URLs) de novas imagens (que são URIs locais)
      const existingImages = data.images.filter(img => typeof img === 'string' && img.startsWith('http'))
      const newImages = data.images.filter(img => typeof img === 'string' && !img.startsWith('http'))
      
      // Upload apenas das novas imagens
      if (newImages.length > 0) {
        const newImageResults = await uploadMultipleImages(newImages)
        imageIds = [...imageIds, ...newImageResults.map(img => img.id)]
      }
      
      // Para imagens existentes, precisamos manter as IDs (não implementado neste exemplo)
      // Por simplicidade, vamos re-enviar todas as imagens novas
      if (newImages.length > 0) {
        const allNewImages = await uploadMultipleImages(data.images)
        imageIds = allNewImages.map(img => img.id)
      }
    }

    // Passo 2: Transformar dados do form para o formato do Strapi
    const carData = {
      data: {
        title: data.title,
        brand: data.brand,
        model: data.model,
        category: data.category,
        year: Number(data.year),
        price: Number(data.price.toString().replace(/\D/g, '')),
        location: data.location,
        cityState: data.location,
        features: data.features || [],
        
        // Só atualizar imagens se houver novas
        ...(imageIds.length > 0 && { images: imageIds }),
        
        // Campos opcionais - só enviar se existirem e não forem vazios
        ...(data.km && data.km.trim() !== '' && { km: Number(data.km.toString().replace(/\D/g, '')) }),
        ...(data.fuelType && data.fuelType.trim() !== '' && { fuelType: data.fuelType }),
        ...(data.transmission && data.transmission.trim() !== '' && { transmission: data.transmission }),
        ...(data.color && data.color.trim() !== '' && { color: data.color }),
        ...(data.description && data.description.trim() !== '' && { description: data.description }),
        ...(data.engine && data.engine.trim() !== '' && { engine: data.engine }),
        ...(data.doors && data.doors.trim() !== '' && { doors: Number(data.doors) }),
        ...(data.seats && data.seats.trim() !== '' && { seats: Number(data.seats) })
      }
    }

    const response = await api.put(`/cars/${id}`, carData)

    // Usar a função transformStrapiCar para consistência
    const car = transformStrapiCar(response.data.data)
    return car
  } catch (error: any) {
    // Extrair erros específicos do Strapi
    const strapiError = error.response?.data?.error
    if (strapiError?.details?.errors) {
      const errorMessages = strapiError.details.errors.map((err: any) => 
        `${err.path?.join('.')}: ${err.message}`
      ).join(', ')
      throw new Error(`Erro de validação: ${errorMessages}`)
    }
    
    throw new Error(error.response?.data?.error?.message || 'Erro ao atualizar anúncio')
  }
}

// Função para testar conectividade com a API Strapi
export async function testAPI() {
  const response = await api.get('/cars', {
    params: {
      'pagination[pageSize]': 1
    }
  })
  
  return {
    success: true,
    message: 'Strapi API conectada com sucesso!',
    timestamp: new Date().toISOString(),
    data: {
      carsCount: response.data.meta.pagination.total,
      version: '1.0.0-strapi'
    }
  }
}