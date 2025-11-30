import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import { editProfileModel, UserDataType } from "@/models/editProfileModel";
import LoadingScreen from "@/views/LoadingScreen";
import ErrorScreen from "@/views/ErrorScreen";
import EditNameView from "@/views/ProfileViews/EditNameView";

export default function EditName() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState<UserDataType | null>(null);

  useEffect(() => {
    const fetchName = async () => {
      try {
        setLoading(true);
        setError("");
        const { profile, contact } = await editProfileModel.fetchProfile();

        setFirstName(profile.first_name || "");
        setLastName(profile.last_name || "");
        setProfile(profile);
      } catch (error: any) {
        console.log(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchName();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    if (!profile) {
      console.error("Contact ID is missing.");
      setError("Contact ID is missing.");
      return;
    }

    // Prepare the updated contact object with form data
    const updatedProfile = {
      ...profile,
      id: profile.id, // Ensure the id is included
      first_name: firstName,
      last_name: lastName,
    };

    try {
      setError("");
      await editProfileModel.handleUpdateName(updatedProfile);
    } catch (error: any) {
      console.error("Error updating name:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
      router.back();
    }
  };

  const handleGoBack = () => router.back();

  if (loading) return <LoadingScreen />;
  else if (error != "") return <ErrorScreen error={error} />;
  return (
    <EditNameView
      handleGoBack={handleGoBack}
      handleSave={handleSave}
      firstName={firstName}
      lastName={lastName}
      profile={profile}
      setFirstName={setFirstName}
      setLastName={setLastName}
    />
  );
}
