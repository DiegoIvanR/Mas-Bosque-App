import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View, ActivityIndicator, Text } from "react-native"; // Imports for loading screen
import { AuthProvider } from "../lib/auth";
import { initDatabase } from "../lib/database";

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const setup = async () => {
      try {
        // Initialize the database (create tables if they don't exist)
        await initDatabase();
        setIsReady(true);
      } catch (e) {
        console.error("Database initialization failed:", e);
      }
    };

    setup();
  }, []);

  // 1. If database isn't ready, show a loading spinner
  // This PREVENTS the tabs from loading and crashing
  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={{ marginTop: 10 }}>Setting up App...</Text>
      </View>
    );
  }

  // 2. Once ready, render the providers and stack
  return (
    <AuthProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

          {/* The Route Details Modal */}
          <Stack.Screen
            name="route/[id]"
            options={{
              presentation: "modal",
              animation: "slide_from_bottom",
            }}
          />
          <Stack.Screen
            name="record"
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
