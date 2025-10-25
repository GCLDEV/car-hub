import { Car, CarFilters, CarSearchResult } from '@/types/car'
import { 
  getMockCarsList, 
  getMockCarById, 
  searchMockCars 
} from '../mockData'

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