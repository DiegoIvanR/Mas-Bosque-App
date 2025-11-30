// !!!! IGNORE !!!!
// only for testing purposes, doesn't follow MVC
import React from "react";
import { View, Button, Alert } from "react-native";
import Logger from "@/utils/Logger"; // Ensure this path matches your project structure

export const SentryTestButton = () => {
  const handleHandledError = () => {
    // 1. Test a "handled" error (doesn't crash app, just reports it)
    try {
      Logger.log("Testing handled error...");
      throw new Error("This is a HANDLED error test.");
    } catch (e: any) {
      Logger.error("Caught a test error!", e);
      Alert.alert("Success", "Handled error sent to Sentry.");
    }
  };

  const handleCrash = () => {
    // 2. Test a FATAL crash (App will close or show Red Box)
    Logger.warn("Warning: User is forcing a fatal crash.");
    throw new Error("FATAL TEST CRASH: This should appear in Sentry issues.");
  };

  return (
    <View style={{ padding: 20, gap: 10 }}>
      <Button
        title="Test Handled Error (Log Only)"
        onPress={handleHandledError}
      />
      <Button
        title="FORCE CRASH (Red Button)"
        color="red"
        onPress={handleCrash}
      />
    </View>
  );
};
