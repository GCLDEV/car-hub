export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  phone?: string
  location?: string
  cityState?: string
  bio?: string
  isDealer: boolean
  dealerInfo?: DealerInfo
  preferences: UserPreferences
  statistics: UserStatistics
  createdAt: string
  updatedAt: string
}

export interface DealerInfo {
  companyName: string
  cnpj: string
  address: string
  website?: string
  workingHours: string
  specialties: string[]
}

export interface UserPreferences {
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
  }
  privacy: {
    showPhone: boolean
    showEmail: boolean
    showLocation: boolean
  }
  filters: {
    maxDistance: number
    priceRange: {
      min: number
      max: number
    }
    brands: string[]
  }
}

export interface UserStatistics {
  listingsCount: number
  soldCarsCount: number
  favoritesCount: number
  viewsReceived: number
  rating?: number
  reviewsCount: number
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  phone: string
  isDealer?: boolean
  location?: string
}

export interface LoginResponse {
  user: User
  token: string
  refreshToken: string
}

export interface UpdateProfileRequest {
  name?: string
  avatar?: string
  phone?: string
  location?: string
  cityState?: string
  bio?: string
  dealerInfo?: Partial<DealerInfo>
  preferences?: Partial<UserPreferences>
}