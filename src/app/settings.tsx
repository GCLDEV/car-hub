import React from 'react'
import { ScrollView, Switch, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'

import { VStack } from '@components/ui/vstack'
import { HStack } from '@components/ui/hstack'
import { Box } from '@components/ui/box'
import { Text } from '@components/ui/text'
import { Pressable } from '@components/ui/pressable'
import { View } from 'react-native'

import {
  ArrowLeft,
  Bell,
  Moon,
  Globe,
  Shield,
  QuestionMark,
  Info,
  SignOut,
  Trash,
  User,
  Lock,
  Eye,
  CarProfile
} from 'phosphor-react-native'

import { colors } from '@theme/colors'
import useSettingsController from '@/controllers/useSettingsController'

interface SettingItemProps {
  icon: React.ReactNode
  title: string
  subtitle?: string
  onPress?: () => void
  rightElement?: React.ReactNode
  showArrow?: boolean
  variant?: 'default' | 'danger'
}

function SettingItem({
  icon,
  title,
  subtitle,
  onPress,
  rightElement,
  showArrow = true,
  variant = 'default'
}: SettingItemProps) {
  const isInteractive = !!onPress
  
  return (
    <Pressable
      onPress={onPress}
      disabled={!isInteractive}
      className={`p-4 ${isInteractive ? 'active:opacity-70' : ''}`}
    >
      <HStack className="items-center justify-between">
        <HStack className="items-center flex-1" space="md">
          <Box
            className="w-10 h-10 rounded-full items-center justify-center"
            style={{
              backgroundColor: variant === 'danger' 
                ? colors.error[500] + '20'
                : colors.neutral[700]
            }}
          >
            {icon}
          </Box>
          
          <VStack className="flex-1" space="xs">
            <Text
              className="font-semibold"
              style={{
                color: variant === 'danger' 
                  ? colors.error[500]
                  : colors.neutral[100]
              }}
            >
              {title}
            </Text>
            {subtitle && (
              <Text
                className="text-sm"
                style={{ color: colors.neutral[400] }}
              >
                {subtitle}
              </Text>
            )}
          </VStack>
        </HStack>
        
        {rightElement || (showArrow && isInteractive && (
          <ArrowLeft
            size={20}
            color={colors.neutral[400]}
            style={{ transform: [{ rotate: '180deg' }] }}
          />
        ))}
      </HStack>
    </Pressable>
  )
}

interface SettingSectionProps {
  title: string
  children: React.ReactNode
}

function SettingSection({ title, children }: SettingSectionProps) {
  return (
    <VStack space="xs" className="mb-6">
      <Text
        className="text-sm font-semibold px-4 mb-2"
        style={{ color: colors.neutral[400] }}
      >
        {title.toUpperCase()}
      </Text>
      <Box
        className="rounded-xl overflow-hidden"
        style={{ backgroundColor: colors.neutral[800] }}
      >
        {children}
      </Box>
    </VStack>
  )
}

export default function SettingsScreen() {
  const router = useRouter()
  const {
    user,
    isAuthenticated,
    notificationsEnabled,
    darkModeEnabled,
    language,
    toggleNotifications,
    toggleDarkMode,
    changeLanguage,
    handleEditProfile,
    handleChangePassword,
    handlePrivacySettings,
    handleHelpCenter,
    handleAbout,
    handleLogout,
    handleDeleteAccount,
    goBack
  } = useSettingsController()

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.neutral[900] }}>
      {/* Header */}
      <HStack className="items-center px-4 py-3 border-b" style={{ borderBottomColor: colors.neutral[800] }}>
        <Pressable
          className="w-10 h-10 rounded-full justify-center items-center mr-3"
          style={{ backgroundColor: colors.neutral[800] }}
          onPress={goBack}
        >
          <ArrowLeft size={20} color={colors.neutral[50]} />
        </Pressable>
        
        <Text className="text-white text-lg font-semibold flex-1">
          Settings
        </Text>
      </HStack>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16 }}
      >
        {/* Account Section */}
        {isAuthenticated && (
          <SettingSection title="Account">
            <SettingItem
              icon={<User size={20} color={colors.accent[500]} />}
              title="Edit Profile"
              subtitle="Update your personal information"
              onPress={handleEditProfile}
            />
            <View style={{ height: 1, backgroundColor: colors.neutral[700] }} />
            <SettingItem
              icon={<Lock size={20} color={colors.accent[500]} />}
              title="Change Password"
              subtitle="Update your account password"
              onPress={handleChangePassword}
            />
          </SettingSection>
        )}

        {/* App Settings */}
        <SettingSection title="App Settings">
          <SettingItem
            icon={<Bell size={20} color={colors.accent[500]} />}
            title="Notifications"
            subtitle="Push notifications and alerts"
            rightElement={
              <Switch
                value={notificationsEnabled}
                onValueChange={toggleNotifications}
                trackColor={{
                  false: colors.neutral[600],
                  true: colors.accent[500]
                }}
                thumbColor={colors.neutral[100]}
              />
            }
            showArrow={false}
          />          
        </SettingSection>

        {/* Privacy & Security */}
        <SettingSection title="Privacy & Security">
          <SettingItem
            icon={<Shield size={20} color={colors.accent[500]} />}
            title="Privacy Settings"
            subtitle="Control your data and privacy"
            onPress={handlePrivacySettings}
          />
          <View style={{ height: 1, backgroundColor: colors.neutral[700] }} />
          <SettingItem
            icon={<Eye size={20} color={colors.accent[500]} />}
            title="Data & Privacy"
            subtitle="Manage your personal data"
            onPress={handlePrivacySettings}
          />
        </SettingSection>

        {/* Account Actions */}
        {isAuthenticated && (
          <SettingSection title="Account Actions">
            <SettingItem
              icon={<SignOut size={20} color={colors.error[500]} />}
              title="Sign Out"
              subtitle="Sign out of your account"
              onPress={handleLogout}
              variant="danger"
            />
            <View style={{ height: 1, backgroundColor: colors.neutral[700] }} />
            <SettingItem
              icon={<Trash size={20} color={colors.error[500]} />}
              title="Delete Account"
              subtitle="Permanently delete your account"
              onPress={handleDeleteAccount}
              variant="danger"
            />
          </SettingSection>
        )}

      </ScrollView>
    </SafeAreaView>
  )
}
