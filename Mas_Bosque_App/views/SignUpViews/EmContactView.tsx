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
import InputBar from "@/components/Helpers/InputBar";
import Button from "@/components/Helpers/Button";
import GoBackButton from "@/components/Helpers/GoBackButton";
import { SignupData } from "@/app/(auth)/signup/SignUpContext";

type EmContactViewProps = {
  signupData: SignupData;
  error: string;
  loading: boolean;
  isValid: boolean;
  handleNameChange: (c: string) => void;
  handleLastName: (c: string) => void;
  handlePhone: (c: string) => void;
  handleRelationship: (c: string) => void;
  handleClick: () => void;
};

export default function EmContactView({
  signupData,
  error,
  loading,
  isValid,
  handleNameChange,
  handleLastName,
  handlePhone,
  handleRelationship,
  handleClick,
}: EmContactViewProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 3. Add the button here */}
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
          <Text style={styles.text}>Who's your emergency contact?</Text>

          <View style={styles.inputWrapper}>
            <Text style={styles.subText}>Name</Text>
            <InputBar
              value={signupData.contactName}
              onChangeText={handleNameChange}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.subText}>Last Name</Text>
            <InputBar
              value={signupData.contactLastName}
              onChangeText={handleLastName}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.subText}>Phone Number</Text>
            <InputBar
              value={signupData.contactPhone}
              onChangeText={handlePhone}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.subText}>How are they related to you?</Text>
            <InputBar
              value={signupData.contactRelationship}
              onChangeText={handleRelationship}
              autoCapitalize="words"
            />
          </View>

          {/* --- ADDED THIS SECTION --- */}
          <View style={styles.buttonContainer}>
            {/* Display the error message */}
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Button
              value={loading ? "Finishing..." : "Continue"}
              onClick={handleClick}
              disabled={!isValid || loading} // 2. Add disabled prop
            />
          </View>
          {/* --- END OF SECTION --- */}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ... (styles remain the same) ...
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#00160B",
  },
  // 4. Add header style
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
    flexGrow: 0.5, // 5. Fix: Make style identical to index.tsx
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
  // --- ADDED THESE STYLES ---
  buttonContainer: {
    width: "100%", // Ensure it takes full width for alignment
    alignItems: "center", // Center Button
    gap: 8, // Space between error and button
  },
  errorText: {
    fontSize: 14,
    color: "#FF5A5A", // A common error color
    fontFamily: "Lato-Bold", // Match other styles
    textAlign: "center",
  },
});
