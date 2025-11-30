import { Text, Pressable, TextInput, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import ProfileBackButton from "@/components/Helpers/ProfileBackButton";

type EditMedicalConditionsViewProps = {
  handleGoBack: () => void;
  handleSave: () => void;
  bloodType: string;
  allergies: string;
  medications: string;
  medicalConditions: string;
  loading: boolean;
  setBloodType: React.Dispatch<React.SetStateAction<string>>;
  setAllergies: React.Dispatch<React.SetStateAction<string>>;
  setMedications: React.Dispatch<React.SetStateAction<string>>;
  setMedicalConditions: React.Dispatch<React.SetStateAction<string>>;
};

export default function EditMedicalConditionsView({
  handleGoBack,
  handleSave,
  bloodType,
  allergies,
  medications,
  medicalConditions,
  loading,
  setBloodType,
  setAllergies,
  setMedications,
  setMedicalConditions,
}: EditMedicalConditionsViewProps) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ProfileBackButton onPress={handleGoBack} />

      <Text style={styles.header}>Edit your medical conditions</Text>

      <Text style={styles.label}>Blood type</Text>
      <TextInput
        style={styles.input}
        value={bloodType}
        onChangeText={setBloodType}
        placeholder="Blood type"
        placeholderTextColor="#999"
      />

      <Text style={styles.label}>Allergies</Text>
      <TextInput
        style={styles.input}
        value={allergies}
        onChangeText={setAllergies}
        placeholder="Allergies"
        placeholderTextColor="#999"
      />

      <Text style={styles.label}>Medications</Text>
      <TextInput
        style={styles.input}
        value={medications}
        onChangeText={setMedications}
        placeholder="Medications"
        placeholderTextColor="#999"
      />

      <Text style={styles.label}>Medical conditions</Text>
      <TextInput
        style={styles.input}
        value={medicalConditions}
        onChangeText={setMedicalConditions}
        placeholder="Medical conditions"
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00160A",
  },

  content: {
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
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
