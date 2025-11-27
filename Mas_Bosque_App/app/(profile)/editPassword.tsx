import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Alert,
} from "react-native";
import { supabase } from "@/lib/SupabaseClient"; // adjust path
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { editProfileModel } from "@/models/editProfileModel";
import EditPasswordView from "@/components/ProfileViews/EditPasswordView";

export default function EditPassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoBack = () => router.back();

  const handleSave = async () => {
    if (!newPassword || newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      editProfileModel.changePassword(currentPassword, newPassword);
    } catch (error: any) {
      console.log("Error editing password:", error.message);
    } finally {
      router.back();
    }

    setLoading(false);
  };
  return (
    <EditPasswordView
      handleGoBack={handleGoBack}
      handleSave={handleSave}
      currentPassword={currentPassword}
      newPassword={newPassword}
      confirmPassword={confirmPassword}
      loading={loading}
      setCurrentPassword={setCurrentPassword}
      setNewPassword={setNewPassword}
      setConfirmPassword={setConfirmPassword}
    />
  );
}
