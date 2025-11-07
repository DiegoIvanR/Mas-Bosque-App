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
        // --- THIS IS THE FIX ---
        // 1. Turn the header off completely.
        headerShown: false,
        // 2. Set the animation
        animation: "simple_push",
      }}
    >
      {/*
          Now, we will add the GoBackButton manually to each
          screen *except* the first one (index.tsx).
        */}
    </Stack>
  );
}
