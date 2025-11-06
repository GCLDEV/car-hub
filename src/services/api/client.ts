import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

// Configuração centralizada da API
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_ADDRESS || 'http://localhost:1337/api'
console.log("🚀 ~ API_BASE_URL:", API_BASE_URL)
export const SERVER_BASE_URL = API_BASE_URL.replace('/api', '') // Para imagens e uploads

// Cliente HTTP para API Strapi real
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Aumentado para 30 segundos
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(async (config) => {
  try {
    // Buscar o token do storage do Zustand (mesmo local que o authStore usa)
    const authStorage = await AsyncStorage.getItem('auth-storage')
    let token = null
    
    if (authStorage) {
      const parsedAuth = JSON.parse(authStorage)
      token = parsedAuth.state?.token
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  } catch (error) {
    // Silently ignore errors when retrieving token
  }
  return config
})

// Interceptor para tratamento de respostas e erros
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Se token expirado ou inválido, limpar storage
    if (error.response?.status === 401) {
      AsyncStorage.multiRemove(['@car-hub:token', '@car-hub:user'])
    }
    
    return Promise.reject(error)
  }
)

export default api