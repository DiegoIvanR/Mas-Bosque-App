import React, { useState, useEffect } from "react";
import { router } from "expo-router";
import { useAuth } from "@/lib/auth";
import { clearLocalData } from "@/lib/database";
import { profileModel } from "@/models/profileModel";
import ProfileView from "@/components/ProfileViews/ProfileView";
import LoadingScreen from "@/components/LoadingScreen";
import { ContactDataType, UserDataType } from "@/models/editProfileModel";
import { editProfileModel } from "@/models/editProfileModel";
import ErrorScreen from "@/components/ErrorScreen";
export default function Profile() {
  const { setIsLoggedIn } = useAuth();
  const [user, setUser] = useState<UserDataType | null>(null);
  const [loading, setLoading] = useState(true);
  const [contact, setContact] = useState<ContactDataType | null>(null);
  const [error, setError] = useState("");

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
    router.push({
      pathname: "/(profile)/edit",
      params: { user: JSON.stringify(user), contact: JSON.stringify(contact) },
    });
  };

  const fetchUser = async () => {
    setLoading(true);
    try {
      setError("");
      const { profile, contact } = await editProfileModel.fetchProfile();
      setUser(profile);
      setContact(contact);
    } catch (e: any) {
      console.log(e.message);
      setError(e.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);
  if (loading) return <LoadingScreen />;
  else if (error) return <ErrorScreen error={error} />;
  return (
    <ProfileView
      user={user}
      loading={loading}
      handleLogOut={handleLogout}
      handleEditProfile={handleEditProfile}
    />
  );
}
