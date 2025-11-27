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

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={24} color="white" />
      </Pressable>

      <Text style={styles.header}>Edit your emergency contact</Text>

      {/* Name */}
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="First name"
        placeholderTextColor="#999"
      />

      {/* Last Name */}
      <Text style={styles.label}>Last name</Text>
      <TextInput
        style={styles.input}
        value={lastName}
        onChangeText={setLastName}
        placeholder="Last name"
        placeholderTextColor="#999"
      />

      {/* Phone Number */}
      <Text style={styles.label}>Phone number</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        placeholder="Phone"
        placeholderTextColor="#999"
      />

      {/* Relationship */}
      <Text style={styles.label}>How are they related to you?</Text>
      <TextInput
        style={styles.input}
        value={relationship}
        onChangeText={setRelationship}
        placeholder="Brother, Mother, Friend..."
        placeholderTextColor="#999"
      />

      {/* Save Button */}
      <Pressable style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    flex: 1,
    backgroundColor: "#00160A",
    padding: 24,
  } as ViewStyle,

  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
    padding: 10,
    zIndex: 20,
  } as ViewStyle,

  header: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 32,
    textAlign: "center",
  } as TextStyle,

  label: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
    marginTop: 16,
  } as TextStyle,

  input: {
    height: 50,
    borderColor: "white",
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 16,
    color: "white",
    fontSize: 14,
  } as TextStyle,

  saveButton: {
    height: 50,
    borderRadius: 100,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  } as ViewStyle,

  saveButtonText: {
    color: "#00160A",
    fontSize: 14,
    fontWeight: "500",
  } as TextStyle,
});
