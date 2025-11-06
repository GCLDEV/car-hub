import React, { useEffect, useRef } from 'react'
import { Animated, Easing } from 'react-native'
import { HStack } from '@components/ui/hstack'
import { Text } from '@components/ui/text'
import { VStack } from '@components/ui/vstack'

interface TypingIndicatorProps {
  visible: boolean
  userName?: string
}

export default function TypingIndicator({ visible, userName = 'Usuário' }: TypingIndicatorProps) {
  const opacity = useRef(new Animated.Value(0)).current
  const dot1 = useRef(new Animated.Value(0)).current
  const dot2 = useRef(new Animated.Value(0)).current
  const dot3 = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (visible) {
      // Fade in
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start()

      // Animate dots
      const animateDots = () => {
        const animateDot = (dot: Animated.Value, delay: number) => {
          return Animated.sequence([
            Animated.delay(delay),
            Animated.timing(dot, {
              toValue: 1,
              duration: 400,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(dot, {
              toValue: 0,
              duration: 400,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ])
        }

        Animated.loop(
          Animated.stagger(200, [
            animateDot(dot1, 0),
            animateDot(dot2, 0),
            animateDot(dot3, 0),
          ])
        ).start()
      }

      animateDots()
    } else {
      // Fade out
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start()
    }
  }, [visible, opacity, dot1, dot2, dot3])

  if (!visible) return null

  return (
    <Animated.View style={{ opacity }}>
      <VStack className="px-4 py-2">
        <HStack className="items-center space-x-2">
          <Text className="text-neutral-400 text-sm">
            {userName} está digitando
          </Text>
          <HStack className="items-center space-x-1">
            <Animated.View 
              className="w-2 h-2 bg-neutral-400 rounded-full"
              style={{
                opacity: dot1,
                transform: [{
                  scale: dot1.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1.2],
                  })
                }]
              }}
            />
            <Animated.View 
              className="w-2 h-2 bg-neutral-400 rounded-full"
              style={{
                opacity: dot2,
                transform: [{
                  scale: dot2.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1.2],
                  })
                }]
              }}
            />
            <Animated.View 
              className="w-2 h-2 bg-neutral-400 rounded-full"
              style={{
                opacity: dot3,
                transform: [{
                  scale: dot3.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1.2],
                  })
                }]
              }}
            />
          </HStack>
        </HStack>
      </VStack>
    </Animated.View>
  )
}