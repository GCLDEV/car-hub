import api from './client'
import { 
  User, 
  LoginRequest, 
  RegisterRequest, 
  LoginResponse, 
  UpdateProfileRequest
} from '@/types'

// Registrar usuário
export async function registerUser(data: RegisterRequest): Promise<LoginResponse> {
  try {
    const response = await api.post('/auth/local/register', {
      username: data.name.toLowerCase().replace(/\s+/g, ''), // Criar username baseado no nome
      email: data.email,
      password: data.password
    })

    const { user, jwt } = response.data

    // Transformar resposta do Strapi para formato do app
    const transformedUser: User = {
      id: user.id.toString(),
      name: user.username, // Strapi retorna username por padrão
      email: user.email,
      avatar: user.avatar?.url || undefined,
      phone: '', // Será preenchido depois no perfil
      location: '', // Será preenchido depois no perfil
      cityState: '',
      bio: '',
      isDealer: false,
      dealerInfo: undefined,
      preferences: user.preferences || {
        notifications: { email: true, push: true, sms: false },
        privacy: { showPhone: true, showEmail: false, showLocation: true },
        filters: { maxDistance: 50, priceRange: { min: 0, max: 500000 }, brands: [] }
      },
      statistics: user.statistics || {
        listingsCount: 0,
        soldCarsCount: 0,
        favoritesCount: 0,
        viewsReceived: 0,
        reviewsCount: 0
      },
      createdAt: user.createdAt || new Date().toISOString(),
      updatedAt: user.updatedAt || new Date().toISOString()
    }

    return {
      user: transformedUser,
      token: jwt,
      refreshToken: jwt // Strapi usa o mesmo JWT
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.error?.message || 'Erro ao registrar usuário')
  }
}

// Login do usuário
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  try {
    const response = await api.post('/auth/local', {
      identifier: credentials.email, // Strapi aceita email como identifier
      password: credentials.password
    })

    const { user, jwt } = response.data

    // Transformar resposta do Strapi para formato do app
    const transformedUser: User = {
      id: user.id.toString(),
      name: user.name || user.username,
      email: user.email,
      avatar: user.avatar?.url || undefined,
      phone: user.phone,
      location: user.location,
      cityState: user.cityState,
      bio: user.bio,
      isDealer: user.isDealer || false,
      dealerInfo: user.dealerInfo || undefined,
      preferences: user.preferences || {
        notifications: { email: true, push: true, sms: false },
        privacy: { showPhone: true, showEmail: false, showLocation: true },
        filters: { maxDistance: 50, priceRange: { min: 0, max: 500000 }, brands: [] }
      },
      statistics: user.statistics || {
        listingsCount: 0,
        soldCarsCount: 0,
        favoritesCount: 0,
        viewsReceived: 0,
        reviewsCount: 0
      },
      createdAt: user.createdAt || new Date().toISOString(),
      updatedAt: user.updatedAt || new Date().toISOString()
    }

    return {
      user: transformedUser,
      token: jwt,
      refreshToken: jwt // Strapi usa o mesmo JWT
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.error?.message || 'Credenciais inválidas')
  }
}

// Logout (não necessário fazer requisição para Strapi)
export async function logout(): Promise<void> {
  // Apenas limpar dados locais, não precisa chamar API
  return Promise.resolve()
}

// Obter perfil do usuário logado
export async function getUserProfile(): Promise<User> {
  try {
    const response = await api.get('/users/me')
    const user = response.data

    // Transformar resposta do Strapi para formato do app
    const transformedUser: User = {
      id: user.id.toString(),
      name: user.name || user.username,
      email: user.email,
      avatar: user.avatar?.url || undefined,
      phone: user.phone,
      location: user.location,
      cityState: user.cityState,
      bio: user.bio,
      isDealer: user.isDealer || false,
      dealerInfo: user.dealerInfo || undefined,
      preferences: user.preferences || {
        notifications: { email: true, push: true, sms: false },
        privacy: { showPhone: true, showEmail: false, showLocation: true },
        filters: { maxDistance: 50, priceRange: { min: 0, max: 500000 }, brands: [] }
      },
      statistics: user.statistics || {
        listingsCount: 0,
        soldCarsCount: 0,
        favoritesCount: 0,
        viewsReceived: 0,
        reviewsCount: 0
      },
      createdAt: user.createdAt || new Date().toISOString(),
      updatedAt: user.updatedAt || new Date().toISOString()
    }

    return transformedUser
  } catch (error: any) {
    throw new Error(error.response?.data?.error?.message || 'Erro ao buscar perfil')
  }
}

// Atualizar perfil do usuário
export async function updateUserProfile(data: UpdateProfileRequest): Promise<User> {
  try {
    const response = await api.put('/users/me', data)
    const user = response.data

    // Transformar resposta do Strapi para formato do app
    const transformedUser: User = {
      id: user.id.toString(),
      name: user.name || user.username,
      email: user.email,
      avatar: user.avatar?.url || undefined,
      phone: user.phone,
      location: user.location,
      cityState: user.cityState,
      bio: user.bio,
      isDealer: user.isDealer || false,
      dealerInfo: user.dealerInfo || undefined,
      preferences: user.preferences || {
        notifications: { email: true, push: true, sms: false },
        privacy: { showPhone: true, showEmail: false, showLocation: true },
        filters: { maxDistance: 50, priceRange: { min: 0, max: 500000 }, brands: [] }
      },
      statistics: user.statistics || {
        listingsCount: 0,
        soldCarsCount: 0,
        favoritesCount: 0,
        viewsReceived: 0,
        reviewsCount: 0
      },
      createdAt: user.createdAt || new Date().toISOString(),
      updatedAt: user.updatedAt || new Date().toISOString()
    }

    return transformedUser
  } catch (error: any) {
    throw new Error(error.response?.data?.error?.message || 'Erro ao atualizar perfil')
  }
}

// Esqueceu senha
export async function forgotPassword(email: string): Promise<void> {
  try {
    await api.post('/auth/forgot-password', { email })
  } catch (error: any) {
    throw new Error(error.response?.data?.error?.message || 'Erro ao enviar email de recuperação')
  }
}

// Redefinir senha
export async function resetPassword(code: string, password: string, passwordConfirmation: string): Promise<void> {
  try {
    await api.post('/auth/reset-password', {
      code,
      password,
      passwordConfirmation
    })
  } catch (error: any) {
    throw new Error(error.response?.data?.error?.message || 'Erro ao redefinir senha')
  }
}

// Função para manter compatibilidade com o código existente
export const register = registerUser