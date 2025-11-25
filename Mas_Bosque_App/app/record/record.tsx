import React, { useState } from "react";
import { Alert, ToastAndroid, Platform } from "react-native";
import { useRecordingSession } from "@/lib/useRecordingSession";
import { RecordingView } from "@/components/RecordingView";
import { saveRecordedSession, uploadSessionToSupabase } from "@/lib/database";
import { router } from "expo-router";
import GoBackButton from "@/components/GoBackButton";
import { View, StyleSheet } from "react-native";
import RouteSubmissionForm from "@/components/RouteSubmissionForm";

export default function RecordScreen() {
  const session = useRecordingSession();

  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [showForm, setShowForm] = useState(false);

  const handleStart = () => {
    session.startRecording();
  };

  const handleStop = async () => {
    // Instead of Alert directly, we just open the form
    // You might want a small confirmation here, or just stop:
    session.stopRecording();
    setShowForm(true);
  };

  const handleCancelForm = () => {
    // Resume recording? Or just close modal?
    // If you want to discard:
    setShowForm(false);
    // Note: session is stopped. You might want to reset it or handle 'resume' logic.
  };

  // Called when user hits "Save" on the modal
  const handleFormSubmit = async (formData: {
    name: string;
    difficulty: any;
    imageUri: string | null;
  }) => {
    setShowForm(false);

    if (session.routePath.length === 0) {
      Alert.alert("Error", "No route data recorded.");
      return;
    }

    try {
      setIsProcessing(true);
      setLoadingMessage("Saving locally...");

      const recordedSession = {
        // SQLite auto-increments ID
        start_time: session.startTime || new Date().toISOString(),
        end_time: new Date().toISOString(),
        distance_km: session.distanceTraveled,
        duration_seconds: session.elapsedTime,
        route_data: session.routePath,
        interest_points: session.interestPoints,
        // NEW FORM DATA
        name: formData.name,
        difficulty: formData.difficulty,
        local_image_uri: formData.imageUri || undefined,
      };

      // 1. Save Local
      const localSessionId = await saveRecordedSession(recordedSession);

      setLoadingMessage("Saved! Uploading...");

      // 2. Upload to Supabase (includes Image upload now)
      await performUpload(localSessionId);
    } catch (e: any) {
      console.error(e);
      setIsProcessing(false);
      Alert.alert("Error", "Failed to save session.");
    }
  };

  const performUpload = async (localSessionId: number) => {
    try {
      setLoadingMessage("Uploading to Supabase...");
      await uploadSessionToSupabase(localSessionId);

      Alert.alert("Success", "Route uploaded successfully!", [
        { text: "OK", onPress: () => router.replace("/(tabs)/saved") },
      ]);
    } catch (e: any) {
      Alert.alert(
        "Upload Failed",
        "Data saved locally. We will try uploading later."
      );
      router.replace("/(tabs)/saved");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddPoint = (type: "hazard" | "drop" | "viewpoint") => {
    session.addInterestPoint(type);
    if (Platform.OS === "android") {
      ToastAndroid.show(`${type.toUpperCase()} added!`, ToastAndroid.SHORT);
    }
  };

  return (
    <View style={styles.container}>
      <GoBackButton
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          zIndex: 100,
          transform: [{ rotate: "270deg" }],
        }}
        backgroundColor={"rgba(30, 30, 30, 0.85)"}
      />

      <RecordingView
        state={session}
        onStart={handleStart}
        onStop={handleStop}
        onAddPoint={handleAddPoint}
        isProcessing={isProcessing}
        loadingMessage={loadingMessage}
      />

      {/* The Form View Layer */}
      <RouteSubmissionForm
        visible={showForm}
        onCancel={handleCancelForm}
        onSubmit={handleFormSubmit}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00160B",
  },
  goBackButton: {
    position: "absolute",
    top: 20, // Adjust for safe area
    left: 20, // Adjust for padding
    zIndex: 100,
    transform: "90",
  },
});
