import React from 'react'
import { Stack } from 'expo-router'

export default function ChatLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: '#171717', // colors.neutral[900]
        },
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{
          title: 'Messages',
        }}
      />
      <Stack.Screen 
        name="[conversationId]" 
        options={{
          title: 'Chat',
          presentation: 'card',
        }}
      />
    </Stack>
  )
}