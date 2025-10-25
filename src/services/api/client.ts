import axios from 'axios'

// Cliente HTTP mock - simula requisições mas retorna dados locais
const api = axios.create({
  baseURL: 'https://mock-api.local',
  timeout: 1000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para simular delay de rede
api.interceptors.request.use((config) => {
  return config
})

api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default api