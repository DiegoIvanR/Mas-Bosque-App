import { useState } from "react"; // Import useState
import { router } from "expo-router";
import { useSignup } from "./SignUpContext"; // Fixed typo: was SignUpContext
import PasswordView from "@/components/SignUpViews/PasswordView";

export default function SignupPassword() {
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
