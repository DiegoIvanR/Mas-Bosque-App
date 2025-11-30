import React, { useState, useEffect } from "react";
import { router } from "expo-router";
import { editProfileModel } from "@/models/editProfileModel";
import LoadingScreen from "@/views/LoadingScreen";
import ErrorScreen from "@/views/ErrorScreen";
import { UserDataType } from "@/models/profileModel";
import EditMedicalConditionsView from "@/views/ProfileViews/EditMedicalConditionsView";

export default function EditMedicalConditions() {
  const [bloodType, setBloodType] = useState("");
  const [allergies, setAllergies] = useState("");
  const [medications, setMedications] = useState("");
  const [medicalConditions, setMedicalConditions] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState<UserDataType | null>(null);

  const handleGoBack = () => router.back();

  // Fetch current user medical info

  const fetchProfile = async () => {
    try {
      setError("");
      const { profile, contact } = await editProfileModel.fetchProfile();

      setBloodType(profile.blood_type || "");
      setAllergies(profile.allergies || "");
      setMedications(profile.medications || "");
      setMedicalConditions(profile.medical_conditions || "");
      setProfile(profile);
    } catch (error: any) {
      console.log(error);
      setError(error.message);
    }
  };
  useEffect(() => {
    fetchProfile();
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
      blood_type: bloodType,
      allergies: allergies,
      medical_conditions: medicalConditions,
      medications: medications,
    };

    try {
      setError("");
      await editProfileModel.handleUpdateMedical(updatedProfile);
    } catch (error: any) {
      console.error("Error updating medical conditions:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
      router.back();
    }
  };

  if (loading) return <LoadingScreen />;
  else if (error != "") return <ErrorScreen error={error} />;
  return (
    <EditMedicalConditionsView
      handleGoBack={handleGoBack}
      handleSave={handleSave}
      bloodType={bloodType}
      allergies={allergies}
      medications={medications}
      medicalConditions={medicalConditions}
      loading={loading}
      setBloodType={setBloodType}
      setAllergies={setAllergies}
      setMedications={setMedications}
      setMedicalConditions={setMedicalConditions}
    />
  );
}
