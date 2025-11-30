import { useState } from "react"; // Import useState
import { router } from "expo-router";
import { useSignup } from "./SignUpContext"; // Fixed typo: was SignUpContext
import PasswordView from "@/views/SignUpViews/PasswordView";
import { usePasswordController } from "@/hooks/signupFormsControllers";

export default function SignupPassword() {
  const {
    signupData,
    error,
    loading,
    isPasswordSecure,
    isPasswordValid,
    toggleSecureEntry,
    handlePasswordChange,
    handleClick,
  } = usePasswordController();
  return (
    <PasswordView
      signupData={signupData}
      error={error}
      isPasswordSecure={isPasswordSecure}
      loading={loading}
      isPasswordValid={isPasswordValid}
      handlePasswordChange={handlePasswordChange}
      toggleSecureEntry={toggleSecureEntry}
      handleClick={handleClick}
    />
  );
}
