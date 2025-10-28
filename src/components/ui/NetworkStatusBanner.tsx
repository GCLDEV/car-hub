import React from 'react'
import { HStack } from '@components/ui/hstack'
import { Text } from '@components/ui/text'
import { WifiX, WifiHigh, Clock } from 'phosphor-react-native'
import { colors } from '@theme/colors'

interface NetworkStatusBannerProps {
  isOnline: boolean
  isConnected: boolean
  hasOfflineQueue?: boolean
}

export default function NetworkStatusBanner({ 
  isOnline, 
  isConnected, 
  hasOfflineQueue = false 
}: NetworkStatusBannerProps) {
  // Don't show banner if everything is normal
  if (isOnline && !hasOfflineQueue) {
    return null
  }

  const getStatusConfig = () => {
    if (!isConnected) {
      return {
        icon: WifiX,
        text: 'No internet connection',
        subText: 'Showing cached content',
        bgColor: 'bg-red-900/20',
        borderColor: 'border-red-500/30',
        iconColor: colors.error[500],
        textColor: 'text-red-300'
      }
    }
    
    if (!isOnline) {
      return {
        icon: WifiX,
        text: 'Limited connectivity',
        subText: 'Some features may not work',
        bgColor: 'bg-yellow-900/20',
        borderColor: 'border-yellow-500/30',
        iconColor: colors.warning[500],
        textColor: 'text-yellow-300'
      }
    }

    if (hasOfflineQueue) {
      return {
        icon: Clock,
        text: 'Syncing offline changes',
        subText: 'Your actions are being saved',
        bgColor: 'bg-blue-900/20',
        borderColor: 'border-blue-500/30',
        iconColor: colors.primary[500],
        textColor: 'text-blue-300'
      }
    }

    return {
      icon: WifiHigh,
      text: 'Connected',
      subText: 'All features available',
      bgColor: 'bg-green-900/20',
      borderColor: 'border-green-500/30',
      iconColor: colors.success[500],
      textColor: 'text-green-300'
    }
  }

  const config = getStatusConfig()
  const IconComponent = config.icon

  return (
    <HStack 
      className={`mx-4 mb-3 p-3 rounded-lg border ${config.bgColor} ${config.borderColor}`}
      space="sm"
    >
      <IconComponent 
        size={16} 
        color={config.iconColor} 
        weight="regular"
      />
      
      <HStack className="flex-1 justify-between items-center">
        <Text className={`text-sm font-medium ${config.textColor}`}>
          {config.text}
        </Text>
        
        {config.subText && (
          <Text className="text-xs text-neutral-400">
            {config.subText}
          </Text>
        )}
      </HStack>
    </HStack>
  )
}