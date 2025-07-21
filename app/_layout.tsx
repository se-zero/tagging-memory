import { Stack } from "expo-router"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { MemoryProvider } from "../src/context/MemoryContext"

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#EC4899",
    primaryContainer: "#FCE7F3",
    secondary: "#F472B6",
    surface: "#FFFFFF",
    background: "#F9FAFB",
  },
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <MemoryProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="memory/[id]" />
              <Stack.Screen name="add-memory" />
              <Stack.Screen name="edit-memory" />
              <Stack.Screen name="select-location" />
            </Stack>
          </MemoryProvider>
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
