import { Keyboard } from "react-native"

export const useKeyboardDismiss = () => {
  const dismissKeyboard = () => {
    Keyboard.dismiss()
  }

  return { dismissKeyboard }
}