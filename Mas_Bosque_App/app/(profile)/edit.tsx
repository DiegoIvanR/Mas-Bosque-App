import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "@/lib/SupabaseClient"; // adjust path

// --- Types ---
type EditListItemProps = {
  label: string;
  value: string;
  onPress: () => void;
  isLast?: boolean;
};

type UserDataType = {
  first_name: string;
  last_name: string;
};
type ContactDataType = {
  user_id: string;
  name: string;
  phone: string;
  relationship: string;
  last_name: string;
};

// --- Reusable EditListItem Component ---
const EditListItem: React.FC<EditListItemProps> = ({
  label,
  value,
  onPress,
  isLast = false,
}) => (
  <Pressable style={styles.listItem} onPress={onPress}>
    <View style={styles.listItemContent}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.arrow}>&gt;</Text>
    </View>
    {!isLast && <View style={styles.separator} />}
  </Pressable>
);

// --- Main Component ---
export default function EditProfile() {
  const [user, setUser] = useState<UserDataType | null>(null);
  const [loading, setLoading] = useState(true);
  const [contact, setContact] = useState<ContactDataType | null>(null);

  const fetchUser = async () => {
    setLoading(true);
    const currentUser = supabase.auth.getUser
      ? (await supabase.auth.getUser()).data.user
      : null;

    if (!currentUser) {
      console.log("No logged in user");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("user_profile") // replace with your table name
      .select("first_name, last_name")
      .eq("id", currentUser.id)
      .single();

    if (error) {
      console.log("Error fetching user:", error.message);
    } else {
      setUser(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchContact = async () => {
    setLoading(true);
    const currentUser = supabase.auth.getUser
      ? (await supabase.auth.getUser()).data.user
      : null;

    if (!currentUser) {
      console.log("No logged in user");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("emergency_contacts") // replace with your table name
      .select("user_id, name, phone, relationship, last_name")
      .eq("user_id", currentUser.id)
      .single();

    if (error) {
      console.log("Error fetching user:", error.message);
    } else {
      setContact(data as ContactDataType);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchContact();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchUser();
      fetchContact();
    }, [])
  );

  const handleGoBack = () => router.back();
  // const handleEditEmail = () => console.log('Edit Email');
  const handleEditName = () => router.push("/(profile)/editName");
  const handleChangePassword = () => router.push("/(profile)/editPassword");
  const handleEditConditions = () =>
    router.push("/(profile)/editMedicalConditions");
  const handleEditContact = () =>
    router.push("/(profile)/editEmergencyContact");

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
  listItem: {} as ViewStyle,
  listItemContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
  } as ViewStyle,
  label: {
    color: "white",
    fontSize: 14,
    fontFamily: "Lato-Bold",
    fontWeight: "700",
    flex: 1,
  } as TextStyle,
  value: {
    color: "#999999",
    fontSize: 14,
    fontFamily: "Lato-Bold",
    fontWeight: "700",
    textAlign: "right",
    marginRight: 10,
    maxWidth: "50%",
  } as TextStyle,
  arrow: { color: "#404040", fontSize: 12, fontWeight: "700" } as TextStyle,
  separator: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    width: "100%",
  } as ViewStyle,
});
