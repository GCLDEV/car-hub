import React from 'react'
import { Tabs } from 'expo-router'
import { House, MagnifyingGlass, User, Car, Plus } from 'phosphor-react-native'
import { View } from 'react-native'
import { colors } from '@theme/colors'

export default function TabsLayout() {
  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        tabBarActiveTintColor: colors.accent[500], // Dourado para ativo
        tabBarInactiveTintColor: colors.neutral[400], // Cinza para inativo
        tabBarStyle: {
          backgroundColor: colors.neutral[900], // Fundo dark
          borderTopColor: colors.neutral[800], // Borda sutil
          borderTopWidth: 1,
          height: 96, // Mais altura para acomodar o botão central
          paddingBottom: 34, // Safe area para iPhone
          paddingTop: 16, // Mais espaço no topo
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
        name="create-listing"
        options={{
          title: 'Sell',
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: focused ? colors.accent[400] : colors.accent[500],
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: -24,
                shadowColor: colors.accent[500],
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.4,
                shadowRadius: 10,
                elevation: 12,
                borderWidth: 3,
                borderColor: colors.neutral[900],
              }}
            >
              <Plus 
                size={26} 
                color={colors.neutral[900]}
                weight="bold"
              />
            </View>
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