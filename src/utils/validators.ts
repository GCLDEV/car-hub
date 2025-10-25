/**
 * Validar email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validar telefone brasileiro
 */
export function isValidPhone(phone: string): boolean {
  // Remove todos os caracteres não numéricos
  const numbers = phone.replace(/\D/g, '')
  
  // Verifica se tem 10 ou 11 dígitos (com DDD)
  return numbers.length === 10 || numbers.length === 11
}

/**
 * Validar CPF
 */
export function isValidCPF(cpf: string): boolean {
  // Remove caracteres não numéricos
  const numbers = cpf.replace(/\D/g, '')
  
  // Verifica se tem 11 dígitos
  if (numbers.length !== 11) return false
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(numbers)) return false
  
  // Validação do algoritmo do CPF
  let sum = 0
  let remainder: number
  
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(numbers.substring(i - 1, i)) * (11 - i)
  }
  
  remainder = (sum * 10) % 11
  
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(numbers.substring(9, 10))) return false
  
  sum = 0
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(numbers.substring(i - 1, i)) * (12 - i)
  }
  
  remainder = (sum * 10) % 11
  
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(numbers.substring(10, 11))) return false
  
  return true
}

/**
 * Validar CNPJ
 */
export function isValidCNPJ(cnpj: string): boolean {
  const numbers = cnpj.replace(/\D/g, '')
  
  if (numbers.length !== 14) return false
  if (/^(\d)\1+$/.test(numbers)) return false
  
  // Validação do algoritmo do CNPJ
  let length = numbers.length - 2
  let digits = numbers.substring(0, length)
  let sum = 0
  let pos = length - 7
  
  for (let i = length; i >= 1; i--) {
    sum += parseInt(digits.charAt(length - i)) * pos--
    if (pos < 2) pos = 9
  }
  
  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  if (result !== parseInt(numbers.charAt(length))) return false
  
  length = length + 1
  digits = numbers.substring(0, length)
  sum = 0
  pos = length - 7
  
  for (let i = length; i >= 1; i--) {
    sum += parseInt(digits.charAt(length - i)) * pos--
    if (pos < 2) pos = 9
  }
  
  result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  return result === parseInt(numbers.charAt(length))
}

/**
 * Validar senha forte
 */
export function isStrongPassword(password: string): boolean {
  // Mínimo 8 caracteres, pelo menos 1 maiúscula, 1 minúscula, 1 número
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
  return strongPasswordRegex.test(password)
}

/**
 * Validar preço (deve ser um número positivo)
 */
export function isValidPrice(price: number | string): boolean {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  return !isNaN(numPrice) && numPrice > 0
}

/**
 * Validar ano do veículo
 */
export function isValidYear(year: number | string): boolean {
  const numYear = typeof year === 'string' ? parseInt(year) : year
  const currentYear = new Date().getFullYear()
  
  return !isNaN(numYear) && numYear >= 1900 && numYear <= currentYear + 1
}

/**
 * Validar quilometragem
 */
export function isValidKm(km: number | string): boolean {
  const numKm = typeof km === 'string' ? parseFloat(km) : km
  return !isNaN(numKm) && numKm >= 0 && numKm <= 1000000 // máximo 1 milhão de km
}

/**
 * Validar campo obrigatório
 */
export function isRequired(value: any): boolean {
  if (typeof value === 'string') {
    return value.trim().length > 0
  }
  
  return value !== null && value !== undefined
}

/**
 * Validar comprimento mínimo
 */
export function hasMinLength(value: string, minLength: number): boolean {
  return value.length >= minLength
}

/**
 * Validar comprimento máximo
 */
export function hasMaxLength(value: string, maxLength: number): boolean {
  return value.length <= maxLength
}