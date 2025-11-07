import React, { useState } from "react";
import { Stack } from "expo-router";
// This is the common parent. It provides the state.
export default function LoginLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        // --- ADD THIS LINE ---
        animation: "simple_push", // or 'none' for instant
      }}
    />
  );
}
