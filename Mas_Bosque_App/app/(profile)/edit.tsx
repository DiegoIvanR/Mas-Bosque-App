import { router, useFocusEffect } from "expo-router";
import { useState, useCallback } from "react";
import ErrorScreen from "@/components/ErrorScreen";
import EditView from "@/components/ProfileViews/EditView";
import {
  ContactDataType,
  editProfileModel,
  UserDataType,
} from "@/models/editProfileModel";
// --- Main Component ---
export default function EditProfile() {
  const [profile, setProfile] = useState<UserDataType | null>(null);
  const [contact, setContact] = useState<ContactDataType | null>(null);

  const handleGoBack = () => router.back();
  // const handleEditEmail = () => console.log('Edit Email');
  const handleEditName = () => router.push("/(profile)/editName");
  const handleChangePassword = () => router.push("/(profile)/editPassword");
  const handleEditConditions = () =>
    router.push("/(profile)/editMedicalConditions");

  const handleEditContact = () => {
    router.push({
      pathname: "/(profile)/editEmergencyContact",
      params: { contact: JSON.stringify(contact) },
    });
    return;
  };

  const fetchContact = async () => {
    try {
      const { profile, contact } = await editProfileModel.fetchProfile();

      setProfile(profile);
      setContact(contact);
    } catch (error: any) {
      console.log(error);
    }
  };
  useFocusEffect(
    useCallback(() => {
      fetchContact();
    }, [])
  );

  if (!profile) return <ErrorScreen error="No user data found" />;
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
