import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import InputBar from "@/components/InputBar";
import Button from "@/components/Button";
import { router } from "expo-router";
import { useSignup } from "./SignUpContext";
import GoBackButton from "@/components/GoBackButton"; // 1. Import
import NameView from "@/components/SignUpViews/NameView";
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
