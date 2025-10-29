import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

// Cliente HTTP para API Strapi real
const api = axios.create({
  baseURL: 'http://192.168.0.8:1337/api',
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