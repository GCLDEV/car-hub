import { Car, CarFilters, CarSearchResult } from '@/types/car'
import { 
  getMockCarsList, 
  getMockCarById, 
  searchMockCars 
} from '../mockData'
import api from './client'
import type { CreateListingFormData } from '@/utils/validation'

// ========================================
// 🎭 MOCK DATA API - REMOVIDO APIs EXTERNAS
// ========================================

// Buscar lista de carros
export async function getCarsList(filters?: CarFilters): Promise<CarSearchResult> {
  return await getMockCarsList(filters)
}

// Buscar carro por ID
export async function getCarById(id: string): Promise<Car | null> {
  return await getMockCarById(id)
}

// Buscar carros por texto
export async function searchCars(query: string, filters?: CarFilters): Promise<CarSearchResult> {
  return await searchMockCars(query, filters)
}

// Criar novo carro no Strapi
export async function createCar(data: CreateListingFormData): Promise<Car> {
  try {
    // Transformar dados do form para o formato do Strapi
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
        features: data.features || []
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
      images: [], // TODO: Implementar upload de imagens
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

// Função para testar conectividade (sempre retorna sucesso com mock)
export async function testAPI() {
  return {
    success: true,
    message: 'Mock API funcionando perfeitamente!',
    timestamp: new Date().toISOString(),
    data: {
      carsCount: 10,
      version: '1.0.0-mock'
    }
  }
}