export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
  timestamp: string
}

export interface ApiError {
  error: string
  message: string
  statusCode: number
  timestamp: string
  details?: any
}

export interface PaginatedResponse<T> {
  results: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface ApiRequestConfig {
  headers?: Record<string, string>
  params?: Record<string, any>
  timeout?: number
}

// Query keys para React Query
export const queryKeys = {
  cars: ['cars'] as const,
  car: (id: string) => ['cars', id] as const,
  carsList: (filters?: any) => ['cars', 'list', filters] as const,
  searchCars: (query: string, filters?: any) => ['cars', 'search', query, filters] as const,
  
  user: ['user'] as const,
  userProfile: (id: string) => ['user', id] as const,
  userListings: (userId: string) => ['user', userId, 'listings'] as const,
  userFavorites: (userId: string) => ['user', userId, 'favorites'] as const,
  
  brands: ['brands'] as const,
  models: (brand: string) => ['models', brand] as const,
} as const

// Status codes
export enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500,
}

// API endpoints
export const endpoints = {
  // Auth
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
  },
  
  // Cars
  cars: {
    base: '/cars',
    search: '/cars/search',
    byId: (id: string) => `/cars/${id}`,
    favorite: (id: string) => `/cars/${id}/favorite`,
    contact: (id: string) => `/cars/${id}/contact`,
  },
  
  // User
  user: {
    profile: '/user/profile',
    listings: '/user/listings',
    favorites: '/user/favorites',
    statistics: '/user/statistics',
  },
  
  // Misc
  brands: '/brands',
  models: (brand: string) => `/brands/${brand}/models`,
  upload: '/upload',
} as const