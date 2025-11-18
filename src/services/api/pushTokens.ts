import api from './client'

/**
 * Registra um push token para o usuário autenticado
 */
export async function registerPushToken(token: string, deviceType: 'ios' | 'android' = 'android') {
  try {
    const response = await api.post('/push-tokens/register', {
      token,
      deviceType
    })
    
    return {
      success: true,
      data: response.data
    }
  } catch (error: any) {
    console.error('❌ Erro ao registrar push token:', error)
    console.error('❌ Response data:', error.response?.data)
    console.error('❌ Status:', error.response?.status)
    
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Erro ao registrar push token'
    }
  }
}

/**
 * Remove um push token do usuário autenticado
 */
export async function unregisterPushToken(token: string) {
  try {
    const response = await api.post('/push-tokens/unregister', {
      token
    })
    
    return {
      success: true,
      data: response.data
    }
  } catch (error: any) {
    console.error('❌ Erro ao desregistrar push token:', error)
    
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Erro ao desregistrar push token'
    }
  }
}