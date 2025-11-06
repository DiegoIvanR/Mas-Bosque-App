import * as React from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import InputBar from "@/components/InputBar";
import Button from "@/components/Button";
import { router } from "expo-router";

export default function SignupMedical() {
  const [bloodType, setBloodType] = React.useState("");
  const [allergies, setAllergies] = React.useState("");
  const [medications, setMedications] = React.useState("");
  const [medical, setMedical] = React.useState("");

  const handleClick = () => {
    router.replace("/signup/emcontact");
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.text}>Medical Conditions</Text>

          <View style={styles.inputWrapper}>
            <Text style={styles.subText}>Blood Type</Text>
            <InputBar value={bloodType} onChangeText={setBloodType} />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.subText}>Allergies</Text>
            <InputBar value={allergies} onChangeText={setAllergies} />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.subText}>Medications</Text>
            <InputBar value={medications} onChangeText={setMedications} />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.subText}>Got any medical conditions?</Text>
            <InputBar value={medical} onChangeText={setMedical} />
          </View>

          <Button value="Continue" onClick={handleClick} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#00160B",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flexGrow: 0.5, // ensures ScrollView content expands properly
    paddingHorizontal: 30,
    alignItems: "center",
    justifyContent: "center",
    gap: 35,
  },
  text: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "Lato-Bold",
    color: "#fff",
    textAlign: "center",
  },
  inputWrapper: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: "10",
  },
  subText: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "SF Pro Rounded",
    color: "#fff",
    textAlign: "left",
  },
});
