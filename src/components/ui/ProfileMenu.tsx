import React from 'react'
import { VStack } from '@components/ui/vstack'
import { HStack } from '@components/ui/hstack'
import { Box } from '@components/ui/box'
import { Text } from '@components/ui/text'
import { Heading } from '@components/ui/heading'
import { Pressable } from '@components/ui/pressable'
import { 
  List,
  Heart,
  Gear,
  Bell,
  Shield,
  QuestionMark,
  SignOut,
  CaretRight,
  Car,
  Star,
  Clock,
  Eye
} from 'phosphor-react-native'

import { colors } from '@theme/colors'

interface ProfileMenuItem {
  icon: React.ReactNode
  title: string
  subtitle?: string
  value?: string | number
  onPress: () => void
  showChevron?: boolean
  variant?: 'default' | 'danger'
}

interface ProfileMenuSectionProps {
  title: string
  items: ProfileMenuItem[]
}

export function ProfileMenuSection({ title, items }: ProfileMenuSectionProps) {
  return (
    <VStack className="px-4" space="sm">
      <Heading 
        className="text-lg font-semibold ml-2"
        style={{ color: colors.neutral[200] }}
      >
        {String(title || '')}
      </Heading>
      
      <VStack 
        className="rounded-2xl overflow-hidden"
        style={{
          backgroundColor: colors.alpha.white[8],
          borderWidth: 1,
          borderColor: colors.alpha.white[12]
        }}
      >
        {items.map((item, index) => (
          <Pressable
            key={`profile-${item.title}-${index}`}
            onPress={item.onPress}
            className="px-4 py-4"
            style={{
              borderBottomWidth: index < items.length - 1 ? 1 : 0,
              borderBottomColor: colors.alpha.white[10]
            }}
          >
            <HStack className="items-center justify-between">
              <HStack className="items-center flex-1" space="md">
                <Box 
                  className="w-10 h-10 rounded-xl items-center justify-center"
                  style={{ backgroundColor: colors.neutral[800] }}
                >
                  {item.icon}
                </Box>
                
                <VStack className="flex-1" space="xs">
                  <Text 
                    className="font-medium"
                    style={{ 
                      color: item.variant === 'danger' ? colors.error[400] : colors.neutral[100] 
                    }}
                  >
                    {String(item.title || '')}
                  </Text>
                  {item.subtitle && (
                    <Text 
                      className="text-sm"
                      style={{ color: colors.neutral[400] }}
                    >
                      {String(item.subtitle)}
                    </Text>
                  )}
                </VStack>
                
                {item.value !== undefined && item.value !== null && (
                  <Text 
                    className="text-sm font-semibold"
                    style={{ color: colors.accent[500] }}
                  >
                    {String(item.value)}
                  </Text>
                )}
              </HStack>
              
              {(item.showChevron !== false) && (
                <CaretRight 
                  size={18} 
                  color={colors.neutral[500]} 
                  weight="bold" 
                />
              )}
            </HStack>
          </Pressable>
        ))}
      </VStack>
    </VStack>
  )
}

interface ProfileMenuProps {
  isAuthenticated: boolean
  userListings: any[]
  favoriteCount: number
  onMyListings: () => void
  onFavorites: () => void
  onSettings: () => void
  onNotifications: () => void
  onPrivacy: () => void
  onHelp: () => void
  onLogout: () => void
}

export default function ProfileMenu({
  isAuthenticated,
  userListings,
  favoriteCount,
  onMyListings,
  onFavorites,
  onSettings,
  onNotifications,
  onPrivacy,
  onHelp,
  onLogout
}: ProfileMenuProps) {
  if (!isAuthenticated) {
    return null
  }

  const myAccountItems: ProfileMenuItem[] = [
    {
      icon: <Car size={20} color={colors.primary[500]} weight="bold" />,
      title: 'My Listings',
      subtitle: 'Manage your advertised cars',
      value: userListings?.length || 0,
      onPress: onMyListings
    },
    {
      icon: <Heart size={20} color={colors.error[500]} weight="fill" />,
      title: 'Favorites',
      subtitle: 'Saved cars as favorites',
      value: favoriteCount || 0,
      onPress: onFavorites
    },
    {
      icon: <Eye size={20} color={colors.accent[500]} weight="bold" />,
      title: 'Views',
      subtitle: 'Analytics of your listings',
      value: '1.2k',
      onPress: () => {}
    }
  ]

  const settingsItems: ProfileMenuItem[] = [
    {
      icon: <Gear size={20} color={colors.neutral[400]} weight="bold" />,
      title: 'Settings',
      subtitle: 'Account preferences',
      onPress: onSettings
    },
    {
      icon: <Bell size={20} color={colors.neutral[400]} weight="bold" />,
      title: 'Notifications',
      subtitle: 'Manage your notifications',
      onPress: onNotifications
    },
    {
      icon: <Shield size={20} color={colors.neutral[400]} weight="bold" />,
      title: 'Privacy',
      subtitle: 'Control your data',
      onPress: onPrivacy
    }
  ]

  const supportItems: ProfileMenuItem[] = [
    {
      icon: <QuestionMark size={20} color={colors.neutral[400]} weight="bold" />,
      title: 'Help',
      subtitle: 'Support and FAQ',
      onPress: onHelp
    },
    {
      icon: <SignOut size={20} color={colors.error[500]} weight="bold" />,
      title: 'Sign Out',
      subtitle: 'Logout from account',
      variant: 'danger',
      onPress: onLogout
    }
  ]

  return (
    <VStack space="lg" className="pb-8">
      <ProfileMenuSection 
        title="My Account"
        items={myAccountItems}
      />
      
      <ProfileMenuSection 
        title="Settings"
        items={settingsItems}
      />
      
      <ProfileMenuSection 
        title="Support"
        items={supportItems}
      />
    </VStack>
  )
}