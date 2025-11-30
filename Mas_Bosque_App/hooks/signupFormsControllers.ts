import React, { useState } from "react"; // Import useState
import { router } from "expo-router";
import { useSignup } from "@/app/(auth)/signup/SignUpContext";

export function useEmailController() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const { signupData, setSignupData } = useSignup();
  const [error, setError] = useState("");

  const validEmail = !emailRegex.test(signupData.email);

  const handleClick = () => {
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

  return {
    signupData,
    error,
    validEmail,
    handleEmailChange,
    handleClick,
    handleClickLogIn,
  };
}

export function useMedicalController() {
  const { signupData, setSignupData } = useSignup();
  const [error, setError] = useState("");

  // 1. Validation for blood type
  const isValid = signupData.bloodType.trim().length > 0;

  const handleClick = () => {
    if (!isValid) {
      setError("Please enter your blood type.");
    } else {
      setError("");
      router.push("/signup/emcontact");
    }
  };
  const handleBloodTypeChange = (bloodType: string) => {
    if (error) setError("");
    setSignupData((prev) => ({ ...prev, bloodType }));
  };
  const handleAllergiesChange = (allergies: string) => {
    setSignupData((prev) => ({ ...prev, allergies }));
  };
  const handleMedicalConditionsChange = (medicalConditions: string) => {
    setSignupData((prev) => ({ ...prev, medicalConditions }));
  };
  const handleMedicationsChange = (medications: string) => {
    setSignupData((prev) => ({ ...prev, medications }));
  };

  return {
    signupData,
    error,
    isValid,
    handleBloodTypeChange,
    handleAllergiesChange,
    handleMedicalConditionsChange,
    handleMedicationsChange,
    handleClick,
  };
}
export function useNameController() {
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
  return {
    signupData,
    error,
    isValid,
    handleNameChange,
    handleLastNameChange,
    handleClick,
  };
}

export function usePasswordController() {
  // 1. Get the global state and setter
  const { signupData, setSignupData } = useSignup();
  // 2. Add state for error and loading
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // --- 1. ADD THIS STATE ---
  // This state will track if the password text is hidden or not
  const [isPasswordSecure, setIsPasswordSecure] = useState(true);

  // --- 2. ADD THIS FUNCTION ---
  // This is the callback function we will pass to the InputBar
  const toggleSecureEntry = () => {
    setIsPasswordSecure((previousState) => !previousState);
  };

  // 3. Create validation constant
  const isPasswordValid = signupData.password.length >= 6;

  const handleClick = () => {
    // 4. Validate the password (e.g., minimum 6 characters)
    if (!isPasswordValid) {
      setError("Password must be at least 6 characters long.");
    } else {
      setError("");
      // 6. Success! User is created. Navigate to the next step.
      // (This runs even if email confirmation is required)
      router.push("/signup/name");
    }
  };

  const handlePasswordChange = (password: string) => {
    // Clear error as user types
    if (error) {
      setError("");
    }
    // We don't trim passwords
    setSignupData((prev) => ({ ...prev, password }));
  };

  return {
    signupData,
    error,
    loading,
    isPasswordSecure,
    isPasswordValid,
    toggleSecureEntry,
    handlePasswordChange,
    handleClick,
  };
}
