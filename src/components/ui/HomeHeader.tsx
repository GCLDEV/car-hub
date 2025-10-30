import React from 'react'
import { VStack } from '@components/ui/vstack'
import { HStack } from '@components/ui/hstack'
import { Box } from '@components/ui/box'
import { Text } from '@components/ui/text'
import { Pressable } from '@components/ui/pressable'
import { Avatar, AvatarFallbackText, AvatarImage } from '@components/ui/avatar'
import { Badge, BadgeText } from '@components/ui/badge'
import {
  Bell,
  MagnifyingGlass,
  Plus,
  MapPin,
  User,
  Gear,
  Funnel
} from 'phosphor-react-native'

import { colors } from '@theme/colors'

interface HomeHeaderProps {
  userName: string
  userLocation: string
  notificationCount?: number
  activeFiltersCount?: number
  onNotificationPress: () => void
  onLocationPress: () => void
  onSearchPress: () => void
  onFiltersPress: () => void
  onClearFiltersPress?: () => void
  onSettingsPress: () => void
}

export default function HomeHeader({
  userName,
  userLocation,
  notificationCount = 0,
  activeFiltersCount = 0,
  onNotificationPress,
  onLocationPress,
  onSearchPress,
  onFiltersPress,
  onClearFiltersPress,
  onSettingsPress
}: HomeHeaderProps) {
  return (
    <VStack space="lg" className="px-4 pt-4 pb-6" style={{ backgroundColor: colors.neutral[900] }}>
      {/* Top bar */}
      <HStack className="justify-between items-center">
        {/* Location */}
        <Pressable
          onPress={onLocationPress}
          className="flex-row items-center flex-1"
        >
          <MapPin size={16} color={colors.neutral[400]} weight="fill" />
          <Text className="text-gray-400 text-sm font-medium ml-2">
            {userLocation}
          </Text>
        </Pressable>

        <HStack space='md'>
          {/* Notifications */}
          <Pressable
            onPress={onNotificationPress}
            className="relative"
            style={{
              backgroundColor: colors.neutral[800],
              borderRadius: 12,
              padding: 12
            }}
          >
            <Bell size={20} color={colors.neutral[300]} weight="bold" />
            <Badge
              className="absolute -top-1 -right-1"
              style={{
                backgroundColor: colors.error[500],
                minWidth: 18,
                height: 18
              }}
            >
              <BadgeText className="text-white text-xs">{'3'}</BadgeText>
            </Badge>
          </Pressable>

          {/* Settings */}
          <Pressable
            onPress={onSettingsPress}
            style={{
              backgroundColor: colors.neutral[800],
              borderRadius: 12,
              padding: 12
            }}
          >
            <Gear size={20} color={colors.neutral[300]} weight="bold" />
          </Pressable>
        </HStack>
      </HStack>

      {/* Greeting */}
      <VStack space="xs">
        <Text className="text-white text-base">
          Hello, <Text className="font-semibold">{userName}</Text>
        </Text>
        <Text style={{ color: colors.accent[500] }} className="text-lg font-bold">
          Get Your Dream Car Today!
        </Text>
      </VStack>

      {/* Action buttons */}
      <HStack space="md" className="items-center">
        {/* Search */}
        <Pressable
          onPress={onSearchPress}
          className="flex-1 rounded-2xl p-4 flex-row items-center"
          style={{ backgroundColor: colors.neutral[800] }}
        >
          <MagnifyingGlass size={20} color={colors.neutral[400]} />
          <Text className="text-gray-400 ml-3 flex-1">
            Search cars...
          </Text>
        </Pressable>

        {/* Clear Filters button (only show when filters are active) */}
        {activeFiltersCount > 0 && (
          <Pressable
            onPress={onClearFiltersPress}
            style={{ backgroundColor: colors.error[500] }}
            className="px-3 h-12 rounded-2xl justify-center items-center flex-row"
          >
            <Text className="text-white text-sm font-medium mr-1">
              Clear ({activeFiltersCount})
            </Text>
          </Pressable>
        )}

        {/* Filter button */}
        <Pressable
          onPress={onFiltersPress}
          style={{ 
            backgroundColor: activeFiltersCount > 0 ? colors.accent[500] : colors.neutral[700] 
          }}
          className="w-16 h-14 rounded-2xl justify-center items-center relative"
        >
          <Funnel size={20} color={colors.neutral[900]} weight="bold" />
          {activeFiltersCount > 0 && (
            <Box
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full justify-center items-center"
              style={{ backgroundColor: colors.error[500] }}
            >
              <Text className="text-white text-xs font-bold">
                {activeFiltersCount > 9 ? '9+' : activeFiltersCount}
              </Text>
            </Box>
          )}
        </Pressable>
      </HStack>
    </VStack>
  )
}