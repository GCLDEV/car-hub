export interface Car {
  id: string
  title: string
  brand: string
  model: string
  year: number
  price: number
  km: number
  fuelType: string
  transmission: string
  category: string
  color: string
  description: string
  images: string[]
  location: string
  cityState: string
  specs: CarSpecs
  seller: Seller
  status: 'available' | 'sold' | 'reserved'
  views: number
  createdAt: string
  updatedAt: string
}

export interface CarSpecs {
  engine: string
  doors: number
  seats: number
  horsepower?: number
  torque?: string
  acceleration?: string
  topSpeed?: string
  consumption?: {
    city: string
    highway: string
    combined: string
  }
  features: string[]
}

export interface Seller {
  id: string
  name: string
  avatar?: string
  phone: string
  email?: string
  location: string
  rating?: number
  reviewsCount?: number
  isDealer: boolean
  verifiedPhone: boolean
}

export interface CarFilters {
  q?: string // General search query
  brand?: string
  model?: string
  category?: string
  yearFrom?: number
  yearTo?: number
  priceFrom?: number
  priceTo?: number
  kmFrom?: number
  kmTo?: number
  fuelType?: string
  transmission?: string
  color?: string
  location?: string
  sortBy?: 'price_asc' | 'price_desc' | 'year_asc' | 'year_desc' | 'km_asc' | 'km_desc' | 'created_at'
  page?: number
  limit?: number
}

export interface CarSearchResult {
  results: Car[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface CreateCarRequest {
  title: string
  brand: string
  model: string
  year: number
  price: number
  km: number
  fuelType: string
  transmission: string
  color: string
  description: string
  images: string[]
  location: string
  cityState: string
  specs: Partial<CarSpecs>
}