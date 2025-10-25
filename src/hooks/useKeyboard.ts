import { useState, useEffect } from 'react'
import { Keyboard, KeyboardEvent } from 'react-native'

interface UseKeyboardReturn {
  keyboardVisible: boolean
  keyboardHeight: number
}

/**
 * Hook para detectar estado do teclado virtual
 * Útil para ajustar layouts quando o teclado aparece
 * 
 * @returns Estado e altura do teclado
 */
export function useKeyboard(): UseKeyboardReturn {
  const [keyboardVisible, setKeyboardVisible] = useState(false)
  const [keyboardHeight, setKeyboardHeight] = useState(0)

  useEffect(() => {
    function onKeyboardDidShow(event: KeyboardEvent) {
      setKeyboardVisible(true)
      setKeyboardHeight(event.endCoordinates.height)
    }

    function onKeyboardDidHide() {
      setKeyboardVisible(false)
      setKeyboardHeight(0)
    }

    const showSubscription = Keyboard.addListener('keyboardDidShow', onKeyboardDidShow)
    const hideSubscription = Keyboard.addListener('keyboardDidHide', onKeyboardDidHide)

    return () => {
      showSubscription?.remove()
      hideSubscription?.remove()
    }
  }, [])

  return {
    keyboardVisible,
    keyboardHeight,
  }
}

export default useKeyboard