import {
  Text,
  View,
  Pressable,
  TextInput,
  ViewStyle,
  TextStyle,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { UserDataType } from "@/models/editProfileModel";
type EditNameViewProps = {
  handleGoBack: () => void;
  handleSave: () => void;
  firstName: string;
  lastName: string;
  profile: UserDataType | null;
  setFirstName: React.Dispatch<React.SetStateAction<string>>;
  setLastName: React.Dispatch<React.SetStateAction<string>>;
};

export default function EditNameView({
  handleGoBack,
  handleSave,
  firstName,
  lastName,
  profile,
  setFirstName,
  setLastName,
}: EditNameViewProps) {
  return (
    <View style={styles.container}>
      {/* Back Button */}
      <Pressable style={styles.backButton} onPress={handleGoBack}>
        <Ionicons name="chevron-back" size={24} color="white" />
      </Pressable>

      <Text style={styles.header}>Update your Name</Text>

      <Text style={styles.label}>Current name</Text>
      <Text style={styles.currentName}>
        {profile?.first_name} {profile?.last_name}
      </Text>

      <Text style={styles.label}>Your first name</Text>
      <TextInput
        style={styles.input}
        value={firstName}
        onChangeText={setFirstName}
        placeholder="First Name"
        placeholderTextColor="#999"
      />

      <Text style={styles.label}>Your last name</Text>
      <TextInput
        style={styles.input}
        value={lastName}
        onChangeText={setLastName}
        placeholder="Last Name"
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
    paddingTop: 60,
    flex: 1,
    backgroundColor: "#00160A",
    padding: 24,
    justifyContent: "flex-start",
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
  currentName: {
    color: "#999999",
    fontSize: 14,
    fontWeight: "700",
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
