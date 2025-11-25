import React, { useState } from "react";
import { Alert, ToastAndroid, Platform } from "react-native";
import { useRecordingSession } from "@/lib/useRecordingSession";
import { RecordingView } from "@/components/RecordingView";
import { saveRecordedSession, uploadSessionToSupabase } from "@/lib/database";
import { router } from "expo-router";

export default function RecordScreen() {
  const session = useRecordingSession();

  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  const handleStart = () => {
    session.startRecording();
  };

  const handleStop = async () => {
    Alert.alert(
      "Finish Recording?",
      "Are you sure you want to stop tracking?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Finish & Save",
          onPress: async () => {
            await finishAndSave();
          },
        },
      ]
    );
  };

  const finishAndSave = async () => {
    if (session.routePath.length === 0) {
      Alert.alert("Error", "No route data recorded.");
      session.stopRecording();
      return;
    }

    try {
      session.stopRecording();

      setIsProcessing(true);
      setLoadingMessage("Saving locally...");

      const recordedSession = {
        // No ID passed here, SQLite auto-increments
        start_time: session.startTime || new Date().toISOString(),
        end_time: new Date().toISOString(),
        distance_km: session.distanceTraveled,
        duration_seconds: session.elapsedTime,
        route_data: session.routePath,
        interest_points: session.interestPoints,
      };

      // Save and get the numeric ID back
      const localSessionId = await saveRecordedSession(recordedSession);

      setLoadingMessage("Saved!");

      Alert.alert(
        "Route Saved Locally",
        "Do you want to upload this route to the cloud now?",
        [
          {
            text: "Later",
            style: "cancel",
            onPress: () => {
              setIsProcessing(false);
              router.replace("/(tabs)/saved");
            },
          },
          {
            text: "Upload Now",
            onPress: async () => {
              // Pass the numeric ID to the upload function
              await performUpload(localSessionId);
            },
          },
        ]
      );
    } catch (e: any) {
      console.error(e);
      setIsProcessing(false);
      Alert.alert("Error", "Failed to save session locally.");
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
        "Could not upload. Data is saved locally and can be uploaded later."
      );
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
    <RecordingView
      state={session}
      onStart={handleStart}
      onStop={handleStop}
      onAddPoint={handleAddPoint}
      isProcessing={isProcessing}
      loadingMessage={loadingMessage}
    />
  );
}
