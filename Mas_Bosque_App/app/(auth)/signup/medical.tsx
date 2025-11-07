import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import InputBar from "@/components/InputBar";
import Button from "@/components/Button";
import { router } from "expo-router";
import { useSignup } from "./SignUpContext";
import GoBackButton from "@/components/GoBackButton"; // 1. Import

export default function SignupMedical() {
  const { signupData, setSignupData } = useSignup();
  const [error, setError] = useState("");

  // 1. Validation for blood type
  const isValid = signupData.bloodType.trim().length > 0;

  const handleClick = () => {
    if (!isValid) {
      setError("Please enter your blood type.");
    } else {
      setError("");
      router.push("/signup/emcontact");
    }
  };
  const handleBloodTypeChange = (bloodType: string) => {
    if (error) setError("");
    setSignupData((prev) => ({ ...prev, bloodType }));
  };
  const handleAllergiesChange = (allergies: string) => {
    setSignupData((prev) => ({ ...prev, allergies }));
  };
  const handleMedicalConditionsChange = (medicalConditions: string) => {
    setSignupData((prev) => ({ ...prev, medicalConditions }));
  };
  const handleMedicationsChange = (medications: string) => {
    setSignupData((prev) => ({ ...prev, medications }));
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 2. Add the button here */}
      <View style={styles.header}>
        <GoBackButton />
      </View>

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
            <InputBar
              value={signupData.bloodType}
              onChangeText={handleBloodTypeChange}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.subText}>Allergies</Text>
            <InputBar
              value={signupData.allergies}
              onChangeText={handleAllergiesChange}
              autoCapitalize="sentences"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.subText}>Medications</Text>
            <InputBar
              value={signupData.medications}
              onChangeText={handleMedicationsChange}
              autoCapitalize="sentences"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.subText}>Got any medical conditions?</Text>
            <InputBar
              value={signupData.medicalConditions}
              onChangeText={handleMedicalConditionsChange}
              autoCapitalize="sentences"
            />
          </View>

          <View style={styles.buttonContainer}>
            {/* 3. Display error */}
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <Button
              value="Continue"
              onClick={handleClick}
              disabled={!isValid} // 4. Add disabled prop
            />
          </View>
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
  // 3. Add header style
  header: {
    width: "100%",
    paddingLeft: 20,
    paddingTop: 10,
    zIndex: 10,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flexGrow: 0.5, // 4. Fix: Make style identical to index.tsx
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
    gap: 10,
  },
  subText: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "SF Pro Rounded",
    color: "#fff",
    textAlign: "left",
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    gap: 8, // Space for error
  },
  // 5. Add error text style
  errorText: {
    fontSize: 14,
    color: "#FF5A5A",
    fontFamily: "Lato-Bold",
    textAlign: "center",
  },
});
