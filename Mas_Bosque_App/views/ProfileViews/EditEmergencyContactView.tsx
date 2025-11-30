import { View, Pressable, Text, StyleSheet, TextInput } from "react-native";
import { Dispatch, SetStateAction } from "react";
import ProfileBackButton from "@/components/Helpers/ProfileBackButton";
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
      <ProfileBackButton onPress={backButton} />

      <Text style={styles.header}>Edit your emergency contact</Text>

      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="First name"
        placeholderTextColor="#999"
      />

      <Text style={styles.label}>Last name</Text>
      <TextInput
        style={styles.input}
        value={lastName}
        onChangeText={setLastName}
        placeholder="Last name"
        placeholderTextColor="#999"
      />

      <Text style={styles.label}>Phone number</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        placeholder="Phone"
        placeholderTextColor="#999"
      />

      <Text style={styles.label}>Relationship</Text>
      <TextInput
        style={styles.input}
        value={relationship}
        onChangeText={setRelationship}
        placeholder="Brother, Mother, Friend..."
        placeholderTextColor="#999"
      />

      <Pressable style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00160A",
    paddingHorizontal: 24,
    paddingTop: 80,
  },

  header: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 32,
    textAlign: "center",
  },

  label: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
    marginTop: 16,
    marginBottom: 8,
  },

  input: {
    height: 50,
    borderColor: "white",
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 16,
    color: "white",
  },

  saveButton: {
    height: 50,
    borderRadius: 100,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },

  saveButtonText: {
    color: "#00160A",
    fontSize: 16,
    fontWeight: "600",
  },
});
