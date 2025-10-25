export * from './colors'
export * from './typography' 
export * from './spacing'
export * from './shadows'

import { colors } from './colors'
import { typography } from './typography'
import { spacing } from './spacing'
import { shadows } from './shadows'

export const theme = {
  colors,
  typography,
  spacing,
  shadows,
}

export type Theme = typeof theme