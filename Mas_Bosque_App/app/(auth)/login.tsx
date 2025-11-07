import { router } from "expo-router";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/lib/auth";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/SupabaseClient"; // Import your supabase client
import InputBar from "@/components/InputBar"; // Import your component
import Button from "@/components/Button"; // Import your component

export default function LoginScreen() {
  const { setIsLoggedIn } = useAuth();

  // State for the login form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // For form submission

  // State for the initial session check
  const [checkingSession, setCheckingSession] = useState(true);
  const [isPasswordSecure, setIsPasswordSecure] = useState(true);

  // --- 2. ADD THIS FUNCTION ---
  // This is the callback function we will pass to the InputBar
  const toggleSecureEntry = () => {
    setIsPasswordSecure((previousState) => !previousState);
  };

  // 2. Add a useEffect to check for an existing session on load
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        // 3. User is already logged in!
        setIsLoggedIn(true);
        router.replace("/"); // Go to tab navigator
      } else {
        // 4. No session, show the login buttons
        setCheckingSession(false);
      }
    };
    checkSession();
  }, []); // The empty array [] means this runs once when the component mounts

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    const { data, error: signInError } = await supabase.auth.signInWithPassword(
      {
        email: email,
        password: password,
      }
    );

    if (signInError) {
      setError(signInError.message);
    } else if (data.session) {
      setIsLoggedIn(true);
      router.replace("/"); // Go to tab navigator
    } else {
      setError("An unexpected error occurred. Please try again.");
    }
    setLoading(false);
  };

  // 5. Show a loading spinner while checking for a session
  if (checkingSession) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  // 6. If not loading and no session, show the login form
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
              <Text
                style={styles.signup}
                onPress={() => {
                  router.replace("/(auth)/signup");
                }}
              >
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
