import React, { useState } from "react";
import { Stack, router, useSegments } from "expo-router"; // 1. Import useSegments
import { SignupContext, SignupData } from "./SignUpContext";
// This is the common parent. It provides the state.
export default function SignupLayout() {
  // The state for the *entire* signup flow lives here
  const [signupData, setSignupData] = useState<SignupData>({
    email: "",
    password: "",
    name: "",
    lastName: "",

    bloodType: "",
    allergies: "",
    medicalConditions: "",
    medications: "",

    contactName: "",
    contactLastName: "",
    contactPhone: "",
    contactRelationship: "",
  });

  // 4. Define the smart click handler

  return (
    // Pass the state and setter function to all child screens
    <SignupContext.Provider value={{ signupData, setSignupData }}>
      <Stack
        screenOptions={{
          headerShown: false,
          // --- ADD THIS LINE ---
          animation: "simple_push", // or 'none' for instant
        }}
      />
    </SignupContext.Provider>
  );
}
/*

    <Stack
      screenOptions={{
        headerShown: false,
        // --- ADD THIS LINE ---
        animation: "fade", // or 'none' for instant
      }}
    />
*/
