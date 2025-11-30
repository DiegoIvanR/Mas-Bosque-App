import { router } from "expo-router";
import { useAuth } from "@/lib/auth";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/SupabaseClient";
import LoginView from "@/views/LogInView";
import LoadingScreen from "@/views/LoadingScreen";
import { checkSessionSupabase, logInSupabase } from "@/models/LogInModel";
import { initDatabase, saveUserDataLocally } from "@/lib/database";
import useLoginController from "@/hooks/loginController";
export default function LoginScreen() {
  const {
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
  } = useLoginController();

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
