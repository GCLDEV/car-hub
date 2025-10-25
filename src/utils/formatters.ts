/**
 * Formatar preço em Real brasileiro
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price)
}

/**
 * Formatar quilometragem
 */
export function formatKm(km: number): string {
  if (km < 1000) {
    return `${km} km`
  }
  
  return new Intl.NumberFormat('pt-BR', {
    maximumFractionDigits: 1,
  }).format(km / 1000) + 'k km'
}

/**
 * Formatar número de telefone brasileiro
 */
export function formatPhone(phone: string): string {
  // Remove todos os caracteres não numéricos
  const numbers = phone.replace(/\D/g, '')
  
  // Formata conforme o tamanho
  if (numbers.length === 11) {
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  } else if (numbers.length === 10) {
    return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  }
  
  return phone
}

/**
 * Formatar data relativa (ex: "há 2 dias")
 */
export function formatRelativeDate(date: string | Date): string {
  const now = new Date()
  const targetDate = typeof date === 'string' ? new Date(date) : date
  const diffInMs = now.getTime() - targetDate.getTime()
  
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
  
  if (diffInMinutes < 1) {
    return 'agora'
  } else if (diffInMinutes < 60) {
    return `há ${diffInMinutes} min`
  } else if (diffInHours < 24) {
    return `há ${diffInHours}h`
  } else if (diffInDays < 7) {
    return `há ${diffInDays} dias`
  } else {
    return targetDate.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }
}

/**
 * Formatar ano do veículo
 */
export function formatYear(year: number): string {
  const currentYear = new Date().getFullYear()
  
  if (year === currentYear) {
    return `${year} (Atual)`
  } else if (year === currentYear - 1) {
    return `${year} (Ano passado)`
  }
  
  return year.toString()
}

/**
 * Truncar texto com reticências
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text
  }
  
  return text.slice(0, maxLength) + '...'
}

/**
 * Capitalizar primeira letra de cada palavra
 */
export function capitalizeWords(text: string): string {
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}