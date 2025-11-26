import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ViewStyle,
  TextStyle,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import EditListItem from "@/components/ProfileViews/EditListItem";

// --- Main Component ---
export default function EditProfile() {
  const { user: u, contact: c } = useLocalSearchParams<{
    user: string;
    contact: string;
  }>();
  const user = u ? JSON.parse(u) : null;
  const contact = c ? JSON.parse(c) : null;

  const handleGoBack = () => router.back();
  // const handleEditEmail = () => console.log('Edit Email');
  const handleEditName = () => router.push("/(profile)/editName");
  const handleChangePassword = () => router.push("/(profile)/editPassword");
  const handleEditConditions = () =>
    router.push("/(profile)/editMedicalConditions");
  const handleEditContact = () =>
    router.push("/(profile)/editEmergencyContact");

  if (!user)
    return (
      <Text style={{ color: "#00160A", marginTop: 100 }}>
        No user data found
      </Text>
    );

  return (
    <View style={styles.container}>
      <Pressable style={styles.backButton} onPress={handleGoBack}>
        <Ionicons name="chevron-back" size={24} color="white" />
      </Pressable>

      <Text style={styles.header}>Edit profile</Text>

      <View style={styles.infoCard}>
        {/*<EditListItem label="Email" value={user.email} onPress={handleEditEmail}/>*/}
        <EditListItem
          label="Name"
          value={user?.first_name + " " + user?.last_name}
          onPress={handleEditName}
        />
        <EditListItem
          label="Password"
          value="Change password"
          onPress={handleChangePassword}
        />
        <EditListItem
          label="Medical conditions"
          value="Edit my conditions"
          onPress={handleEditConditions}
        />
        <EditListItem
          label="Emergency contact"
          value={contact?.name + " " + contact?.last_name}
          onPress={handleEditContact}
          isLast
        />
      </View>
    </View>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00160A",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 100,
  } as ViewStyle,
  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
    padding: 10,
    zIndex: 20,
  } as ViewStyle,
  header: {
    fontSize: 18,
    fontFamily: "Lato-Bold",
    fontWeight: "700",
    color: "white",
    marginBottom: 30,
  } as TextStyle,
  infoCard: {
    width: "100%",
    backgroundColor: "#1B251F",
    borderRadius: 20,
    paddingHorizontal: 15,
  } as ViewStyle,
});
