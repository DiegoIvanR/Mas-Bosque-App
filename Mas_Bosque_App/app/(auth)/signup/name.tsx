import * as React from "react";
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

export default function SignupName() {
  const [name, setName] = React.useState("");
  const [lastName, setLastName] = React.useState("");

  const handleClick = () => {
    router.replace("/signup/medical");
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
            <InputBar value={name} onChangeText={setName} />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.subText}>Last Name</Text>
            <InputBar value={lastName} onChangeText={setLastName} />
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
