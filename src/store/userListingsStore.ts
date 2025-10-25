import { create } from 'zustand'

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

  fetchUserListings: async (userId: string) => {
    set({ loading: true, error: null })
    
    try {
      // Simular busca dos anúncios do usuário
      // Em um app real, isso faria uma chamada para a API
      await new Promise(resolve => setTimeout(resolve, 2500)) // Simular delay para visualizar skeleton
      
      const mockListings: CarListing[] = [
        {
          id: 'listing-1',
          title: 'Honda Civic 2020',
          brand: 'Honda',
          model: 'Civic',
          year: 2020,
          price: 85000,
          km: 25000,
          fuelType: 'Flex',
          transmission: 'Automatic',
          color: 'Silver',
          description: 'Car in excellent condition, single owner, all maintenance up to date.',
          images: [
            'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=500',
            'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=500'
          ],
          location: 'São Paulo, SP',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
      
      set({ listings: mockListings, loading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error fetching listings',
        loading: false 
      })
    }
  }
}))