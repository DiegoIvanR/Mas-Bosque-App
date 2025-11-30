import { Text, View, Pressable, TextInput, StyleSheet } from "react-native";
import { UserDataType } from "@/models/editProfileModel";
import ProfileBackButton from "@/components/Helpers/ProfileBackButton";

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
      <ProfileBackButton onPress={handleGoBack} />

      <Text style={styles.header}>Update your Name</Text>

      <Text style={styles.label}>Current name</Text>
      <Text style={styles.currentName}>
        {profile?.first_name} {profile?.last_name}
      </Text>

      <Text style={styles.label}>First name</Text>
      <TextInput
        style={styles.input}
        value={firstName}
        onChangeText={setFirstName}
        placeholder="First Name"
        placeholderTextColor="#999"
      />

      <Text style={styles.label}>Last name</Text>
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

  currentName: {
    color: "#999",
    fontSize: 14,
    marginBottom: 16,
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
