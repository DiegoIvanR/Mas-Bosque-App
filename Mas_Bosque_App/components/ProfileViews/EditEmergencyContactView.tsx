import {
  View,
  Pressable,
  Text,
  StyleSheet,
  TextInput,
  TextStyle,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Dispatch, SetStateAction } from "react";
type EditEmergencyContactViewProps = {
  name: string;
  lastName: string;
  phone: string;
  relationship: string;
  setName: Dispatch<SetStateAction<string>>;
  setLastName: Dispatch<SetStateAction<string>>;
  setPhone: Dispatch<SetStateAction<string>>;
  setRelationship: Dispatch<SetStateAction<string>>;
  backButton: () => void;
  handleSave: () => void;
};
export default function EditEmergencyContactView({
  name,
  lastName,
  phone,
  relationship,
  setName,
  setLastName,
  setPhone,
  setRelationship,
  backButton,
  handleSave,
}: EditEmergencyContactViewProps) {
  return (
    <View style={styles.container}>
      {/* Back Button */}
      <Pressable style={styles.backButton} onPress={backButton}>
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
