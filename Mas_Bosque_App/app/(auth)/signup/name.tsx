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

export default function SignupName() {
  const { signupData, setSignupData } = useSignup();
  const [error, setError] = useState("");

  // 1. Create validation constant
  const isValid =
    signupData.name.trim().length > 0 && signupData.lastName.trim().length > 0;

  const handleClick = () => {
    if (!isValid) {
      setError("Please fill in both your name and last name.");
    } else {
      setError("");
      router.push("/signup/medical");
    }
  };
  const handleNameChange = (name: string) => {
    if (error) setError("");
    setSignupData((prev) => ({ ...prev, name }));
  };
  const handleLastNameChange = (lastName: string) => {
    if (error) setError("");
    setSignupData((prev) => ({ ...prev, lastName }));
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
          <Text style={styles.text}>Let’s get to know you</Text>

          <View style={styles.inputWrapper}>
            <Text style={styles.subText}>Name</Text>
            <InputBar
              value={signupData.name}
              onChangeText={handleNameChange}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.subText}>Last Name</Text>
            <InputBar
              value={signupData.lastName}
              onChangeText={handleLastNameChange}
              autoCapitalize="words"
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
    marginTop: 20, // Add some space above button
    gap: 8, // Space for error message
  },
  // 5. Add error text style
  errorText: {
    fontSize: 14,
    color: "#FF5A5A",
    fontFamily: "Lato-Bold",
    textAlign: "center",
  },
});
