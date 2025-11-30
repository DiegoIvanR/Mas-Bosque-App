import React, { useState } from "react";
import { router } from "expo-router";
import { useSignup } from "./SignUpContext";
import NameView from "@/views/SignUpViews/NameView";
export default function SignupName() {
  const { signupData, setSignupData } = useSignup();
  const [error, setError] = useState("");

  // 1. Create validation constant
  const isValid =
    signupData.name.trim().length > 0 && signupData.lastName.trim().length > 0;

  const handleClick = () => {
    if (!isValid) {
      setError("Please fill in both your name and last name.");
    } else {
      setError("");
      router.push("/signup/medical");
    }
  };
  const handleNameChange = (name: string) => {
    if (error) setError("");
    setSignupData((prev) => ({ ...prev, name }));
  };
  const handleLastNameChange = (lastName: string) => {
    if (error) setError("");
    setSignupData((prev) => ({ ...prev, lastName }));
  };
  return (
    <NameView
      signupData={signupData}
      error={error}
      isValid={isValid}
      handleNameChange={handleNameChange}
      handleLastNameChange={handleLastNameChange}
      handleClick={handleClick}
    />
  );
}
