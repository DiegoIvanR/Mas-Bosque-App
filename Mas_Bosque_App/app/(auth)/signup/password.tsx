import React, { useState } from "react"; // Import useState
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
import { useSignup } from "./SignUpContext"; // Fixed typo: was SignUpContext

export default function SignupPassword() {
  // 1. Get the global state and setter
  const { signupData, setSignupData } = useSignup();
  // 2. Add state for error and loading
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // --- 1. ADD THIS STATE ---
  // This state will track if the password text is hidden or not
  const [isPasswordSecure, setIsPasswordSecure] = useState(true);

  // --- 2. ADD THIS FUNCTION ---
  // This is the callback function we will pass to the InputBar
  const toggleSecureEntry = () => {
    setIsPasswordSecure((previousState) => !previousState);
  };

  const handleClick = () => {
    // 3. Validate the password (e.g., minimum 6 characters)
    if (signupData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
    } else {
      // 6. Success! User is created. Navigate to the next step.
      // (This runs even if email confirmation is required)
      router.push("/signup/name");
    }
  };

  const handlePasswordChange = (password: string) => {
    // Clear error as user types
    if (error) {
      setError("");
    }
    setSignupData((prev) => ({ ...prev, password }));
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
          <Text style={styles.text}>Create a password</Text>

          {/* Wrap InputBar and Error in a View for better layout */}
          <View style={styles.inputContainer}>
            <InputBar
              value={signupData.password} // Read password from global state
              onChangeText={handlePasswordChange} // Use new handler
              placeholder="Password" // Add placeholder text
              // --- 3. ADD THESE PROPS ---
              secureTextEntry={isPasswordSecure} // Pass the state
              onToggleSecureEntry={toggleSecureEntry} // Pass the function
            />
            {/* 4. Display the error message */}
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>

          {/* 7. Update button to show loading state */}
          <Button
            value={loading ? "Creating Account..." : "Continue"}
            onClick={handleClick}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ... your styles (same as the other screen)
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#00160B",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flexGrow: 0.5,
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
    fontFamily: "Lato-Bold",
    textAlign: "center",
  },
});
