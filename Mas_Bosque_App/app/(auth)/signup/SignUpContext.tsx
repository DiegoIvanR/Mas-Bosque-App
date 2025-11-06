import React, { createContext, useState, useContext } from "react";

// 1. Define the data structure for your whole signup flow
export type SignupData = {
  email: string;
  password: string;
  name: string; // Added this for the /signup/name screen
};

// 2. Define the context type
type SignupContextType = {
  signupData: SignupData;
  setSignupData: React.Dispatch<React.SetStateAction<SignupData>>;
};

// 3. Create the context with a default value
export const SignupContext = createContext<SignupContextType | undefined>(
  undefined
);

// 4. Create a custom hook for easy access
export function useSignup() {
  const context = useContext(SignupContext);
  if (!context) {
    throw new Error("useSignup must be used within a SignupProvider");
  }
  return context;
}
