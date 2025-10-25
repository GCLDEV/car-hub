import { Car, CarSearchResult } from '@/types/car'

// Função helper para criar sellers
const createSeller = (id: string, name: string, phone: string, location: string, rating: number = 4.5, reviewsCount: number = 50) => ({
  id,
  name,
  phone,
  location,
  isDealer: Math.random() > 0.3, // 70% são dealers
  verifiedPhone: Math.random() > 0.1, // 90% têm telefone verificado
  rating,
  reviewsCount
})

// Função helper para criar car base
const createCarBase = () => ({
  status: 'available' as const,
  views: Math.floor(Math.random() * 2000) + 100,
  createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(), // Últimos 30 dias
  updatedAt: new Date().toISOString()
})

// Mock data para carros variados
export const mockCars: Car[] = [
  {
    id: 'car-1',
    title: 'Toyota Corolla 2022',
    brand: 'Toyota',
    model: 'Corolla',
    year: 2022,
    price: 95000,
    km: 15000,
    fuelType: 'Flex',
    transmission: 'Automatic',
    color: 'Silver',
    description: 'Toyota Corolla 2022 in excellent condition, single owner, all maintenance up to date.',
    images: [
      'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1616788494294-b0b06f4b3240?w=800&h=600&fit=crop&crop=center'
    ],
    location: 'São Paulo, SP',
    cityState: 'São Paulo, SP',
    specs: {
      engine: '2.0L Flex',
      doors: 4,
      seats: 5,
      horsepower: 177,
      features: [
        'Digital Air Conditioning',
        'Multimedia Center',
        'Backup Camera',
        'Parking Sensors',
        'Stability Control',
        'ABS Brakes'
      ]
    },
    seller: createSeller('seller-1', 'Toyota Prime', '(11) 99999-9999', 'São Paulo, SP', 4.8, 125),
    ...createCarBase()
  },
  {
    id: 'car-2',
    title: 'Honda Civic 2023',
    brand: 'Honda',
    model: 'Civic',
    year: 2023,
    price: 125000,
    km: 8000,
    fuelType: 'Flex',
    transmission: 'CVT',
    color: 'Black',
    description: 'Honda Civic 2023 turbo Sport version, extremely economical and powerful.',
    images: [
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=800&h=600&fit=crop&crop=center'
    ],
    location: 'Rio de Janeiro, RJ',
    cityState: 'Rio de Janeiro, RJ',
    specs: {
      engine: '1.5L Turbo',
      doors: 4,
      seats: 5,
      horsepower: 173,
      features: [
        'Honda SENSING',
        'Sunroof',
        'Leather Seats',
        'Premium Sound System',
        'GPS Navigation',
        'Wireless Charging'
      ]
    },
    seller: createSeller('seller-2', 'Honda Premium', '(21) 88888-8888', 'Rio de Janeiro, RJ', 4.9, 89),
    ...createCarBase()
  },
  {
    id: 'car-3',
    title: 'Volkswagen Jetta 2021',
    brand: 'Volkswagen',
    model: 'Jetta',
    year: 2021,
    price: 89000,
    km: 25000,
    fuelType: 'Flex',
    transmission: 'Automatic',
    color: 'White',
    description: 'VW Jetta 2021, premium sedan with excellent cost-benefit ratio and low fuel consumption.',
    images: [
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=800&h=600&fit=crop&crop=center'
    ],
    location: 'Belo Horizonte, MG',
    cityState: 'Belo Horizonte, MG',
    specs: {
      engine: '1.4L TSI',
      doors: 4,
      seats: 5,
      horsepower: 150,
      features: [
        'Composition Media',
        'Digital AC',
        'Multifunctional Steering Wheel',
        'Cruise Control',
        'Rear Sensors'
      ]
    },
    seller: createSeller('seller-3', 'VW Center', '(31) 77777-7777', 'Belo Horizonte, MG', 4.6, 67),
    ...createCarBase()
  },
  {
    id: 'car-4',
    title: 'BMW 320i 2020',
    brand: 'BMW',
    model: '320i',
    year: 2020,
    price: 185000,
    km: 35000,
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    color: 'Blue',
    description: 'BMW 320i 2020, premium sports sedan with state-of-the-art technology.',
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1556189250-72ba954cfc2b?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&h=600&fit=crop&crop=center'
    ],
    location: 'Porto Alegre, RS',
    cityState: 'Porto Alegre, RS',
    specs: {
      engine: '2.0L TwinPower Turbo',
      doors: 4,
      seats: 5,
      horsepower: 184,
      features: [
        'iDrive 7.0',
        'Panoramic Sunroof',
        'Sport Leather Seats',
        'Harman Kardon Hi-Fi System',
        'BMW ConnectedDrive',
        'Full LED Headlights'
      ]
    },
    seller: createSeller('seller-4', 'BMW Sul', '(51) 66666-6666', 'Porto Alegre, RS', 4.7, 134),
    ...createCarBase()
  },
  {
    id: 'car-5',
    title: 'Ford Mustang 2019',
    brand: 'Ford',
    model: 'Mustang',
    year: 2019,
    price: 295000,
    km: 18000,
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    color: 'Red',
    description: 'Ford Mustang GT 2019, the most desired American muscle car in Brazil.',
    images: [
      'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=800&h=600&fit=crop&crop=center'
    ],
    location: 'Curitiba, PR',
    cityState: 'Curitiba, PR',
    specs: {
      engine: '5.0L V8 Coyote',
      doors: 2,
      seats: 4,
      horsepower: 466,
      features: [
        'SYNC 3',
        'Recaro Seats',
        'Sistema de Escape Ativo',
        'Modo Track',
        'Diferencial Torsen',
        'Brembo Performance'
      ]
    },
    seller: createSeller('seller-5', 'Ford Sports', '(41) 55555-5555', 'Curitiba, PR', 4.8, 201),
    ...createCarBase()
  },
  {
    id: 'car-6',
    title: 'Audi A4 2021',
    brand: 'Audi',
    model: 'A4',
    year: 2021,
    price: 220000,
    km: 12000,
    fuelType: 'Gasoline',
    transmission: 'S tronic',
    color: 'Gray',
    description: 'Audi A4 Avant 2021, sporty wagon with sophisticated design and advanced technology.',
    images: [
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1612825173281-9a193378527e?w=800&h=600&fit=crop&crop=center'
    ],
    location: 'Brasília, DF',
    cityState: 'Brasília, DF',
    specs: {
      engine: '2.0L TFSI Quattro',
      doors: 4,
      seats: 5,
      horsepower: 190,
      features: [
        'MMI Navigation Plus',
        'Virtual Cockpit',
        'Quattro AWD',
        'Matrix LED Headlights',
        'Bang & Olufsen',
        'Audi Pre Sense'
      ]
    },
    seller: createSeller('seller-6', 'Audi Center DF', '(61) 44444-4444', 'Brasília, DF', 4.5, 78),
    ...createCarBase()
  },
  {
    id: 'car-7',
    title: 'Chevrolet Camaro 2020',
    brand: 'Chevrolet',
    model: 'Camaro',
    year: 2020,
    price: 315000,
    km: 22000,
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    color: 'Yellow',
    description: 'Chevrolet Camaro SS 2020, pure power and American style.',
    images: [
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&h=600&fit=crop&crop=center'
    ],
    location: 'Salvador, BA',
    cityState: 'Salvador, BA',
    specs: {
      engine: '6.2L V8',
      doors: 2,
      seats: 4,
      horsepower: 461,
      features: [
        'MyLink',
        'Head-Up Display',
        'Magnetic Ride Control',
        'Performance Exhaust',
        'Recaro Seats',
        'Bose Premium Audio'
      ]
    },
    seller: createSeller('seller-7', 'Chevrolet Bahia', '(71) 33333-3333', 'Salvador, BA', 4.4, 92),
    ...createCarBase()
  },
  {
    id: 'car-8',
    title: 'Nissan Sentra 2022',
    brand: 'Nissan',
    model: 'Sentra',
    year: 2022,
    price: 98000,
    km: 11000,
    fuelType: 'Flex',
    transmission: 'CVT',
    color: 'Prata',
    description: 'Nissan Sentra 2022, modern sedan with excellent interior space and fuel economy.',
    images: [
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=800&h=600&fit=crop&crop=center'
    ],
    location: 'Recife, PE',
    cityState: 'Recife, PE',
    specs: {
      engine: '2.0L Flex',
      doors: 4,
      seats: 5,
      horsepower: 151,
      features: [
        'Nissan Connect',
        'Automatic A/C',
        'Câmeras 360°',
        'Frenagem Automática',
        'Alerta de Ponto Cego',
        'Partida Remota'
      ]
    },
    seller: createSeller('seller-8', 'Nissan Nordeste', '(81) 22222-2222', 'Recife, PE', 4.3, 156),
    ...createCarBase()
  },
  {
    id: 'car-9',
    title: 'Mercedes C200 2021',
    brand: 'Mercedes-Benz',
    model: 'C200',
    year: 2021,
    price: 275000,
    km: 16000,
    fuelType: 'Gasoline',
    transmission: '9G-Tronic',
    color: 'Black',
    description: 'Mercedes C200 2021, German luxury with cutting-edge technology and supreme comfort.',
    images: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop&crop=center'
    ],
    location: 'Fortaleza, CE',
    cityState: 'Fortaleza, CE',
    specs: {
      engine: '1.5L Turbo + EQBoost',
      doors: 4,
      seats: 5,
      horsepower: 184,
      features: [
        'MBUX Multimedia',
        'Burmester Audio',
        'Panoramic Sunroof',
        'Ambient Lighting',
        'Mercedes me connect',
        'Active Brake Assist'
      ]
    },
    seller: createSeller('seller-9', 'Mercedes Ceará', '(85) 11111-1111', 'Fortaleza, CE', 4.9, 87),
    ...createCarBase()
  },
  {
    id: 'car-10',
    title: 'Hyundai Tucson 2022',
    brand: 'Hyundai',
    model: 'Tucson',
    year: 2022,
    price: 165000,
    km: 9000,
    fuelType: 'Flex',
    transmission: 'Automatic',
    color: 'White',
    description: 'Hyundai Tucson 2022, modern SUV with bold design and advanced technology.',
    images: [
      'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop&crop=center'
    ],
    location: 'Goiânia, GO',
    cityState: 'Goiânia, GO',
    specs: {
      engine: '2.0L Flex',
      doors: 4,
      seats: 5,
      horsepower: 167,
      features: [
        'Bluelink Connected',
        '12.3" Display',
        'SmartSense',
        'Panoramic Sunroof',
        'Wireless Charging',
        'Terrain Mode'
      ]
    },
    seller: createSeller('seller-10', 'Hyundai Center GO', '(62) 99999-0000', 'Goiânia, GO', 4.6, 123),
    ...createCarBase()
  }
]

// Função para simular busca com delay
export async function mockDelay(ms: number = 1000): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Simular busca por carros
export async function getMockCarsList(filters?: any): Promise<CarSearchResult> {
  await mockDelay(800) // Simular delay da API
  
  let filteredCars = [...mockCars]
  
  // Aplicar filtros se existirem
  if (filters?.brand) {
    filteredCars = filteredCars.filter(car => 
      car.brand.toLowerCase().includes(filters.brand.toLowerCase())
    )
  }
  
  if (filters?.model) {
    filteredCars = filteredCars.filter(car => 
      car.model.toLowerCase().includes(filters.model.toLowerCase())
    )
  }
  
  if (filters?.yearFrom || filters?.yearTo) {
    const yearFrom = filters.yearFrom || 2000
    const yearTo = filters.yearTo || new Date().getFullYear()
    filteredCars = filteredCars.filter(car => 
      car.year >= yearFrom && car.year <= yearTo
    )
  }
  
  if (filters?.priceFrom || filters?.priceTo) {
    const priceFrom = filters.priceFrom || 0
    const priceTo = filters.priceTo || 999999999
    filteredCars = filteredCars.filter(car => 
      car.price >= priceFrom && car.price <= priceTo
    )
  }
  
  return {
    results: filteredCars,
    pagination: {
      page: 1,
      limit: filteredCars.length,
      total: filteredCars.length,
      totalPages: 1,
      hasNext: false,
      hasPrev: false
    }
  }
}

// Simular busca por ID
export async function getMockCarById(id: string): Promise<Car | null> {
  await mockDelay(600)
  
  const car = mockCars.find(car => car.id === id)
  
  return car || null
}

// Simular busca por texto
export async function searchMockCars(query: string, filters?: any): Promise<CarSearchResult> {
  await mockDelay(700)
  
  const queryLower = query.toLowerCase()
  
  let filteredCars = mockCars.filter(car => {
    return (
      car.title.toLowerCase().includes(queryLower) ||
      car.brand.toLowerCase().includes(queryLower) ||
      car.model.toLowerCase().includes(queryLower) ||
      car.description.toLowerCase().includes(queryLower)
    )
  })
  
  // Aplicar filtros adicionais se existirem
  if (filters?.brand) {
    filteredCars = filteredCars.filter(car => 
      car.brand.toLowerCase().includes(filters.brand.toLowerCase())
    )
  }
  
  return {
    results: filteredCars,
    pagination: {
      page: 1,
      limit: filteredCars.length,
      total: filteredCars.length,
      totalPages: 1,
      hasNext: false,
      hasPrev: false
    }
  }
}