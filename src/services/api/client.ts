import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

// Cliente HTTP para API Strapi real
const api = axios.create({
  baseURL: 'http://192.168.0.8:1337/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('@car-hub:token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  } catch (error) {
    console.warn('Erro ao recuperar token:', error)
  }
  return config
})

// Interceptor para tratamento de respostas e erros
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    
    // Se token expirado ou inválido, limpar storage
    if (error.response?.status === 401) {
      AsyncStorage.multiRemove(['@car-hub:token', '@car-hub:user'])
    }
    
    return Promise.reject(error)
  }
)

export default api