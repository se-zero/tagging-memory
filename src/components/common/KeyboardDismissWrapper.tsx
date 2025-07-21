import { useKeyboardDismiss } from "@/hooks/useKeyboardDismiss"
import type React from "react"
import { TouchableWithoutFeedback } from "react-native"

export const KeyboardDismissWrapper = ({ children }: { children: React.ReactNode }) => {
  const { dismissKeyboard } = useKeyboardDismiss()

  return <TouchableWithoutFeedback onPress={dismissKeyboard}>{children}</TouchableWithoutFeedback>
}
