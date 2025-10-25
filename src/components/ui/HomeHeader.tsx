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
  User
} from 'phosphor-react-native'

import { colors } from '@theme/colors'

interface HomeHeaderProps {
  userName: string
  userLocation: string
  notificationCount?: number
  onNotificationPress: () => void
  onLocationPress: () => void
  onSearchPress: () => void
  onCreatePress: () => void
}

export default function HomeHeader({
  userName,
  userLocation,
  notificationCount = 0,
  onNotificationPress,
  onLocationPress,
  onSearchPress,
  onCreatePress
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
        
        {/* Notifications */}
        <Pressable
          onPress={onNotificationPress}
          className="relative"
        >
          <Box className="w-10 h-10 bg-gray-800 rounded-full justify-center items-center">
            <Bell size={20} color={colors.neutral[300]} weight="regular" />
          </Box>
          
          {notificationCount > 0 && (
            <Box className="absolute -top-1 -right-1">
              <Badge className="bg-red-500 w-5 h-5 rounded-full justify-center items-center min-w-0 p-0">
                <BadgeText className="text-white text-xs font-bold">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </BadgeText>
              </Badge>
            </Box>
          )}
        </Pressable>
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
        
        {/* Add button */}
        <Pressable
          onPress={onCreatePress}
          style={{ backgroundColor: colors.accent[500] }}
          className="w-12 h-12 rounded-2xl justify-center items-center"
        >
          <Plus size={24} color={colors.neutral[900]} weight="bold" />
        </Pressable>
      </HStack>
    </VStack>
  )
}