import { router, useFocusEffect } from "expo-router";
import { useState, useCallback } from "react";
import ErrorScreen from "@/components/ErrorScreen";
import EditView from "@/components/ProfileViews/EditView";
import {
  ContactDataType,
  editProfileModel,
  UserDataType,
} from "@/models/editProfileModel";
import LoadingScreen from "@/components/LoadingScreen";
// --- Main Component ---
export default function EditProfile() {
  const [profile, setProfile] = useState<UserDataType | null>(null);
  const [contact, setContact] = useState<ContactDataType | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleGoBack = () => router.back();
  // const handleEditEmail = () => console.log('Edit Email');
  const handleEditName = () => router.push("/(profile)/editName");
  const handleChangePassword = () => router.push("/(profile)/editPassword");
  const handleEditConditions = () =>
    router.push("/(profile)/editMedicalConditions");

  const handleEditContact = () => {
    router.push("/(profile)/editEmergencyContact");
    return;
  };

  const fetchContact = async () => {
    try {
      setError("");
      setLoading(true);
      const { profile, contact } = await editProfileModel.fetchProfile();

      setProfile(profile);
      setContact(contact);
      if (!profile) setError("No user data found");
    } catch (error: any) {
      console.log(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  useFocusEffect(
    useCallback(() => {
      fetchContact();
    }, [])
  );

  if (loading) return <LoadingScreen />;
  else if (error != "") return <ErrorScreen error={error} />;
  return (
    <EditView
      user={profile}
      contact={contact}
      handleGoBack={handleGoBack}
      handleEditName={handleEditName}
      handleChangePassword={handleChangePassword}
      handleEditConditions={handleEditConditions}
      handleEditContact={handleEditContact}
    />
  );
}
