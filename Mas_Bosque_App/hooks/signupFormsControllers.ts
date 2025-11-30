import { useState } from "react";
import { router } from "expo-router";
import { useSignup } from "@/app/(auth)/signup/SignUpContext";
import Logger from "@/utils/Logger"; // Import Logger

export function useEmailController() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const { signupData, setSignupData } = useSignup();
  const [error, setError] = useState("");

  const validEmail = !emailRegex.test(signupData.email);

  const handleClick = () => {
    if (!emailRegex.test(signupData.email)) {
      const msg = "Invalid email entered during signup";
      Logger.warn(msg, { email: signupData.email });
      setError("Please enter a valid email address.");
    } else {
      setError("");
      Logger.log("Email validation passed", { email: signupData.email });
      router.push("/signup/password");
    }
  };
  const handleClickLogIn = () => {
    Logger.log("Navigating to login from signup email screen");
    router.push("/login");
  };

  const handleEmailChange = (email: string) => {
    if (error) setError("");
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
      Logger.warn("Blood type validation failed");
      setError("Please enter your blood type.");
    } else {
      setError("");
      Logger.log("Medical info step completed");
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

  const isValid =
    signupData.name.trim().length > 0 && signupData.lastName.trim().length > 0;

  const handleClick = () => {
    if (!isValid) {
      Logger.warn("Name validation failed");
      setError("Please fill in both your name and last name.");
    } else {
      setError("");
      Logger.log("Name step completed", {
        name: signupData.name,
        lastName: signupData.lastName,
      });
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
  const { signupData, setSignupData } = useSignup();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [isPasswordSecure, setIsPasswordSecure] = useState(true);

  const toggleSecureEntry = () => {
    setIsPasswordSecure((previousState) => !previousState);
  };

  const isPasswordValid = signupData.password.length >= 6;

  const handleClick = () => {
    if (!isPasswordValid) {
      Logger.warn("Password validation failed (too short)");
      setError("Password must be at least 6 characters long.");
    } else {
      setError("");
      Logger.log("Password set successfully, proceeding to Name step");
      router.push("/signup/name");
    }
  };

  const handlePasswordChange = (password: string) => {
    if (error) {
      setError("");
    }

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
