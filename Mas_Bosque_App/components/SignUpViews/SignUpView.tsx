import React from "react";
import {
  View,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import InputBar from "@/components/InputBar";
import Button from "@/components/Button";
import { SignupData } from "@/app/(auth)/signup/SignUpContext";

type SignUpViewProps = {
  signupData: SignupData;
  error: string;
  validEmail: boolean;
  handleEmailChange: (c: string) => void;
  handleClick: () => void;
  handleClickLogIn: () => void;
};

export default function SignUpView({
  signupData,
  error,
  validEmail,
  handleEmailChange,
  handleClick,
  handleClickLogIn,
}: SignUpViewProps) {
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

          <View style={styles.buttonContainer}>
            <Button
              value="Continue"
              onClick={handleClick}
              disabled={validEmail}
            />
          </View>

          <View style={styles.textWrapper}>
            <Text style={styles.subtext}>Already have an account?</Text>
            <Text style={styles.signup} onPress={handleClickLogIn}>
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
    flexGrow: 0.5, // This is the "good" style
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
  buttonContainer: {
    width: "100%",
    alignItems: "center",
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
