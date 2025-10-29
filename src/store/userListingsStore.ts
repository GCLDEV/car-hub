import { create } from 'zustand'
import api from '@services/api/client'

interface CarListing {
  id: string
  title: string
  brand: string
  model: string
  year: number
  price: number
  km: number
  fuelType: string
  transmission: string
  color: string
  description: string
  images: string[]
  location: string
  status: 'active' | 'sold' | 'paused'
  createdAt: string
  updatedAt: string
}

interface UserListingsState {
  listings: CarListing[]
  loading: boolean
  error: string | null
  setListings: (listings: CarListing[]) => void
  addListing: (listing: CarListing) => void
  updateListing: (id: string, updates: Partial<CarListing>) => void
  removeListing: (id: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearListings: () => void
  fetchUserListings: (userId: string) => Promise<void>
}

export const useUserListingsStore = create<UserListingsState>((set, get) => ({
  listings: [],
  loading: false,
  error: null,
  
  setListings: (listings: CarListing[]) => {
    set({ listings, error: null })
  },
  
  addListing: (listing: CarListing) => {
    set((state) => ({
      listings: [listing, ...state.listings]
    }))
  },
  
  updateListing: (id: string, updates: Partial<CarListing>) => {
    set((state) => ({
      listings: state.listings.map(listing =>
        listing.id === id 
          ? { ...listing, ...updates, updatedAt: new Date().toISOString() }
          : listing
      )
    }))
  },
  
  removeListing: (id: string) => {
    set((state) => ({
      listings: state.listings.filter(listing => listing.id !== id)
    }))
  },
  
  setLoading: (loading: boolean) => {
    set({ loading })
  },
  
  setError: (error: string | null) => {
    set({ error })
  },
  
  clearListings: () => {
    set({ listings: [], error: null })
  },

  // Buscar anúncios do usuário logado
  fetchMyListings: async () => {
    set({ loading: true, error: null })
    
    try {
      // Buscar carros do usuário logado via API Strapi
      const response = await api.get('/cars/me', {
        params: {
          'populate[images]': true,
          'sort': 'createdAt:desc'
        }
      })
      
      // Transformar dados da API para o formato esperado
      const listings: CarListing[] = response.data.map((strapiCar: any) => ({
        id: strapiCar.id.toString(),
        title: strapiCar.title,
        brand: strapiCar.brand,
        model: strapiCar.model,
        year: strapiCar.year,
        price: typeof strapiCar.price === 'string' ? parseInt(strapiCar.price) : strapiCar.price,
        km: strapiCar.km,
        fuelType: strapiCar.fuelType,
        transmission: strapiCar.transmission,
        color: strapiCar.color,
        description: strapiCar.description,
        images: strapiCar.images?.map((img: any) => {
          if (img.url?.startsWith('http')) {
            return img.url; // URL completa do S3
          }
          if (img.url) {
            return `http://192.168.0.8:1337${img.url}`; // URL relativa do Strapi
          }
          return null;
        }).filter(Boolean) || [],
        location: strapiCar.location || strapiCar.cityState,
        status: strapiCar.status || 'active',
        createdAt: strapiCar.createdAt,
        updatedAt: strapiCar.updatedAt
      }))
      
      set({ listings, loading: false })
    } catch (error) {
      console.error('❌ Erro ao buscar meus anúncios:', error)
      set({ 
        error: error instanceof Error ? error.message : 'Erro ao buscar anúncios',
        loading: false 
      })
    }
  },

  fetchUserListings: async (userId: string) => {
    set({ loading: true, error: null })
    
    try {
      // Buscar carros reais do usuário via API Strapi
      const response = await api.get('/cars', {
        params: {
          'populate[images]': true,
          'populate[seller]': true,
          'filters[seller][id][$eq]': userId,
          'sort': 'createdAt:desc'
        }
      })
      
      // Transformar dados da API para o formato esperado
      const listings: CarListing[] = response.data.data.map((strapiCar: any) => ({
        id: strapiCar.id.toString(),
        title: strapiCar.title,
        brand: strapiCar.brand,
        model: strapiCar.model,
        year: strapiCar.year,
        price: typeof strapiCar.price === 'string' ? parseInt(strapiCar.price) : strapiCar.price,
        km: strapiCar.km,
        fuelType: strapiCar.fuelType,
        transmission: strapiCar.transmission,
        color: strapiCar.color,
        description: strapiCar.description,
        images: strapiCar.images?.map((img: any) => {
          // Se já tem URL completa (S3), usar diretamente
          if (img.url?.startsWith('http')) {
            return img.url;
          }
          // Se é URL relativa do Strapi, construir URL completa
          if (img.url) {
            return `http://192.168.0.8:1337${img.url}`;
          }
          return null;
        }).filter(Boolean) || [],
        location: strapiCar.location || strapiCar.cityState,
        status: strapiCar.status || 'active',
        createdAt: strapiCar.createdAt,
        updatedAt: strapiCar.updatedAt
      }))
      
      set({ listings, loading: false })
    } catch (error) {
      console.error('❌ Erro ao buscar anúncios do usuário:', error)
      set({ 
        error: error instanceof Error ? error.message : 'Erro ao buscar anúncios',
        loading: false 
      })
    }
  }
}))