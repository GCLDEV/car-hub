export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  phone?: string
  location?: string
  cityState?: string
  isDealer: boolean
  createdAt: string
  updatedAt: string
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
  isDealer?: boolean
}