import React, { useState } from "react";
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
import { useSignup } from "./SignUpContext";

export default function SignupName() {
  const { signupData, setSignupData } = useSignup();
  const [error, setError] = useState("");

  const handleClick = () => {
    router.push("/signup/medical");
  };
  const handleNameChange = (name: string) => {
    if (error) {
      setError("");
    }
    setSignupData((prev) => ({ ...prev, name }));
  };
  const handleLastNameChange = (lastName: string) => {
    if (error) {
      setError("");
    }
    setSignupData((prev) => ({ ...prev, lastName }));
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
          <Text style={styles.text}>Let’s get to know you</Text>

          <View style={styles.inputWrapper}>
            <Text style={styles.subText}>Name</Text>
            <InputBar value={signupData.name} onChangeText={handleNameChange} />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.subText}>Last Name</Text>
            <InputBar
              value={signupData.lastName}
              onChangeText={handleLastNameChange}
            />
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
