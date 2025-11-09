import React from "react";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "../lib/auth"; // Your auth provider

export default function RootLayout() {
  return (
    // 1. KEEP your AuthProvider exactly where it is.
    <AuthProvider>
      {/* 2. ADD GestureHandlerRootView here for the bottom sheet */}
      <GestureHandlerRootView style={{ flex: 1 }}>
        {/* 3. REPLACE <Slot /> with this <Stack> */}
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          {/* This screen is your app/(tabs)/_layout.tsx file */}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

          {/* This screen is your app/route/[id].tsx file.
              This is what adds the "slide_from_bottom" animation. */}
          <Stack.Screen
            name="route/[id]"
            options={{
              presentation: "modal",
              animation: "slide_from_bottom",
            }}
          />
        </Stack>
      </GestureHandlerRootView>
    </AuthProvider>
  );
}
