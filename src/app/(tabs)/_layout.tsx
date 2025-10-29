import React from 'react'
import { Tabs } from 'expo-router'
import { House, MagnifyingGlass, User, Car } from 'phosphor-react-native'
import { colors } from '@theme/colors'

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.accent[500], // Dourado para ativo
        tabBarInactiveTintColor: colors.neutral[400], // Cinza para inativo
        tabBarStyle: {
          backgroundColor: colors.neutral[900], // Fundo dark
          borderTopColor: colors.neutral[800], // Borda sutil
          borderTopWidth: 1,
          height: 88, // Mais altura para visual moderno
          paddingBottom: 34, // Safe area para iPhone
          paddingTop: 8,
          elevation: 0, // Remove sombra no Android
          shadowOpacity: 0, // Remove sombra no iOS
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginTop: 2,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <House size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size }) => (
            <MagnifyingGlass size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="my-listings"
        options={{
          title: 'My Listings',
          tabBarIcon: ({ color, size }) => (
            <Car size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <User size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  )
}