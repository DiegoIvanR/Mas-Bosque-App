import { router } from "expo-router";
import { useAuth } from "@/lib/auth";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/SupabaseClient";
import LoginView from "@/components/LogInViews/LogInView";
import LoadingScreen from "@/components/LoadingScreen";
import { checkSessionSupabase, logInSupabase } from "@/models/LogInModel";

export default function LoginScreen() {
  const { setIsLoggedIn } = useAuth();

  // State for the login form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // For form submission

  // State for the initial session check
  const [checkingSession, setCheckingSession] = useState(true);
  const [isPasswordSecure, setIsPasswordSecure] = useState(true);

  // --- 2. ADD THIS FUNCTION ---
  // This is the callback function we will pass to the InputBar
  const toggleSecureEntry = () => {
    setIsPasswordSecure((previousState) => !previousState);
  };

  // 2. Add a useEffect to check for an existing session on load
  useEffect(() => {
    const checkSession = async () => {
      const data = await checkSessionSupabase();
      if (data.session) {
        // 3. User is already logged in!
        setIsLoggedIn(true);
        router.replace("/"); // Go to tab navigator
      } else {
        // 4. No session, show the login buttons
        setCheckingSession(false);
      }
    };
    checkSession();
  }, []); // The empty array [] means this runs once when the component mounts

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    let data: any | null = null;
    try {
      data = await logInSupabase(email, password);
    } catch (e: any) {
      setError(e);
    }
    if (data.session) {
      setIsLoggedIn(true);
      router.replace("/"); // Go to tab navigator
    } else {
      setError("An unexpected error occurred. Please try again.");
    }
    setLoading(false);
  };

  const handleSignUp = () => {
    router.replace("/(auth)/signup");
  };
  // 5. Show a loading spinner while checking for a session
  if (checkingSession) {
    return <LoadingScreen />;
  }
  return (
    <LoginView
      error={error}
      isPasswordSecure={isPasswordSecure}
      loading={loading}
      email={email}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      handleLogin={handleLogin}
      handleSignUp={handleSignUp}
      toggleSecureEntry={toggleSecureEntry}
    />
  );
}
