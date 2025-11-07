import React, { useState } from "react"; // Import useState
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
import { useSignup } from "./SignUpContext"; // Fixed typo: was SignUpContext

// A simple regex for email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignupEmail() {
  // 1. Get the global state and setter from the context
  const { signupData, setSignupData } = useSignup();
  // 2. Add state for the error message
  const [error, setError] = useState("");

  const handleClick = () => {
    // 3. Validate the email
    if (!emailRegex.test(signupData.email)) {
      setError("Please enter a valid email address.");
    } else {
      setError(""); // Clear error
      router.push("/signup/password");
    }
  };

  const handleEmailChange = (email: string) => {
    // Clear error as user types
    if (error) {
      setError("");
    }
    setSignupData((prev) => ({ ...prev, email }));
  };

  // 2. Note: No more <SignupContext.Provider> wrapper!
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
          <Image source={require("@/assets/images/mas-bosque-logo.png")} />
          <Text style={styles.text}>Let's start with email</Text>

          {/* Wrap InputBar and Error in a View for better layout */}
          <View style={styles.inputContainer}>
            <InputBar
              value={signupData.email} // Read from global state
              onChangeText={handleEmailChange} // Use new handler
            />
            {/* 4. Display the error message */}
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>

          <Button value="Continue" onClick={handleClick} />
          <View style={styles.textWrapper}>
            <Text style={styles.subtext}>Already have an account?</Text>
            <Text
              style={styles.signup}
              onPress={() => {
                router.push("/(auth)/login");
              }}
            >
              LogIn
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ... your styles remain the same
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
  // 5. Add styles for the error and the input container
  inputContainer: {
    width: "100%", // Ensure it takes full width for alignment
    alignItems: "center", // Center InputBar
    gap: 8, // Space between input and error
  },
  errorText: {
    fontSize: 14,
    color: "#FF5A5A", // A common error color
    // You might want to use a regular font weight here
    fontFamily: "Lato-Bold",
    textAlign: "center",
  },
  textWrapper: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 5,
  },
  subtext: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "SF Pro Rounded",
    color: "#fff",
    textAlign: "left",
  },
  signup: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "SF Pro Rounded",
    color: "#06D23C",
    textAlign: "left",
  },
});
