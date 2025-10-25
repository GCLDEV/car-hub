import { 
  User, 
  LoginRequest, 
  RegisterRequest, 
  LoginResponse, 
  UpdateProfileRequest
} from '@/types'

// Simular delay de rede
async function mockDelay(ms: number = 1000): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Mock user data
const mockUser: User = {
  id: 'user-1',
  name: 'Jimmy Silva',
  email: 'jimmy@exemplo.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
  phone: '(11) 99999-9999',
  location: 'São Paulo, SP',
  cityState: 'São Paulo, SP',
  bio: 'Vendedor de carros premium há 5 anos',
  isDealer: true,
  dealerInfo: {
    companyName: 'Jimmy Cars Premium',
    cnpj: '12.345.678/0001-90',
    address: 'Rua das Flores, 123 - São Paulo, SP',
    website: 'https://jimmycars.com',
    workingHours: '08:00 - 18:00',
    specialties: ['Premium Cars', 'Imports', 'Pre-owned']
  },
  preferences: {
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    privacy: {
      showPhone: true,
      showEmail: false,
      showLocation: true
    },
    filters: {
      maxDistance: 50,
      priceRange: { min: 0, max: 500000 },
      brands: ['BMW', 'Audi', 'Mercedes-Benz']
    }
  },
  statistics: {
    listingsCount: 15,
    soldCarsCount: 8,
    favoritesCount: 23,
    viewsReceived: 1250,
    rating: 4.8,
    reviewsCount: 42
  },
  createdAt: '2023-01-15T10:00:00Z',
  updatedAt: '2024-10-20T15:30:00Z'
}

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  await mockDelay(800)
  
  // Simular validação
  if (credentials.email === 'erro@teste.com') {
    throw new Error('Email ou senha incorretos')
  }
  
  return {
    user: mockUser,
    token: 'mock-jwt-token-12345',
    refreshToken: 'mock-refresh-token-67890'
  }
}

export async function register(data: RegisterRequest): Promise<LoginResponse> {
  await mockDelay(1000)
  
  // Simular validação
  if (data.email === 'existe@teste.com') {
    throw new Error('Email já está em uso')
  }
  
  return {
    user: { ...mockUser, name: data.name, email: data.email },
    token: 'mock-jwt-token-new-user',
    refreshToken: 'mock-refresh-token-new-user'
  }
}

export async function logout(): Promise<void> {
  await mockDelay(300)
  // Mock sempre sucesso
}

export async function refreshToken(refreshToken: string): Promise<string> {
  await mockDelay(500)
  return 'mock-new-jwt-token-refresh'
}

export async function forgotPassword(email: string): Promise<void> {
  await mockDelay(800)
  // Mock sempre sucesso
}

export async function resetPassword(token: string, password: string): Promise<void> {
  await mockDelay(600)
  // Mock sempre sucesso
}

export async function getUserProfile(): Promise<User> {
  await mockDelay(400)
  return mockUser
}

export async function updateUserProfile(data: UpdateProfileRequest): Promise<User> {
  await mockDelay(700)
  
  // Atualizar campos específicos mantendo a estrutura
  const updatedUser: User = {
    ...mockUser,
    name: data.name || mockUser.name,
    avatar: data.avatar || mockUser.avatar,
    phone: data.phone || mockUser.phone,
    location: data.location || mockUser.location,
    cityState: data.cityState || mockUser.cityState,
    bio: data.bio || mockUser.bio,
    dealerInfo: data.dealerInfo ? { ...mockUser.dealerInfo!, ...data.dealerInfo } : mockUser.dealerInfo,
    preferences: data.preferences ? { ...mockUser.preferences, ...data.preferences } : mockUser.preferences,
    updatedAt: new Date().toISOString()
  }
  
  return updatedUser
}

export async function uploadAvatar(file: FormData): Promise<string> {
  await mockDelay(1200)
  // Retornar uma URL mock
  return 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face'
}

export async function deleteAccount(): Promise<void> {
  await mockDelay(900)
  // Mock sempre sucesso
}