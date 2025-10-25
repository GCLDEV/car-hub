# Car Marketplace - React Native App

Este é um aplicativo de compra e venda de carros usando React Native com Expo Go e Gluestack UI.

## Architecture Overview

**Controller Pattern**: Screens in `src/app/` contain only UI logic. Business logic is centralized in `src/controllers/` to avoid Expo Router conflicts. Each screen imports its corresponding controller hook.

**Mock Data System**: All API calls use mock data from `src/services/mockData.ts`. The `src/services/api/` layer provides a consistent interface that can be easily swapped for real APIs later.

**Component Structure**: Gluestack UI base components are in `src/components/ui/[component]/` while custom UI components are directly in `src/components/ui/`. Never create index.ts files for re-exports.

**Package Manager**: This project exclusively uses **Yarn** for all package management. Never use npm commands.

## Tech Stack

- **Framework**: React Native with Expo Router (file-based routing)
- **UI**: Gluestack UI v2 + Tailwind CSS (className prop)
- **Icons**: Phosphor React Native (never emojis)
- **State**: Zustand stores with persistence
- **Data**: React Query + Mock API system
- **Types**: Strict TypeScript (never `any`, use `unknown`)

## Path Aliases & Imports

Use path aliases for clean imports:
```typescript
// ✅ CORRECT
import { useAuthStore } from '@store/authStore'
import { Car } from '@/types/car'
import CarCard from '@components/ui/CarCard'

// ❌ WRONG - relative paths
import { useAuthStore } from '../../store/authStore'
```

## Critical Patterns

### Screen/Controller Pattern
```typescript
// Screen: src/app/(tabs)/home.tsx
import useController from '@controllers/useHomeController'

export default function Home() {
  const { cars, loading, handleCarPress } = useController()
  // Only UI logic here
}

// Controller: src/controllers/useHomeController.ts  
export default function useHomeController() {
  // All business logic here
  return { cars, loading, handleCarPress }
}
```

### Modal System (Zustand Store)
```typescript
import { useModalStore } from '@store/modalStore'

const { setModal } = useModalStore()

// Confirmation modal
setModal({
  type: 'confirm',
  title: 'Delete car?',
  action: () => deleteCar(),
  isDestructive: true
})

// Info modal  
setModal({
  type: 'info',
  title: 'Feature Coming Soon',
  message: 'This feature will be available in the next update.'
})
```

### Mock API System
All API calls use comprehensive mock data from `src/services/mockData.ts`:
```typescript
// src/services/api/cars.ts
export async function getCarsList(filters?: CarFilters): Promise<CarSearchResult> {
  return await getMockCarsList(filters)
}

// src/services/mockData.ts - 10 diverse cars with realistic data
export const mockCars: Car[] = [
  {
    id: 'car-1',
    title: 'Toyota Corolla 2022',
    price: 95000,
    images: ['https://images.unsplash.com/...'],
    location: 'São Paulo, SP',
    // Complete car data with seller info, specs, etc.
  }
]
```

### Component Architecture
```typescript
// ✅ Direct imports (no index.ts files)
import CarCard from '@components/ui/CarCard'
import { VStack } from '@components/ui/vstack'
import { Text } from '@components/ui/text'

// ✅ Gluestack UI + Custom components
export default function CarCard({ car, onPress }: CarCardProps) {
  return (
    <Pressable onPress={onPress}>
      <VStack className="bg-neutral-800 rounded-xl p-4">
        <Text className="text-white font-semibold">{car.title}</Text>
      </VStack>
    </Pressable>
  )
}
```

### Design System Usage
```typescript
// ✅ Use design tokens, not hardcoded values
import { colors } from '@theme/colors'

// Colors
color={colors.primary[500]}        // Not hardcoded hex
bg={colors.neutral[900]}          // Not hardcoded hex

// Spacing with Tailwind classes
className="p-4 mb-6 mx-3"        // Not margin: 16

// Icons from Phosphor React Native
import { Heart, MapPin } from 'phosphor-react-native'
<Heart size={24} color={colors.error[500]} weight="fill" />
```

## Essential Workflows

### Development Commands
```bash
# Start development server
yarn start

# Run with specific platform
yarn android
yarn ios

# Build for production
npx expo export --platform web --output-dir dist
```

### Key Files for AI Understanding

**Core Data Flow**: `src/services/mockData.ts` → `src/services/api/cars.ts` → `src/controllers/useHomeController.ts` → `src/app/(tabs)/home.tsx`

**Modal System**: `src/store/modalStore.ts` + `src/components/Modal/` components for app-wide confirmations and info displays

**Design System**: `src/theme/` contains all design tokens (colors, spacing, typography) used throughout the app

### Common Patterns

**TypeScript**: Never use `any`, prefer `unknown` for uncertain types. All API responses are fully typed.

**Error Handling**: Use React Query for API state + Toast for user feedback:
```typescript
const { data: cars, isLoading, error } = useInfiniteQuery({
  queryKey: ['cars', filters],
  queryFn: async ({ pageParam = 1 }) => await getCarsList({ ...filters, page: pageParam })
})
```

**Function Style**: Use `async function` instead of `const asyncFn = async ()`:
```typescript
// ✅ CORRECT
async function fetchCars(): Promise<Car[]> {
  const response = await getCarsList()
  return response.results
}

// ❌ WRONG
const fetchCars = async () => {
  // ...
}
```

**Styling**: Use Gluestack UI components + Tailwind classes, never StyleSheet:
```typescript
// ✅ CORRECT
<VStack className="flex-1 justify-center items-center p-5">
  <Text className="text-white text-lg font-semibold">
    {car.title}
  </Text>
</VStack>

// ❌ WRONG
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center' }
})
```

## Project Rules

### DO:
- Export components directly (no index.ts files)
- Use `async function` for async operations
- Separate screens (UI) from controllers (logic)
- Use TypeScript strict typing
- Use design tokens from `@theme/`
- Use Phosphor React Native icons
- Use React Query for data fetching
- Use Zustand for state management
- Use **Yarn** exclusively for package management

### DON'T:
- Create index.ts for re-exports
- Use `const asyncFn = async () =>`
- Mix business logic in screen components
- Use `any` type (use `unknown`)
- Hardcode colors/spacing (use tokens)
- Use emojis for icons
- Use StyleSheet (use className)
- Use external APIs (use mock data)
- Use **npm** commands (always use Yarn)

## Integration Points

**Authentication**: Mock auth system in `src/services/api/auth.ts` with realistic user data
**Car Listings**: Mock cars with Brazilian locations, realistic pricing, Unsplash images
**Favorites**: Persisted Zustand store with AsyncStorage
**Filters**: Global filter state shared between search and home screens
**Modals**: Centralized modal system for confirmations and info displays