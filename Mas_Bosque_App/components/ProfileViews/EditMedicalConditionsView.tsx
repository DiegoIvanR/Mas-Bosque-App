import {
  Text,
  Pressable,
  TextInput,
  ViewStyle,
  TextStyle,
  StyleSheet,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

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
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* Back Button */}
      <Pressable style={styles.backButton} onPress={handleGoBack}>
        <Ionicons name="chevron-back" size={24} color="white" />
      </Pressable>

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
    marginTop: 40,
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
