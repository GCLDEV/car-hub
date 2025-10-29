export const carCategories = [
  'Sedan',
  'Hatchback', 
  'SUV',
  'Pickup',
  'Wagon',
  'Coupe',
  'Conversível',
  'Minivan',
  'Crossover',
  'Compact'
] as const

export type CarCategory = typeof carCategories[number]