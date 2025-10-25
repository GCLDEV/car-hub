import { create } from 'zustand'

export interface CarFilters {
  brand?: string
  model?: string
  yearFrom?: number
  yearTo?: number
  priceFrom?: number
  priceTo?: number
  kmFrom?: number
  kmTo?: number
  fuelType?: string
  transmission?: string
  color?: string
  location?: string
  sortBy?: 'price_asc' | 'price_desc' | 'year_asc' | 'year_desc' | 'km_asc' | 'km_desc' | 'created_at'
}

interface FiltersState {
  filters: CarFilters
  activeFiltersCount: number
  setFilter: (key: keyof CarFilters, value: any) => void
  setFilters: (filters: CarFilters) => void
  clearFilters: () => void
  removeFilter: (key: keyof CarFilters) => void
}

const defaultFilters: CarFilters = {
  sortBy: 'created_at'
}

export const useFiltersStore = create<FiltersState>((set, get) => ({
  filters: defaultFilters,
  activeFiltersCount: 0,
  
  setFilter: (key: keyof CarFilters, value: any) => {
    set((state) => {
      const newFilters = { ...state.filters, [key]: value }
      const activeCount = Object.keys(newFilters).filter(
        k => k !== 'sortBy' && newFilters[k as keyof CarFilters] !== undefined
      ).length
      
      return {
        filters: newFilters,
        activeFiltersCount: activeCount
      }
    })
  },
  
  setFilters: (filters: CarFilters) => {
    const activeCount = Object.keys(filters).filter(
      k => k !== 'sortBy' && filters[k as keyof CarFilters] !== undefined
    ).length
    
    set({
      filters,
      activeFiltersCount: activeCount
    })
  },
  
  clearFilters: () => {
    set({
      filters: defaultFilters,
      activeFiltersCount: 0
    })
  },
  
  removeFilter: (key: keyof CarFilters) => {
    set((state) => {
      const newFilters = { ...state.filters }
      delete newFilters[key]
      
      const activeCount = Object.keys(newFilters).filter(
        k => k !== 'sortBy' && newFilters[k as keyof CarFilters] !== undefined
      ).length
      
      return {
        filters: newFilters,
        activeFiltersCount: activeCount
      }
    })
  }
}))