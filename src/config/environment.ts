// Configuração automática de ambiente
export function getEnvironmentConfig() {
  const environment = process.env.EXPO_PUBLIC_ENVIRONMENT || 'dev'
  
  const configs = {
    dev: {
      apiAddress: process.env.EXPO_PUBLIC_API_ADDRESS_DEV ,
      websocketUrl: process.env.EXPO_PUBLIC_WEBSOCKET_URL_DEV
    },
    prod: {
      apiAddress: process.env.EXPO_PUBLIC_API_ADDRESS_PROD ,
      websocketUrl: process.env.EXPO_PUBLIC_WEBSOCKET_URL_PROD 
    }
  }
  
  const currentConfig = configs[environment] || configs.dev
  
  console.log('🔧 Environment config:', {
    environment,
    apiAddress: currentConfig.apiAddress,
    websocketUrl: currentConfig.websocketUrl
  })
  
  return currentConfig
}

// URLs que serão usadas em toda a aplicação
export const { apiAddress: API_BASE_URL, websocketUrl: WEBSOCKET_URL } = getEnvironmentConfig()