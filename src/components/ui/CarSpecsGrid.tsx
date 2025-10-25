import React from 'react'
import { HStack } from '@components/ui/hstack'
import { VStack } from '@components/ui/vstack'
import { Box } from '@components/ui/box'
import { Text } from '@components/ui/text'
import { 
  Engine, 
  GasPump, 
  Speedometer, 
  Car,
  Calendar,
  Palette
} from 'phosphor-react-native'

import { colors } from '@theme/colors'
import { formatKm } from '@utils/formatters'

interface CarSpecsGridProps {
  year: number
  km: number
  fuelType: string
  transmission: string
  engine?: string
  color?: string
}

interface SpecItemProps {
  icon: React.ReactNode
  label: string
  value: string
}

function SpecItem({ icon, label, value }: SpecItemProps) {
  return (
    <VStack className="items-center flex-1" space="sm">
      <Box 
        style={{ backgroundColor: colors.neutral[800] }}
        className="w-12 h-12 rounded-2xl justify-center items-center"
      >
        {icon}
      </Box>
      <VStack className="items-center" space="xs">
        <Text className="text-gray-400 text-xs font-medium">
          {label}
        </Text>
        <Text className="text-white text-sm font-semibold text-center">
          {value}
        </Text>
      </VStack>
    </VStack>
  )
}

export default function CarSpecsGrid({
  year,
  km,
  fuelType,
  transmission,
  engine = 'V8 Turbo',
  color = 'White'
}: CarSpecsGridProps) {
  return (
    <VStack space="lg" className="px-4">
      {/* Primeira linha */}
      <HStack space="md">
        <SpecItem
          icon={<Engine size={20} color={colors.neutral[300]} weight="fill" />}
          label="ENGINE"
          value={`${transmission}/Liter`}
        />
        <SpecItem
          icon={<GasPump size={20} color={colors.neutral[300]} weight="fill" />}
          label="FUEL"
          value={engine}
        />
        <SpecItem
          icon={<Speedometer size={20} color={colors.neutral[300]} weight="fill" />}
          label="POWER"
          value="720 Hp"
        />
      </HStack>
      
      {/* Segunda linha */}
      <HStack space="md">
        <SpecItem
          icon={<Calendar size={20} color={colors.neutral[300]} weight="fill" />}
          label="YEAR"
          value={year.toString()}
        />
        <SpecItem
          icon={<Car size={20} color={colors.neutral[300]} weight="fill" />}
          label="KM"
          value={formatKm(km)}
        />
        <SpecItem
          icon={<Palette size={20} color={colors.neutral[300]} weight="fill" />}
          label="COLOR"
          value={color}
        />
      </HStack>
    </VStack>
  )
}