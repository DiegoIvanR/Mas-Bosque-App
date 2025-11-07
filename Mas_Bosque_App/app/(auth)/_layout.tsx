import React, { useState } from "react";
import { Stack, router, useSegments } from "expo-router";
import GoBackButton from "@/components/GoBackButton";
import { Platform } from "react-native";

// This is the common parent. It provides the state.
export default function LoginLayout() {
  // 2. Get the current URL segments
  const segments = useSegments();
  // 3. Check if we are on the first screen (e.g., /signup)
  // The segments array will be ['(signup)'] for the index route.
  // For /signup/password, it will be ['(signup)', 'password'].
  const isFirstScreen = segments.length === 2;

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTransparent: true,
        headerTitle: "",
        animation: "simple_push",

        // 5. This is the new, conditional logic
        headerLeft: () => {
          // If it's the first screen, render nothing
          if (isFirstScreen) {
            return null;
          }

          // Otherwise, render the back button
          // This button's onClick will now *always* work,
          // because it only exists on screens that can go back.
          return (
            <GoBackButton
              onClick={() => router.back()} // We only need a simple router.back()
              style={{
                marginLeft: 10,
                marginTop: Platform.OS === "android" ? 10 : 0,
              }}
            />
          );
        },
      }}
    >
      {/*
          This setup will now work perfectly:
          - On 'index' (email), NO back button will appear.
          - On 'password', a back button will appear and go to 'index'.
          - On 'name', a back button will appear and go to 'password'.
        */}
    </Stack>
  );
}
