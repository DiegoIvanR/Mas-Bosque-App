import React, { useState } from "react";
import { Alert, ToastAndroid, Platform, View, StyleSheet } from "react-native";
import { router } from "expo-router";

import { useRecordingSession } from "@/lib/useRecordingSession";
import { RecordingView } from "@/components/Record/RecordingView";
import { saveRecordedSession, uploadSessionToSupabase } from "@/lib/database"; // Import from the file above
import GoBackButton from "@/components/Helpers/GoBackButton";
import RouteSubmissionForm from "@/components/Record/RouteSubmissionForm";
import LoadingScreen from "@/views/LoadingScreen";

export default function RecordScreen() {
  const session = useRecordingSession();

  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [showForm, setShowForm] = useState(false);

  const handleStart = () => {
    session.startRecording();
  };

  const handleStop = async () => {
    session.stopRecording();
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
  };

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
        // SQLite auto-increments ID, we don't pass it here
        start_time: session.startTime || new Date().toISOString(),
        end_time: new Date().toISOString(),
        distance_km: session.distanceTraveled,
        duration_seconds: session.elapsedTime,
        route_data: session.routePath,
        interest_points: session.interestPoints,
        // FORM DATA
        name: formData.name,
        difficulty: formData.difficulty,
        local_image_uri: formData.imageUri || undefined,
      };

      // 1. Save Local
      const localSessionId = await saveRecordedSession(recordedSession);

      setLoadingMessage("Saved! Uploading...");

      // 2. Upload to Supabase
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
      router.replace("/(tabs)");
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

  if (isProcessing) return <LoadingScreen />;

  return (
    <View style={styles.container}>
      <GoBackButton
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          zIndex: 100,
          transform: [{ rotate: "270deg" }], // Fixed invalid syntax here
        }}
        backgroundColor={"rgba(30, 30, 30, 0.85)"}
      />

      <RecordingView
        state={session}
        onStart={handleStart}
        onStop={handleStop}
        onAddPoint={handleAddPoint}
      />

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
  // Removed unused goBackButton style to avoid confusion
});
