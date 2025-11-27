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

type LogInProps = {
  error: string;
  isPasswordSecure: boolean;
  loading: boolean;
  email: string;
  password: string;
  setEmail: (c: string) => void;
  setPassword: (c: string) => void;
  handleLogin: () => void;
  handleSignUp: () => void;
  toggleSecureEntry: () => void;
};
export default function LoginView({
  error,
  isPasswordSecure,
  loading,
  email,
  password,
  setEmail,
  setPassword,
  handleLogin,
  handleSignUp,
  toggleSecureEntry,
}: LogInProps) {
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

          <Text style={styles.text}>Log In</Text>

          <View style={styles.inputContainer}>
            <InputBar
              value={email}
              onChangeText={(text) => setEmail(text)}
              placeholder="Email"
              // Add props like autoCapitalize="none" to your InputBar!
            />
          </View>

          <View style={styles.inputContainer}>
            <InputBar
              value={password}
              onChangeText={(text) => setPassword(text)}
              placeholder="Password"
              secureTextEntry={isPasswordSecure} // Pass the state
              onToggleSecureEntry={toggleSecureEntry} // Pass the function
            />
            {/* Display the error message */}
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>

          <View style={styles.buttonContainer}>
            <Button
              value={loading ? "Logging in..." : "Log In"}
              onClick={handleLogin}
            />
            <View style={styles.textWrapper}>
              <Text style={styles.subtext}>Don't have an account?</Text>
              <Text style={styles.signup} onPress={handleSignUp}>
                SignUp
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Merged styles from your login screen and signup screen
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#00160B",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flexGrow: 0.6, // ensures ScrollView content expands properly
    paddingHorizontal: 30,
    alignItems: "center",
    justifyContent: "center",
    gap: 35,
  },
  text: {
    fontSize: 24, // Made text bigger
    fontWeight: "700",
    fontFamily: "Lato-Bold",
    color: "#fff",
    textAlign: "center",
  },
  inputContainer: {
    width: "100%", // Ensure it takes full width for alignment
    alignItems: "center", // Center InputBar
    gap: 8, // Space between input and error
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    gap: 15, // Space between buttons
  },
  errorText: {
    fontSize: 14,
    color: "#FF5A5A", // A common error color
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
