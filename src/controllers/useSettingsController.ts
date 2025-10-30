import { useState } from 'react'
import { useRouter } from 'expo-router'
import { Alert, Linking } from 'react-native'
import Toast from 'react-native-toast-message'

import { useAuthStore } from '@store/authStore'
import { useModalStore } from '@store/modalStore'
import useAuthGuard from '@hooks/useAuthGuard'

export default function useSettingsController() {
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuthStore()
  const { setModal } = useModalStore()
  const { checkAuth } = useAuthGuard()

  // Estados locais para configurações
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [darkModeEnabled, setDarkModeEnabled] = useState(true)
  const [language, setLanguage] = useState('English')

  function goBack() {
    router.back()
  }

  // Account Settings
  function handleEditProfile() {
    checkAuth(() => {
      router.push('/edit-profile')
    })
  }

  function handleChangePassword() {
    checkAuth(() => {
      Toast.show({
        type: 'info',
        text1: 'Change Password',
        text2: 'Password change feature coming soon!'
      })
    })
  }

  // App Settings
  function toggleNotifications() {
    setNotificationsEnabled(!notificationsEnabled)
    
    Toast.show({
      type: 'success',
      text1: `Notifications ${!notificationsEnabled ? 'enabled' : 'disabled'}`,
      text2: 'Your preference has been saved'
    })
  }

  function toggleDarkMode() {
    setDarkModeEnabled(!darkModeEnabled)
    
    Toast.show({
      type: 'info',
      text1: 'Theme Setting',
      text2: 'Dark mode toggle coming soon!'
    })
  }

  function changeLanguage() {
    const languages = ['English', 'Português', 'Español']
    const currentIndex = languages.indexOf(language)
    const nextIndex = (currentIndex + 1) % languages.length
    const newLanguage = languages[nextIndex]
    
    setLanguage(newLanguage)
    
    Toast.show({
      type: 'success',
      text1: 'Language Changed',
      text2: `Language set to ${newLanguage}`
    })
  }

  // Privacy & Security
  function handlePrivacySettings() {
    Toast.show({
      type: 'info',
      text1: 'Privacy Settings',
      text2: 'Privacy controls coming soon!'
    })
  }

  // Support
  function handleHelpCenter() {
    Toast.show({
      type: 'info',
      text1: 'Help Center',
      text2: 'Help center will be available soon!'
    })
  }

  function handleAbout() {
    Toast.show({
      type: 'success',
      text1: 'Car Hub v1.0.0',
      text2: 'Made with ❤️ for car enthusiasts'
    })
  }

  // Account Actions
  function handleLogout() {
    checkAuth(() => {
      setModal({
        type: 'confirm',
        title: 'Are you sure you want to sign out?',
        confirmText: 'Sign Out',
        cancelText: 'Cancel',
        action: () => {
          logout()
          
          Toast.show({
            type: 'success',
            text1: 'Signed Out',
            text2: 'You have been successfully signed out'
          })
          
          // Navegar de volta para home
          router.push('/(tabs)/home')
        }
      })
    })
  }

  function handleDeleteAccount() {
    checkAuth(() => {
      Alert.alert(
        'Delete Account',
        'Are you absolutely sure you want to delete your account?\n\nThis action cannot be undone and will permanently delete:\n• Your profile and listings\n• Your favorites and saved searches\n• All your data\n\nType "DELETE" to confirm',
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'Delete Account',
            style: 'destructive',
            onPress: () => {
              Toast.show({
                type: 'info',
                text1: 'Account Deletion',
                text2: 'Account deletion feature coming soon!'
              })
            }
          }
        ]
      )
    })
  }

  return {
    // User data
    user,
    isAuthenticated,
    
    // Settings state
    notificationsEnabled,
    darkModeEnabled,
    language,
    
    // Settings actions
    toggleNotifications,
    toggleDarkMode,
    changeLanguage,
    
    // Account actions
    handleEditProfile,
    handleChangePassword,
    handlePrivacySettings,
    handleHelpCenter,
    handleAbout,
    handleLogout,
    handleDeleteAccount,
    
    // Navigation
    goBack
  }
}