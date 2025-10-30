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
    // Primeiro registrar com os campos padrão do Strapi
    const response = await api.post('/auth/local/register', {
      username: data.name.toLowerCase().replace(/\s+/g, ''), // Criar username baseado no nome
      email: data.email,
      password: data.password
    })

    const { user, jwt } = response.data

    // Agora atualizar o perfil com os campos customizados
    try {
      const updateResponse = await api.put(`/users/${user.id}`, {
        name: data.name,
        phone: data.phone,
        location: data.location,
        cityState: data.location, // Usar location como cityState
        isDealer: data.isDealer || false
      }, {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      })

      const updatedUser = updateResponse.data
      
      // Transformar resposta do Strapi para formato do app
      const transformedUser: User = {
        id: updatedUser.id.toString(),
        name: updatedUser.name || data.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar?.url || undefined,
        phone: updatedUser.phone || '',
        location: updatedUser.location || '',
        cityState: updatedUser.cityState || '',
        isDealer: updatedUser.isDealer || false,
        createdAt: updatedUser.createdAt || new Date().toISOString(),
        updatedAt: updatedUser.updatedAt || new Date().toISOString()
      }

      return {
        user: transformedUser,
        token: jwt,
        refreshToken: jwt // Strapi usa o mesmo JWT
      }
    } catch (updateError) {
      // Se falhar ao atualizar, retorna o usuário básico
      console.warn('Failed to update user profile:', updateError)
      
      const transformedUser: User = {
        id: user.id.toString(),
        name: data.name,
        email: user.email,
        avatar: undefined,
        phone: data.phone || '',
        location: data.location || '',
        cityState: data.location || '',
        isDealer: data.isDealer || false,
        createdAt: user.createdAt || new Date().toISOString(),
        updatedAt: user.updatedAt || new Date().toISOString()
      }

      return {
        user: transformedUser,
        token: jwt,
        refreshToken: jwt
      }
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
      phone: user.phone || '',
      location: user.location || '',
      cityState: user.cityState || '',
      isDealer: user.isDealer || false,
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
    const response = await api.get('/users/me?populate=avatar')
    const user = response.data

    // Transformar resposta do Strapi para formato do app
    const transformedUser: User = {
      id: user.id.toString(),
      name: user.name || user.username,
      email: user.email,
      avatar: user.avatar?.url || undefined,
      phone: user.phone || '',
      location: user.location || '',
      cityState: user.cityState || '',
      isDealer: user.isDealer || false,
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
    // Preparar dados para o Strapi
    const updateData: any = {}
    
    if (data.name) updateData.name = data.name
    if (data.phone) updateData.phone = data.phone
    if (data.location) updateData.location = data.location
    if (data.cityState) updateData.cityState = data.cityState
    if (data.isDealer !== undefined) updateData.isDealer = data.isDealer
    if (data.avatar) updateData.avatar = data.avatar

    const response = await api.put('/users/me', { data: updateData })
    const user = response.data

    // Transformar resposta do Strapi para formato do app
    const transformedUser: User = {
      id: user.id.toString(),
      name: user.name || user.username,
      email: user.email,
      avatar: user.avatar?.url || undefined,
      phone: user.phone || '',
      location: user.location || '',
      cityState: user.cityState || '',
      isDealer: user.isDealer || false,
      createdAt: user.createdAt || new Date().toISOString(),
      updatedAt: user.updatedAt || new Date().toISOString()
    }

    return transformedUser
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.response?.data?.error?.message || 'Erro ao atualizar perfil')
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