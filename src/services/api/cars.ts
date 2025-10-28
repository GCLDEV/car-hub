import { Car, CarFilters, CarSearchResult } from '@/types/car'
import api from './client'
import type { CreateListingFormData } from '@/utils/validation'
import { uploadMultipleImages } from './upload'

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
    color: strapiCar.color,
    description: strapiCar.description,
    location: strapiCar.location,
    cityState: strapiCar.cityState || strapiCar.location,
    images: strapiCar.images?.map((img: any) => 
      img.url?.startsWith('http') ? img.url : `http://192.168.0.8:1337${img.url}`
    ) || [
      // Placeholder images for cars without photos
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80'
    ],
    specs: {
      engine: strapiCar.engine || '',
      doors: strapiCar.doors || 4,
      seats: strapiCar.seats || 5,
      features: strapiCar.features || []
    },
    seller: {
      id: strapiCar.seller?.id?.toString() || '1',
      name: strapiCar.seller?.username || 'Vendedor Autorizado',
      phone: strapiCar.seller?.phone || '(11) 99999-9999',
      location: strapiCar.location,
      isDealer: false,
      verifiedPhone: true
    },
    status: strapiCar.status || 'available',
    views: strapiCar.views || 0,
    createdAt: strapiCar.createdAt,
    updatedAt: strapiCar.updatedAt
  }
}

// Buscar lista de carros da API Strapi
export async function getCarsList(filters?: CarFilters): Promise<CarSearchResult> {
  // Build query parameters for Strapi
  const params: any = {
    'populate[images]': true,
    'populate[seller]': true,
    'sort': 'createdAt:desc'
  }

  // Add filters if provided
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

  const response = await api.get('/cars', { params })
  
  const cars = response.data.data.map(transformStrapiCar)
  const pagination = response.data.meta.pagination

  return {
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
}

// Buscar carro por ID da API Strapi
export async function getCarById(id: string): Promise<Car | null> {
  const response = await api.get(`/cars/${id}`, {
    params: {
      'populate[images]': true,
      'populate[seller]': true
    }
  })
  
  return transformStrapiCar(response.data.data)
}

// Buscar carros por texto (search)
export async function searchCars(query: string, filters?: CarFilters): Promise<CarSearchResult> {
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

  const response = await api.get('/cars', { params })
  
  const cars = response.data.data.map(transformStrapiCar)
  const pagination = response.data.meta.pagination

  return {
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
}

// Criar novo carro no Strapi
export async function createCar(data: CreateListingFormData): Promise<Car> {
  try {
    // Passo 1: Fazer upload das imagens se existirem
    let imageIds: number[] = []
    if (data.images && data.images.length > 0) {
      console.log('📤 Fazendo upload de', data.images.length, 'imagens...')
      const imageResults = await uploadMultipleImages(data.images)
      imageIds = imageResults.map(img => img.id)
      console.log('✅ Upload concluído. IDs das imagens:', imageIds)
    }

    // Passo 2: Transformar dados do form para o formato do Strapi
    const carData = {
      data: {
        title: data.title,
        brand: data.brand,
        model: data.model,
        year: Number(data.year),
        price: Number(data.price.toString().replace(/\D/g, '')),
        km: Number(data.km.toString().replace(/\D/g, '')),
        fuelType: data.fuelType,
        transmission: data.transmission,
        color: data.color,
        description: data.description,
        location: data.location,
        cityState: data.location, // Usar location também como cityState
        engine: data.engine,
        doors: Number(data.doors),
        seats: Number(data.seats),
        status: 'available',
        features: data.features || [],
        // Associar as imagens enviadas
        images: imageIds
      }
    }

    const response = await api.post('/cars', carData)

    // Transformar resposta do Strapi para formato do app
    const strapiCar = response.data.data
    const car: Car = {
      id: strapiCar.id.toString(),
      title: strapiCar.title,
      brand: strapiCar.brand,
      model: strapiCar.model,
      year: strapiCar.year,
      price: strapiCar.price,
      km: strapiCar.km,
      fuelType: strapiCar.fuelType,
      transmission: strapiCar.transmission,
      color: strapiCar.color,
      description: strapiCar.description,
      location: strapiCar.location,
      cityState: strapiCar.cityState || strapiCar.location,
      images: strapiCar.images ? 
        strapiCar.images.map((img: any) => `http://192.168.0.8:1337${img.url}`) : 
        [], // URLs completas das imagens do Strapi
      specs: {
        engine: strapiCar.engine,
        doors: strapiCar.doors,
        seats: strapiCar.seats,
        features: strapiCar.features || []
      },
      seller: {
        id: '1', // TODO: Pegar do usuário logado
        name: 'Usuário',
        phone: '',
        location: strapiCar.location,
        isDealer: false,
        verifiedPhone: false
      },
      status: strapiCar.status,
      views: strapiCar.views || 0,
      createdAt: strapiCar.createdAt,
      updatedAt: strapiCar.updatedAt
    }

    return car
  } catch (error: any) {
    throw new Error(error.response?.data?.error?.message || 'Erro ao criar anúncio')
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