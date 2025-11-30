import { Text, View, Pressable, TextInput, StyleSheet } from "react-native";
import ProfileBackButton from "@/components/Helpers/ProfileBackButton";

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
      <ProfileBackButton onPress={handleGoBack} />

      <Text style={styles.header}>Update your password</Text>

      <Text style={styles.label}>Current password</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={currentPassword}
        onChangeText={setCurrentPassword}
        placeholder="Current password"
        placeholderTextColor="#999"
      />

      <Text style={styles.label}>New password</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
        placeholder="New password"
        placeholderTextColor="#999"
      />

      <Text style={styles.label}>Confirm password</Text>
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
