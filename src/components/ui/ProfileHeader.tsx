import React from 'react'
import { VStack } from '@components/ui/vstack'
import { HStack } from '@components/ui/hstack'
import { Box } from '@components/ui/box'
import { Text } from '@components/ui/text'
import { Heading } from '@components/ui/heading'
import { Pressable } from '@components/ui/pressable'
import { Avatar, AvatarFallbackText, AvatarImage } from '@components/ui/avatar'
import { Badge, BadgeText } from '@components/ui/badge'
import { 
  Bell, 
  Gear,
  Plus,
  Heart,
  Car,
  User
} from 'phosphor-react-native'

import { colors } from '@theme/colors'

interface ProfileHeaderProps {
  isAuthenticated: boolean
  user?: {
    name: string
    email: string
    avatar?: string
  }
  userListings: any[]
  favoriteCount: number
  onNotificationPress: () => void
  onSettingsPress: () => void
  onCreateListingPress: () => void
  onEditProfilePress?: () => void
  onLoginPress: () => void
}

export default function ProfileHeader({
  isAuthenticated,
  user,
  userListings,
  favoriteCount,
  onNotificationPress,
  onSettingsPress,
  onCreateListingPress,
  onEditProfilePress,
  onLoginPress
}: ProfileHeaderProps) {
  return (
    <VStack space="lg" className="px-4 pt-4 pb-6" style={{ backgroundColor: colors.neutral[900] }}>
      {/* Top bar */}
      <HStack className="justify-between items-center">
        {/* Profile title */}
        <Heading className="text-white text-2xl font-bold">
          Profile
        </Heading>
        
        {/* Actions */}
        <HStack className="items-center" space="md">
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

      {/* Profile content */}
      {isAuthenticated ? (
        <VStack space="lg">
          {/* User info with glassmorphism effect */}
          <VStack 
            className="rounded-2xl p-6"
            space="md"
            style={{ 
              backgroundColor: 'colors.alpha.white[8]',
              borderWidth: 1,
              borderColor: 'colors.alpha.white[12]'
            }}
          >
            <HStack className="items-center" space="lg">
              {/* Avatar */}
              <Avatar size="xl">
                {user?.avatar ? (
                  <AvatarImage source={{ uri: user.avatar }} />
                ) : (
                  <AvatarFallbackText>{String(user?.name || 'User')}</AvatarFallbackText>
                )}
              </Avatar>
              
              {/* User details */}
              <VStack className="flex-1" space="xs">
                <Heading className="text-white text-xl font-bold">
                  {String(user?.name || 'Usuário')}
                </Heading>
                <Text style={{ color: colors.neutral[400] }} className="text-sm">
                  {String(user?.email || 'email@exemplo.com')}
                </Text>
                
                {/* Stats and Edit button */}
                <HStack className="mt-2 justify-between items-center">
                  <HStack space="lg">
                    <HStack className="items-center" space="xs">
                      <Car size={16} color={colors.accent[500]} weight="fill" />
                      <Text style={{ color: colors.accent[500] }} className="text-sm font-semibold">
                        {userListings?.length || 0} listings
                      </Text>
                    </HStack>
                    
                    <HStack className="items-center" space="xs">
                      <Heart size={16} color={colors.error[500]} weight="fill" />
                      <Text style={{ color: colors.error[500] }} className="text-sm font-semibold">
                        {favoriteCount || 0} favorites
                      </Text>
                    </HStack>
                  </HStack>
                  
                  {onEditProfilePress && (
                    <Pressable
                      onPress={onEditProfilePress}
                      className="px-3 py-1 rounded-lg"
                      style={{ 
                        backgroundColor: colors.neutral[700],
                        borderWidth: 1,
                        borderColor: colors.neutral[600]
                      }}
                    >
                      <Text style={{ color: colors.accent[400] }} className="text-xs font-medium">
                        Edit
                      </Text>
                    </Pressable>
                  )}
                </HStack>
              </VStack>
            </HStack>
          </VStack>

          {/* Quick actions */}
          <Pressable
            onPress={onCreateListingPress}
            className="flex-row items-center justify-center py-4 px-6 rounded-2xl"
            style={{
              backgroundColor: colors.accent[500]
            }}
          >
            <Plus size={20} color={colors.neutral[900]} weight="bold" />
            <Text className="text-black font-semibold ml-2">
              Create New Listing
            </Text>
          </Pressable>
        </VStack>
      ) : (
        /* Guest state */
        <VStack 
          className="rounded-2xl p-6 items-center"
          space="lg"
          style={{ 
            backgroundColor: 'colors.alpha.white[8]',
            borderWidth: 1,
            borderColor: 'colors.alpha.white[12]'
          }}
        >
          {/* Guest avatar */}
          <Avatar size="xl" style={{ backgroundColor: colors.neutral[700] }}>
            <User size={40} color={colors.neutral[400]} weight="bold" />
          </Avatar>
          
          <VStack className="items-center" space="md">
            <VStack className="items-center" space="xs">
              <Heading className="text-white text-xl font-bold">
                Welcome!
              </Heading>
              <Text style={{ color: colors.neutral[400] }} className="text-center text-sm">
                Sign in to access your listings and favorites
              </Text>
            </VStack>
            
            <Pressable
              onPress={onLoginPress}
              className="py-3 px-8 rounded-xl"
              style={{
                backgroundColor: colors.accent[400]
              }}
            >
              <Text className="text-black font-semibold">
                Sign In
              </Text>
            </Pressable>
          </VStack>
        </VStack>
      )}
    </VStack>
  )
}
