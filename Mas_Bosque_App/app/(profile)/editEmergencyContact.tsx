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

export default function EditEmergencyContact() {
  const [loading, setLoading] = useState(true);

  const [contactId, setContactId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [relationship, setRelationship] = useState("");

  useEffect(() => {
    const fetchContact = async () => {
      setLoading(true);

      const currentUser = (await supabase.auth.getUser()).data.user;
      if (!currentUser) {
        console.log("No logged in user");
        setLoading(false);
        return;
      }

      // Fetch the user's emergency contact (assuming 1 per user)
      const { data, error } = await supabase
        .from("emergency_contacts")
        .select("*")
        .eq("user_id", currentUser.id)
        .maybeSingle(); // gracefully handles empty

      if (error) {
        console.log("Error fetching emergency contact:", error.message);
      }

      if (data) {
        setContactId(data.id);
        setName(data.name || "");
        setLastName(data.last_name || "");
        setPhone(data.phone || "");
        setRelationship(data.relationship || "");
      }

      setLoading(false);
    };

    fetchContact();
  }, []);

  const handleSave = async () => {
    const currentUser = (await supabase.auth.getUser()).data.user;
    if (!currentUser) return;

    // If contact exists → update it
    if (contactId) {
      const { error } = await supabase
        .from("emergency_contacts")
        .update({
          name,
          last_name: lastName,
          phone,
          relationship,
        })
        .eq("id", contactId);

      if (error) console.log("Error updating:", error.message);
      else router.back();
    } else {
      // If contact does NOT exist → create it
      const { error } = await supabase.from("emergency_contacts").insert({
        user_id: currentUser.id,
        name,
        last_name: lastName,
        phone,
        relationship,
      });

      if (error) console.log("Error inserting:", error.message);
      else router.back();
    }
  };

  if (loading)
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#00160B",
          padding: 20,
        }}
      >
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );

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
