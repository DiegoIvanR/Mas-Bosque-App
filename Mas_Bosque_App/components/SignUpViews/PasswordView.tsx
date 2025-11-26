import React from "react";
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
import { SignupData } from "@/app/(auth)/signup/SignUpContext";
import GoBackButton from "../GoBackButton";
type PasswordViewProps = {
  signupData: SignupData;
  error: string;
  isPasswordSecure: boolean;
  loading: boolean;
  isPasswordValid: boolean;
  handlePasswordChange: (c: string) => void;
  toggleSecureEntry: () => void;
  handleClick: () => void;
};
export default function PasswordView({
  signupData,
  error,
  isPasswordSecure,
  loading,
  isPasswordValid,
  handlePasswordChange,
  toggleSecureEntry,
  handleClick,
}: PasswordViewProps) {
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
              autoCapitalize="none"
            />
            {/* 4. Display the error message */}
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>

          {/* 7. Wrap the button in a full-width container */}
          <View style={styles.buttonContainer}>
            <Button
              value={loading ? "Creating Account..." : "Continue"}
              onClick={handleClick}
              disabled={!isPasswordValid || loading} // 5. Pass disabled prop
            />
          </View>
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
  // 3. Add a style for the header
  header: {
    width: "100%",
    paddingLeft: 20,
    paddingTop: 10, // Make it float on top
    zIndex: 10, // Ensure it's above the ScrollView
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flexGrow: 0.5, // 4. FIX: Make style identical to index.tsx
    paddingHorizontal: 30,
    alignItems: "center",
    justifyContent: "center", // 4. FIX: Make style identical to index.tsx
    gap: 35,
    // Note: paddingTop: 80 is removed, justifyContent: "center" is back
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
  // 8. ADD THIS STYLE
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  errorText: {
    fontSize: 14,
    color: "#FF5A5A", // A common error color
    fontFamily: "Lato-Bold",
    textAlign: "center",
  },
});
