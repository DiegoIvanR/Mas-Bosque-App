import { useState } from "react";
import { router } from "expo-router";
import { useSignup } from "@/app/(auth)/signup/SignUpContext";
// 1. Import your new database functions
import { initDatabase } from "@/lib/database";
import { useAuth } from "@/lib/auth"; // 1. Import useAuth
import { signUpUser, userData } from "@/models/signUpModel";

export default function useSignupController() {
  const { signupData, setSignupData } = useSignup();
  const { setIsLoggedIn } = useAuth(); // 2. Get the setter function
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 1. Validation constant
  const isValid =
    signupData.contactName.trim().length > 0 &&
    signupData.contactPhone.trim().length > 0;

  const handleClick = async () => {
    // 3. Validate contact info (simple check)
    if (!isValid) {
      setError("Please fill in at least the contact's name and phone number.");
      return;
    }

    setLoading(true); // Start loading
    setError(""); // Clear previous errors
    let userData: userData | null = null;

    try {
      userData = await signUpUser(signupData);
    } catch (e: any) {
      setError(e);
    } finally {
      setLoading(false);
    }

    if (userData) {
      // --- 2. SAVE TO SQLITE ON SUCCESS ---
      try {
        await initDatabase(); // Ensure tables exist
        // Save the data returned from Supabase (it's the most reliable)
        //await saveUserDataLocally(userData.profile, userData.contact);
      } catch (dbError: any) {
        console.error("Failed to save data locally:", dbError.message);
        // Don't block the user for a local DB error, just log it.
      }

      // 3. SET THE GLOBAL AUTH STATE
      setIsLoggedIn(false);
      router.replace("/(auth)/login"); // Success!
    } else {
      setError(
        "An unexpected error occurred (contact not saved). Please try again."
      );
    }

    setLoading(false); // Stop loading
  };

  const handleNameChange = (contactName: string) => {
    if (error) {
      setError("");
    }
    setSignupData((prev) => ({ ...prev, contactName }));
  };
  const handleLastName = (contactLastName: string) => {
    if (error) {
      setError("");
    }
    setSignupData((prev) => ({ ...prev, contactLastName }));
  };
  const handlePhone = (contactPhone: string) => {
    if (error) {
      setError("");
    }
    setSignupData((prev) => ({ ...prev, contactPhone }));
  };
  const handleRelationship = (contactRelationship: string) => {
    if (error) {
      setError("");
    }
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
