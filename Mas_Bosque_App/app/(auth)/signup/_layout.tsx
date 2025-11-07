import React, { useState } from "react";
import { Stack, router, useSegments } from "expo-router"; // 1. Import useSegments
import { SignupContext, SignupData } from "./SignUpContext";
import GoBackButton from "@/components/GoBackButton";
import { Platform } from "react-native";

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

  // 2. Get the current URL segments
  const segments = useSegments();
  // 3. Check if we are on the first screen (e.g., /signup)
  // The segments array will be ['(signup)'] for the index route.
  // For /signup/password, it will be ['(signup)', 'password'].
  const isFirstScreen = segments.length === 1;

  // 4. Define the smart click handler
  const handleBackPress = () => {
    if (isFirstScreen) {
      // If it's the first screen, go back to the login page
      router.replace("/login");
    } else {
      // Otherwise, just go back one step in the signup flow
      router.back();
    }
  };

  return (
    // Pass the state and setter function to all child screens
    <SignupContext.Provider value={{ signupData, setSignupData }}>
      <Stack
        screenOptions={{
          // 3. Show the header so we can add the button
          headerShown: true,

          // 4. Make the header invisible
          headerTransparent: true,
          headerTitle: "",

          // 5. Add your GoBackButton component
          headerLeft: () => (
            <GoBackButton
              onClick={handleBackPress} // 5. Use the new smart handler
              style={{
                marginLeft: 10,
                // Add a small top margin for Android status bar
                marginTop: Platform.OS === "android" ? 10 : 0,
              }}
            />
          ),

          // 6. Set the animation (from your example)
          animation: "simple_push",
        }}
      >
        {/*
          This setup will now work perfectly:
          - On 'index' (email), it will go back to '/login'.
          - On 'password', it will go back to 'index'.
          - On 'name', it will go back to 'password'.
        */}
      </Stack>
    </SignupContext.Provider>
  );
}
