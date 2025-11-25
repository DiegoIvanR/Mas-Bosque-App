import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { RecordingState } from "@/lib/useRecordingSession";
import { RecordingMapView } from "./RecordingMapView";
import { TrackingStatsOverlay } from "./TrackingStatsOverlay";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

type RecordingViewProps = {
  state: RecordingState;
  onStart: () => void;
  onStop: () => void;
  onAddPoint: (type: "hazard" | "drop" | "viewpoint") => void;
  isProcessing: boolean;
  loadingMessage?: string;
};

export function RecordingView({
  state,
  onStart,
  onStop,
  onAddPoint,
  isProcessing,
  loadingMessage,
}: RecordingViewProps) {
  // Loading Overlay (during save/upload)
  if (isProcessing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#04FF0C" />
        <Text style={styles.loadingText}>
          {loadingMessage || "Processing..."}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 1. Map Layer */}
      <RecordingMapView
        routePath={state.routePath}
        interestPoints={state.interestPoints}
        currentLocation={state.currentLocation}
        heading={state.heading}
      />

      {/* 2. Controls */}
      <SafeAreaView style={styles.topControls}>
        {!state.isRecording ? (
          // --- START BUTTON ---
          <TouchableOpacity style={styles.startButton} onPress={onStart}>
            <Ionicons name="play" size={24} color="black" />
            <Text style={styles.startText}>Start Recording</Text>
          </TouchableOpacity>
        ) : (
          // --- RECORDING CONTROLS ---
          <View style={styles.activeControls}>
            <View style={styles.poiRow}>
              <TouchableOpacity
                style={[styles.poiBtn, { backgroundColor: "#FF5A5A" }]}
                onPress={() => onAddPoint("hazard")}
              >
                <MaterialCommunityIcons
                  name="alert-circle"
                  size={24}
                  color="white"
                />
                <Text style={styles.poiText}>Hazard</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.poiBtn, { backgroundColor: "#FFA500" }]}
                onPress={() => onAddPoint("drop")}
              >
                <MaterialCommunityIcons
                  name="arrow-down-bold-circle"
                  size={24}
                  color="white"
                />
                <Text style={styles.poiText}>Drop</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.poiBtn, { backgroundColor: "#04FF0C" }]}
                onPress={() => onAddPoint("viewpoint")}
              >
                <MaterialCommunityIcons name="camera" size={24} color="black" />
                <Text style={[styles.poiText, { color: "black" }]}>View</Text>
              </TouchableOpacity>
            </View>

            {/* --- FINISH BUTTON --- */}
            <TouchableOpacity style={styles.stopButton} onPress={onStop}>
              <Ionicons name="stop" size={24} color="white" />
              <Text style={styles.stopText}>Finish Route</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>

      {/* 3. Stats & SOS */}
      <TrackingStatsOverlay
        elapsedTime={state.elapsedTime}
        distanceTraveled={state.distanceTraveled}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#00160B" },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00160B",
  },
  loadingText: {
    color: "white",
    marginTop: 10,
    fontFamily: "Lato-Regular",
    fontSize: 16,
  },

  topControls: {
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
    alignItems: "center",
  },
  startButton: {
    backgroundColor: "#04FF0C",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  startText: { fontFamily: "Lato-Bold", fontSize: 18 },

  activeControls: {
    width: "100%",
    gap: 20,
  },
  poiRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  poiBtn: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 12,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    elevation: 3,
  },
  poiText: {
    color: "white",
    fontSize: 12,
    fontFamily: "Lato-Bold",
    marginTop: 4,
  },
  stopButton: {
    backgroundColor: "#FF3B30",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 30,
    gap: 8,
    alignSelf: "center",
    width: "60%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    elevation: 5,
  },
  stopText: { color: "white", fontFamily: "Lato-Bold", fontSize: 16 },
});
