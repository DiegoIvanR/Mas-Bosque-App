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

type EditPasswordViewProps = {
  handleGoBack: () => void;
  handleSave: () => void;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  loading: boolean;
  setCurrentPassword: React.Dispatch<React.SetStateAction<string>>;
  setNewPassword: React.Dispatch<React.SetStateAction<string>>;
  setConfirmPassword: React.Dispatch<React.SetStateAction<string>>;
};

export default function EditPasswordView({
  handleGoBack,
  handleSave,
  currentPassword,
  newPassword,
  confirmPassword,
  loading,
  setCurrentPassword,
  setNewPassword,
  setConfirmPassword,
}: EditPasswordViewProps) {
  return (
    <View style={styles.container}>
      {/* Back Button */}
      <Pressable style={styles.backButton} onPress={handleGoBack}>
        <Ionicons name="chevron-back" size={24} color="white" />
      </Pressable>

      <Text style={styles.header}>Update your password</Text>

      <Text style={styles.label}>Enter your current password</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={currentPassword}
        onChangeText={setCurrentPassword}
        placeholder="Current password"
        placeholderTextColor="#999"
      />

      <Text style={styles.label}>Enter your new password</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
        placeholder="New password"
        placeholderTextColor="#999"
      />

      <Text style={styles.label}>Confirm your new password</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Confirm new password"
        placeholderTextColor="#999"
      />

      <Pressable
        style={styles.saveButton}
        onPress={handleSave}
        disabled={loading}
      >
        <Text style={styles.saveButtonText}>
          {loading ? "Saving..." : "Save"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
    marginTop: 50,
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
