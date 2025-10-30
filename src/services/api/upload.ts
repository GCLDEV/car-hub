import AsyncStorage from '@react-native-async-storage/async-storage'

// Utilitários para preparar arquivos (baseado no projeto anterior)
const ResolveUri = (result: any) => {
  const path = result?.path ? result?.path 
              : result?.fileCopyUri ? result?.fileCopyUri 
              : result?.uri ? result?.uri 
              : result?.croppedImage ? result?.croppedImage 
              : typeof result === 'string' ? result : null     
  return path?.indexOf('file://') === -1 ? `file://${path}` : path
}

const PrepareFile = (result: any) => {
  const uri = ResolveUri(result)
  const name = uri.split('/').pop()
  const match = /\.(\w+)$/.exec(name)
  const type = match ? `image/${match[1]}` : `image`
  return { uri, name, type }
}

/**
 * Faz upload de uma única imagem para o Strapi (método testado)
 * @param imageUri - URI local da imagem
 * @returns Promise com dados da imagem do Strapi
 */
export async function uploadImage(imageUri: string): Promise<any> {
  const maxRetries = 3
  let lastError: any

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`📤 Upload attempt ${attempt}/${maxRetries} for image:`, imageUri)
      
      // Preparar arquivo usando método testado
      const fileToUpload = PrepareFile({ uri: imageUri })
      
      // Criar FormData corretamente
      const formData = new FormData()
      formData.append('files', fileToUpload as any, fileToUpload.name)
      
      // Buscar headers de autenticação
      const authStorage = await AsyncStorage.getItem('auth-storage')
      let token = null
      
      if (authStorage) {
        const parsedAuth = JSON.parse(authStorage)
        token = parsedAuth.state?.token
      }
      
      const headers: any = {}
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
      
      // Usar fetch nativo com timeout maior
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 60000) // 60 segundos
      
      const response = await fetch('http://192.168.0.8:1337/api/upload', {
        method: 'POST',
        body: formData,
        headers,
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Upload falhou: ${response.status} - ${errorText}`)
      }
      
      const responseJson = await response.json()
      console.log(`✅ Upload successful on attempt ${attempt}`)
      
      return responseJson?.[0]
      
    } catch (error: any) {
      lastError = error
      console.warn(`⚠️ Upload attempt ${attempt} failed:`, error.message)
      
      // Se não é o último attempt, aguarda antes de tentar novamente
      if (attempt < maxRetries) {
        const delay = attempt * 2000 // 2s, 4s, etc
        console.log(`⏳ Waiting ${delay}ms before retry...`)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }
  
  console.error('❌ Erro ao fazer upload após', maxRetries, 'tentativas:', lastError)
  throw new Error(lastError?.message || 'Erro no upload da imagem após múltiplas tentativas')
}

/**
 * Faz upload de múltiplas imagens para o Strapi (sequencialmente)
 * @param imageUris - Array de URIs locais das imagens
 * @returns Promise com array de dados das imagens no Strapi
 */
export async function uploadMultipleImages(imageUris: string[]): Promise<any[]> {
  console.log(`📤 Starting upload of ${imageUris.length} images...`)
  
  const imageData: any[] = []
  const failedUploads: string[] = []
  
  // Upload sequencial para evitar problemas de concorrência
  for (let i = 0; i < imageUris.length; i++) {
    const uri = imageUris[i]
    
    try {
      console.log(`📷 Uploading image ${i + 1}/${imageUris.length}`)
      const imageResult = await uploadImage(uri)
      imageData.push(imageResult)
      
      // Pequena pausa entre uploads para não sobrecarregar o servidor
      if (i < imageUris.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1500))
      }
    } catch (error: any) {
      console.error(`❌ Failed to upload image ${i + 1}:`, error.message)
      failedUploads.push(uri)
      
      // Se falhar mais que 50% das imagens, parar
      if (failedUploads.length > imageUris.length / 2) {
        throw new Error(`Muitas falhas no upload: ${failedUploads.length} de ${imageUris.length} falharam`)
      }
    }
  }
  
  if (imageData.length === 0) {
    throw new Error('Nenhuma imagem foi enviada com sucesso')
  }
  
  if (failedUploads.length > 0) {
    console.warn(`⚠️ ${failedUploads.length} imagens falharam no upload, mas continuando com ${imageData.length} imagens`)
  }
  
  console.log(`✅ Upload completed: ${imageData.length} images successful, ${failedUploads.length} failed`)
  return imageData
}

/**
 * Versão alternativa usando Base64 como fallback
 * @param imageUri - URI da imagem local  
 * @returns Promise com URL da imagem
 */
export async function uploadImageBase64Fallback(imageUri: string): Promise<string> {
  // Por ora, retornar uma URL de placeholder
  // Em produção, implementar conversão para base64 e envio
  const placeholderImages = [
    'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500&h=300&fit=crop',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500&h=300&fit=crop',
    'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=500&h=300&fit=crop',
    'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=500&h=300&fit=crop',
  ]
  
  const randomIndex = Math.floor(Math.random() * placeholderImages.length)
  return placeholderImages[randomIndex]
}

/**
 * Faz upload das imagens e retorna as URLs públicas (com fallback)
 * @param imageUris - Array de URIs locais das imagens
 * @returns Promise com array de URLs das imagens
 */
export async function uploadImagesAndGetUrls(imageUris: string[]): Promise<string[]> {
  try {
    if (imageUris.length === 0) return []
    
    // Tentar upload real primeiro
    const imageIds = await uploadMultipleImages(imageUris)
    
    // Se sucesso, construir URLs reais das imagens do S3
    const urls = imageIds.map((imageData: any) => {
      // Se a imagem já tem URL completa (S3), usar diretamente
      if (imageData?.url?.startsWith('http')) {
        return imageData.url;
      }
      // Se é URL relativa, construir URL completa do Strapi
      if (imageData?.url) {
        return `http://192.168.0.8:1337${imageData.url}`;
      }
      // Fallback apenas se não houver URL
      return null;
    }).filter(Boolean);
    
    return urls
  } catch (error: any) {
    
    // Re-throw o erro para que seja tratado pelo código que chama
    throw new Error('Falha no upload das imagens: ' + error.message)
  }
}