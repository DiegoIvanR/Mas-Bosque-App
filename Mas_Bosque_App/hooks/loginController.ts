import { router } from "expo-router";
import { useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { checkSessionSupabase, logInSupabase } from "@/models/LogInModel";
import { initDatabase, saveUserDataLocally } from "@/lib/database";
import Logger from "@/utils/Logger"; // Import Logger

export default function useLoginController() {
  const { setIsLoggedIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [checkingSession, setCheckingSession] = useState(true);
  const [isPasswordSecure, setIsPasswordSecure] = useState(true);

  const toggleSecureEntry = () => {
    setIsPasswordSecure((previousState) => !previousState);
  };

  useEffect(() => {
    const checkSession = async () => {
      Logger.log("Checking for existing session...");
      try {
        const data = await checkSessionSupabase();
        if (data.session) {
          Logger.log("Session found, redirecting to home");
          setIsLoggedIn(true);
          router.replace("/");
        } else {
          Logger.log("No session found");
          setCheckingSession(false);
        }
      } catch (e) {
        Logger.error("Error checking session", e);
        setCheckingSession(false);
      }
    };
    checkSession();
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    Logger.log("Attempting login", { email }); // Don't log passwords

    try {
      const { data, profileData, emcontact } = await logInSupabase(
        email,
        password
      );

      Logger.log("Supabase login successful, syncing local DB");
      await initDatabase();
      await saveUserDataLocally(profileData, emcontact);

      setIsLoggedIn(true);
      router.replace("/");
      return;
    } catch (e: any) {
      Logger.error("Login failed", e, { email });
      const errorMessage = e instanceof Error ? e.message : String(e);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = () => {
    Logger.log("Navigating to Sign Up");
    router.replace("/(auth)/signup");
  };

  return {
    checkingSession,
    error,
    isPasswordSecure,
    loading,
    email,
    password,
    setEmail,
    setPassword,
    handleLogin,
    handleSignUp,
    toggleSecureEntry,
  };
}
