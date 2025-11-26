import React, { useState, useEffect } from "react";
import { router } from "expo-router";
import { useAuth } from "@/lib/auth";
import { clearLocalData } from "@/lib/database";
import { profileModel, UserDataType } from "@/models/profileModel";
import ProfileView from "@/components/ProfileViews/ProfileView";
import LoadingScreen from "@/components/LoadingScreen";

export default function Profile() {
  const { setIsLoggedIn } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await clearLocalData();
      const error = await profileModel.signOutSupabase();
      if (error) console.error("Supabase logout error:", error.message);
    } catch (err: any) {
      console.error("DB error:", err.message);
    } finally {
      setIsLoggedIn(false);
      router.replace("/(auth)/login");
    }
  };

  const handleEditProfile = () => {
    router.push("/(profile)/edit");
  };

  const [user, setUser] = useState<UserDataType | null>(null);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const data = await profileModel.fetchUserSupabase();
      setUser(data);
    } catch (e: any) {
      console.log("Error fetching user:", e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);
  if (loading) {
    return <LoadingScreen />;
  }
  return (
    <ProfileView
      user={user}
      loading={loading}
      handleLogOut={handleLogout}
      handleEditProfile={handleEditProfile}
    />
  );
}
