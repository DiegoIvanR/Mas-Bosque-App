import React, { useState } from "react";
import { Alert } from "react-native";
import { router } from "expo-router";
import { editProfileModel } from "@/models/editProfileModel";
import EditPasswordView from "@/components/ProfileViews/EditPasswordView";
import LoadingScreen from "@/components/LoadingScreen";
import ErrorScreen from "@/components/ErrorScreen";

export default function EditPassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoBack = () => router.back();

  const handleSave = async () => {
    setError("");
    if (!currentPassword) {
      Alert.alert("Error", "Please enter your current password.");
      setError("Error: Please enter your current password.");
      return;
    }

    if (newPassword.length <= 6) {
      Alert.alert("Error", "New password must be at least 6 characters long.");
      setError("Error: New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match.");
      setError("Error: New passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      setError("");
      await editProfileModel.changePassword(currentPassword, newPassword);
      Alert.alert("Success", "Password updated successfully.");
      router.back();
    } catch (error: any) {
      Alert.alert("Error", error.message || "Something went wrong.");
      console.log("Error editing password:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  if (loading) return <LoadingScreen />;
  else if (error != "") return <ErrorScreen error={error} />;
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
