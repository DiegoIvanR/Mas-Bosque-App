import React, { useState } from "react";
import { Stack } from "expo-router";

import { SignupContext, SignupData } from "./SignUpContext";
// This is the common parent. It provides the state.
export default function SignupLayout() {
  // The state for the *entire* signup flow lives here
  const [signupData, setSignupData] = useState<SignupData>({
    email: "",
    password: "",
    name: "",
  });

  return (
    // Pass the state and setter function to all child screens
    <SignupContext.Provider value={{ signupData, setSignupData }}>
      {/* This Stack component renders the child screens (email, password, name).
        I've hidden the header for a clean signup flow.
      */}
      <Stack screenOptions={{ headerShown: false }} />
    </SignupContext.Provider>
  );
}
