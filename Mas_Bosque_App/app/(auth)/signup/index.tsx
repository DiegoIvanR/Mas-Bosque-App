import React, { useState } from "react"; // Import useState
import { router } from "expo-router";
import { useSignup } from "./SignUpContext"; // Fixed typo: was SignUpContext
import SignUpView from "@/components/SignUpViews/SignUpView";
// A simple regex for email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignupEmail() {
  // 1. Get the global state and setter from the context
  const { signupData, setSignupData } = useSignup();
  // 2. Add state for the error message
  const [error, setError] = useState("");

  const validEmail = !emailRegex.test(signupData.email);

  const handleClick = () => {
    // 3. Validate the email
    if (!emailRegex.test(signupData.email)) {
      setError("Please enter a valid email address.");
    } else {
      setError(""); // Clear error
      router.push("/signup/password");
    }
  };
  const handleClickLogIn = () => {
    router.push("/login"); // Fixed path
  };

  const handleEmailChange = (email: string) => {
    // Clear error as user types
    if (error) {
      setError("");
    }
    setSignupData((prev) => ({ ...prev, email }));
  };

  // 2. Note: No more <SignupContext.Provider> wrapper!
  return (
    <SignUpView
      signupData={signupData}
      error={error}
      validEmail={validEmail}
      handleEmailChange={handleEmailChange}
      handleClick={handleClick}
      handleClickLogIn={handleClickLogIn}
    />
  );
}
