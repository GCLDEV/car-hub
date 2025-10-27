import { z } from 'zod'

// Schema para validação de registro (versão simplificada)
export const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(50, 'Nome deve ter no máximo 50 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras'),
  
  email: z
    .string()
    .email('Email inválido')
    .min(1, 'Email é obrigatório'),
  
  password: z
    .string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .max(50, 'Senha deve ter no máximo 50 caracteres'),
  
  confirmPassword: z
    .string()
    .min(1, 'Confirmação de senha é obrigatória'),
  
  // Campos opcionais para compatibilidade
  phone: z.string().optional(),
  location: z.string().optional(),
  isDealer: z.boolean().optional(),
  acceptTerms: z.boolean().optional()
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Senhas não coincidem',
  path: ['confirmPassword']
})

// Schema para validação de login
export const loginSchema = z.object({
  email: z
    .string()
    .email('Email inválido')
    .min(1, 'Email é obrigatório'),
  
  password: z
    .string()
    .min(1, 'Senha é obrigatória')
})

// Schema para esqueceu senha
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email('Email inválido')
    .min(1, 'Email é obrigatório')
})

// Schema para redefinir senha
export const resetPasswordSchema = z.object({
  code: z
    .string()
    .min(1, 'Código é obrigatório'),
  
  password: z
    .string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .max(50, 'Senha deve ter no máximo 50 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Senha deve conter ao menos 1 letra minúscula, 1 maiúscula e 1 número'),
  
  confirmPassword: z
    .string()
    .min(1, 'Confirmação de senha é obrigatória')
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Senhas não coincidem',
  path: ['confirmPassword']
})

// Schema para criar listagem de veículo
export const createListingSchema = z.object({
  title: z
    .string()
    .min(10, 'Título deve ter pelo menos 10 caracteres')
    .max(100, 'Título deve ter no máximo 100 caracteres'),
  
  brand: z
    .string()
    .min(1, 'Marca é obrigatória'),
  
  model: z
    .string()
    .min(1, 'Modelo é obrigatório'),
  
  year: z
    .string()
    .min(1, 'Ano é obrigatório')
    .refine(val => {
      const num = Number(val)
      return !isNaN(num) && num >= 1990 && num <= new Date().getFullYear() + 1
    }, 'Ano deve ser um número entre 1990 e ' + (new Date().getFullYear() + 1)),
  
  price: z
    .string()
    .min(1, 'Preço é obrigatório')
    .refine(val => {
      const num = Number(val.replace(/\D/g, ''))
      return !isNaN(num) && num >= 1000 && num <= 1000000
    }, 'Preço deve estar entre R$ 1.000 e R$ 1.000.000'),
  
  km: z
    .string()
    .min(1, 'Quilometragem é obrigatória')
    .refine(val => {
      const num = Number(val.replace(/\D/g, ''))
      return !isNaN(num) && num >= 0 && num <= 500000
    }, 'Quilometragem deve estar entre 0 e 500.000 km'),
  
  fuelType: z
    .string()
    .min(1, 'Tipo de combustível é obrigatório'),
  
  transmission: z
    .string()
    .min(1, 'Tipo de câmbio é obrigatório'),
  
  color: z
    .string()
    .min(1, 'Cor é obrigatória'),
  
  description: z
    .string()
    .min(50, 'Descrição deve ter pelo menos 50 caracteres')
    .max(1000, 'Descrição deve ter no máximo 1000 caracteres'),
  
  location: z
    .string()
    .min(1, 'Localização é obrigatória'),
  
  doors: z
    .string()
    .min(1, 'Número de portas é obrigatório')
    .refine(val => {
      const num = Number(val)
      return !isNaN(num) && num >= 2 && num <= 5
    }, 'Número de portas deve estar entre 2 e 5'),
  
  seats: z
    .string()
    .min(1, 'Número de assentos é obrigatório')
    .refine(val => {
      const num = Number(val)
      return !isNaN(num) && num >= 2 && num <= 8
    }, 'Número de assentos deve estar entre 2 e 8'),
  
  engine: z
    .string()
    .min(1, 'Motor é obrigatório'),
  
  features: z
    .array(z.string())
    .default([]),
  
  images: z
    .array(z.string().url('URL da imagem inválida'))
    .min(1, 'Pelo menos uma imagem é obrigatória')
    .max(10, 'Máximo de 10 imagens permitido')
})

// Tipos derivados dos schemas
export type RegisterFormData = z.infer<typeof registerSchema>
export type LoginFormData = z.infer<typeof loginSchema>
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>
export type CreateListingFormData = z.infer<typeof createListingSchema>

// Utilitários para formatação
export const formatPhoneNumber = (value: string): string => {
  // Remove tudo que não for dígito
  const numbers = value.replace(/\D/g, '')
  
  // Aplica máscara (11) 99999-9999
  if (numbers.length <= 2) {
    return `(${numbers}`
  } else if (numbers.length <= 7) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
  } else {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`
  }
}

export const validateCPF = (cpf: string): boolean => {
  // Remove caracteres não numéricos
  const numbers = cpf.replace(/\D/g, '')
  
  // Verifica se tem 11 dígitos
  if (numbers.length !== 11) return false
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(numbers)) return false
  
  // Validação do CPF
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