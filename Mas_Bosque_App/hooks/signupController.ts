import { useState } from "react";
import { router } from "expo-router";
import { useSignup } from "@/app/(auth)/signup/SignUpContext";
import { initDatabase } from "@/lib/database";
import { useAuth } from "@/lib/auth";
import { signUpUser, userData } from "@/models/signUpModel";
import Logger from "@/utils/Logger";

export default function useSignupController() {
  const { signupData, setSignupData } = useSignup();
  const { setIsLoggedIn } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isValid =
    signupData.contactName.trim().length > 0 &&
    signupData.contactPhone.trim().length > 0;

  const handleClick = async () => {
    if (!isValid) {
      Logger.warn("Signup failed: Invalid contact info");
      setError("Please fill in at least the contact's name and phone number.");
      return;
    }

    setLoading(true);
    setError("");
    let userData: userData | null = null;

    Logger.log("Starting user registration");

    try {
      userData = await signUpUser(signupData);
    } catch (e: any) {
      Logger.error("SignUp API failed", e);
      setError(e);
    } finally {
      setLoading(false);
    }

    if (userData) {
      try {
        Logger.log("Initializing local DB after signup");
        await initDatabase();
        // await saveUserDataLocally(userData.profile, userData.contact);
      } catch (dbError: any) {
        // Log locally, don't stop flow
        Logger.error("Failed to save data locally during signup", dbError);
      }

      Logger.log("Signup successful, redirecting to login");
      setIsLoggedIn(false);
      router.replace("/(auth)/login");
    } else {
      Logger.error("Signup failed: No user data returned");
      setError(
        "An unexpected error occurred (contact not saved). Please try again."
      );
    }

    setLoading(false);
  };

  const handleNameChange = (contactName: string) => {
    if (error) setError("");
    setSignupData((prev) => ({ ...prev, contactName }));
  };
  const handleLastName = (contactLastName: string) => {
    if (error) setError("");
    setSignupData((prev) => ({ ...prev, contactLastName }));
  };
  const handlePhone = (contactPhone: string) => {
    if (error) setError("");
    setSignupData((prev) => ({ ...prev, contactPhone }));
  };
  const handleRelationship = (contactRelationship: string) => {
    if (error) setError("");
    setSignupData((prev) => ({ ...prev, contactRelationship }));
  };

  return {
    loading,
    error,
    signupData,
    isValid,
    handleClick,
    handleNameChange,
    handleLastName,
    handlePhone,
    handleRelationship,
  };
}
