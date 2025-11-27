import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from "react-native";
import { supabase } from "@/lib/SupabaseClient";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import LoadingScreen from "@/components/LoadingScreen";
import { editProfileModel } from "@/models/editProfileModel";
import EditEmergencyContactView from "@/components/ProfileViews/EditEmergencyContactView";
export default function EditEmergencyContact() {
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [relationship, setRelationship] = useState("");
  const [id, setId] = useState("");
  const [user_id, setUserId] = useState("");

  const fetchContact = async () => {
    try {
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
    }
  };
  useEffect(() => {
    fetchContact();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    if (id == "") {
      console.error("Contact ID is missing.");
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
      await editProfileModel.handleSave(updatedContact);
    } catch (error: any) {
      console.error("Error updating contact:", error.message);
    } finally {
      setLoading(false);
      router.back();
    }
  };
  if (loading) return <LoadingScreen />;

  const handleBack = () => {
    router.back();
  };
  return (
    <EditEmergencyContactView
      name={name}
      lastName={lastName}
      phone={phone}
      relationship={relationship}
      setName={setName}
      setLastName={setLastName}
      setPhone={setPhone}
      setRelationship={setRelationship}
      backButton={handleBack}
      handleSave={handleSave}
    />
  );
}
