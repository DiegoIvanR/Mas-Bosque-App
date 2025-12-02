import { router, useFocusEffect } from "expo-router";
import { useState, useEffect, useCallback } from "react";
import {
  ContactDataType,
  editProfileModel,
  UserDataType,
} from "@/models/editProfileModel";
import { Alert } from "react-native";

export function useEditProfile() {
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
  return {
    loading,
    error,
    profile,
    contact,
    handleGoBack,
    handleEditName,
    handleChangePassword,
    handleEditConditions,
    handleEditContact,
  };
}

export function useEditEmergencyContact() {
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [relationship, setRelationship] = useState("");
  const [id, setId] = useState("");
  const [user_id, setUserId] = useState("");
  const [error, setError] = useState("");

  const fetchContact = async () => {
    try {
      setError("");
      const { profile, contact } = await editProfileModel.fetchProfile();

      setName(contact.name || "");
      setLastName(contact.last_name || "");
      setPhone(contact.phone || "");
      setRelationship(contact.relationship || "");
      setLoading(false);
      setId(contact.id || "");
      setUserId(contact.user_id || "");
    } catch (error: any) {
      console.log(error);
      setError(error.message);
    }
  };
  useEffect(() => {
    fetchContact();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    if (id == "") {
      console.error("Contact ID is missing.");
      setError("Contact ID is missing.");
      return;
    }

    // Prepare the updated contact object with form data
    const updatedContact = {
      id: id,
      user_id: user_id,
      name,
      last_name: lastName,
      phone,
      relationship,
    };

    try {
      setError("");
      await editProfileModel.handleUpdateContact(updatedContact);
    } catch (error: any) {
      console.error("Error updating contact:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
      router.back();
    }
  };

  const handleBack = () => {
    router.back();
  };
  return {
    loading,
    error,
    name,
    lastName,
    phone,
    relationship,
    setName,
    setLastName,
    setPhone,
    setRelationship,
    handleBack,
    handleSave,
  };
}

export function useEditMedicalConditions() {
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
  return {
    loading,
    error,
    handleGoBack,
    handleSave,
    bloodType,
    allergies,
    medications,
    medicalConditions,
    setBloodType,
    setAllergies,
    setMedications,
    setMedicalConditions,
  };
}

export function useEditName() {
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
  return {
    loading,
    error,
    handleGoBack,
    handleSave,
    firstName,
    lastName,
    profile,
    setFirstName,
    setLastName,
  };
}

export function useEditPassword() {
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
  return {
    loading,
    error,
    handleGoBack,
    handleSave,
    currentPassword,
    newPassword,
    confirmPassword,
    setCurrentPassword,
    setNewPassword,
    setConfirmPassword,
  };
}
