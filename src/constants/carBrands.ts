export const carBrands = [
  'Audi',
  'BMW', 
  'Chevrolet',
  'Citroën',
  'Fiat',
  'Ford',
  'Honda',
  'Hyundai',
  'Jeep',
  'Kia',
  'Mitsubishi',
  'Nissan',
  'Peugeot',
  'Renault',
  'Toyota',
  'Volkswagen',
  'Volvo'
] as const

export const carModelsByBrand: Record<string, string[]> = {
  'Audi': ['A3', 'A4', 'A5', 'A6', 'Q3', 'Q5', 'Q7', 'Q8'],
  'BMW': ['1 Series', '3 Series', '5 Series', 'X1', 'X3', 'X5', 'X6'],
  'Chevrolet': ['Onix', 'Prisma', 'Cruze', 'Cobalt', 'S10', 'Tracker', 'Equinox'],
  'Citroën': ['C3', 'C4', 'C4 Lounge', 'Aircross', 'Jumper'],
  'Fiat': ['Uno', 'Argo', 'Cronos', 'Pulse', 'Fastback', 'Strada', 'Toro', 'Mobi'],
  'Ford': ['Ka', 'Fiesta', 'Focus', 'Fusion', 'EcoSport', 'Edge', 'Ranger'],
  'Honda': ['Fit', 'City', 'Civic', 'Accord', 'HR-V', 'CR-V', 'Pilot'],
  'Hyundai': ['HB20', 'HB20S', 'Elantra', 'Azera', 'Creta', 'Tucson', 'Santa Fe'],
  'Jeep': ['Renegade', 'Compass', 'Cherokee', 'Grand Cherokee', 'Wrangler'],
  'Kia': ['Picanto', 'Rio', 'Cerato', 'Optima', 'Sportage', 'Sorento', 'Stonic'],
  'Mitsubishi': ['Mirage', 'Lancer', 'Outlander', 'Pajero', 'ASX', 'Eclipse Cross'],
  'Nissan': ['March', 'Versa', 'Sentra', 'Altima', 'Kicks', 'X-Trail', 'Frontier'],
  'Peugeot': ['208', '308', '408', '508', '2008', '3008', '5008'],
  'Renault': ['Kwid', 'Logan', 'Sandero', 'Duster', 'Captur', 'Koleos'],
  'Toyota': ['Etios', 'Yaris', 'Corolla', 'Camry', 'RAV4', 'Hilux', 'SW4'],
  'Volkswagen': ['Up!', 'Gol', 'Polo', 'Virtus', 'Jetta', 'Passat', 'Golf', 'T-Cross', 'Tiguan', 'Touareg'],
  'Volvo': ['S60', 'S90', 'XC40', 'XC60', 'XC90']
}

export type CarBrand = typeof carBrands[number]