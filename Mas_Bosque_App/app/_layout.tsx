import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View, ActivityIndicator, Text } from "react-native";
import * as Sentry from "@sentry/react-native"; // 1. Import Sentry

import { AuthProvider } from "../lib/auth";
import { initDatabase } from "../lib/database";
import Logger from "../utils/Logger"; // 2. Import your Logger

// 3. Initialize Sentry (This connects your Logger.ts to the cloud)
// Make sure EXPO_PUBLIC_SENTRY_DSN is in your .env file
Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  debug: __DEV__, // Only show debug logs in development
  tracesSampleRate: 1.0, // Capture 100% of transactions for performance monitoring
});

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const setup = async () => {
      Logger.log("App launching, starting database setup..."); // 4. Log start
      try {
        await initDatabase();
        Logger.log("Database initialized successfully.");
        setIsReady(true);
      } catch (e: any) {
        // 5. Use Logger.error so this critical failure goes to Sentry
        Logger.error("Database initialization failed", e);
      }
    };

    setup();
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={{ marginTop: 10 }}>Setting up App...</Text>
      </View>
    );
  }

  // 6. Optional: Wrap the export with Sentry to catch render errors
  // You can just return the component, but Sentry.wrap gives better crash reports.
  return (
    <AuthProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

          <Stack.Screen
            name="route/[id]"
            options={{
              presentation: "modal",
              animation: "slide_from_bottom",
            }}
          />
          <Stack.Screen
            name="record/record"
            options={{
              presentation: "modal",
              animation: "slide_from_bottom",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="(profile)/edit"
            options={{
              presentation: "modal",
              animation: "slide_from_bottom",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="sos-detail"
            options={{
              presentation: "modal", // This enables the slide-up animation
              headerShown: false,
              contentStyle: { backgroundColor: "transparent" }, // Optional transparency
            }}
          />
        </Stack>
      </GestureHandlerRootView>
    </AuthProvider>
  );
}
