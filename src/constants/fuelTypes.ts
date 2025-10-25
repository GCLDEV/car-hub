export const fuelTypes = [
  'Gasoline',
  'Ethanol', 
  'Flex',
  'Diesel',
  'CNG',
  'Hybrid',
  'Electric'
] as const

export const transmissionTypes = [
  'Manual',
  'Automatic',
  'CVT',
  'Automated'
] as const

export const carColors = [
  'White',
  'Silver',
  'Black',
  'Gray',
  'Blue',
  'Red',
  'Green',
  'Yellow',
  'Gold',
  'Brown',
  'Beige',
  'Purple',
  'Pink',
  'Orange'
] as const

export const carConditions = [
  'New',
  'Pre-owned',
  'Used'
] as const

export const sortOptions = [
  { label: 'Most recent', value: 'created_at' },
  { label: 'Lowest price', value: 'price_asc' },
  { label: 'Highest price', value: 'price_desc' },
  { label: 'Lowest mileage', value: 'km_asc' },
  { label: 'Highest mileage', value: 'km_desc' },
  { label: 'Oldest', value: 'year_asc' },
  { label: 'Newest', value: 'year_desc' }
] as const

export const priceRanges = [
  { label: 'Up to $20,000', min: 0, max: 20000 },
  { label: '$20,000 - $40,000', min: 20000, max: 40000 },
  { label: '$40,000 - $60,000', min: 40000, max: 60000 },
  { label: '$60,000 - $80,000', min: 60000, max: 80000 },
  { label: '$80,000 - $100,000', min: 80000, max: 100000 },
  { label: 'Above $100,000', min: 100000, max: null }
] as const

export const yearRanges = [
  { label: '2020 or newer', min: 2020, max: null },
  { label: '2015 - 2019', min: 2015, max: 2019 },
  { label: '2010 - 2014', min: 2010, max: 2014 },
  { label: '2005 - 2009', min: 2005, max: 2009 },
  { label: 'Up to 2004', min: null, max: 2004 }
] as const

export const kmRanges = [
  { label: 'Up to 20,000 km', min: 0, max: 20000 },
  { label: '20,000 - 50,000 km', min: 20000, max: 50000 },
  { label: '50,000 - 100,000 km', min: 50000, max: 100000 },
  { label: '100,000 - 150,000 km', min: 100000, max: 150000 },
  { label: 'Above 150,000 km', min: 150000, max: null }
] as const

export type FuelType = typeof fuelTypes[number]
export type TransmissionType = typeof transmissionTypes[number]
export type CarColor = typeof carColors[number]
export type CarCondition = typeof carConditions[number]