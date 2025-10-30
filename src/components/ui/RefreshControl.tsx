import React from 'react'
import { RefreshControl as RNRefreshControl, RefreshControlProps as RNRefreshControlProps } from 'react-native'
import { colors } from '@theme/colors'

interface RefreshControlProps extends Partial<RNRefreshControlProps> {
  refreshing: boolean
  onRefresh: () => void | Promise<void>
  color?: string
  backgroundColor?: string
}

export function RefreshControl({
  refreshing,
  onRefresh,
  color = colors.accent[500],
  backgroundColor = colors.neutral[800],
  ...props
}: RefreshControlProps) {
  return (
    <RNRefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      
      // iOS específico
      tintColor={color}
      
      // Android específico  
      colors={[color]}
      progressBackgroundColor={backgroundColor}
      
      // Configurações de UX
      progressViewOffset={0}
      
      // Props customizadas
      {...props}
    />
  )
}

export default RefreshControl