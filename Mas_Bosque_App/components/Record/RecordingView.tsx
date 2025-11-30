import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { RecordingState } from "@/lib/useRecordingSession";
import { RecordingMap } from "./RecordingMap";
import { TrackingStatsOverlay } from "../TrackingStatsOverlay";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

type RecordingViewProps = {
  state: RecordingState;
  onStart: () => void;
  onStop: () => void;
  onAddPoint: (type: "hazard" | "drop" | "viewpoint") => void;
};

export function RecordingView({
  state,
  onStart,
  onStop,
  onAddPoint,
}: RecordingViewProps) {
  // Loading Overlay (during save/upload)

  return (
    <View style={styles.container}>
      {/* 1. Map Layer */}
      <RecordingMap
        routePath={state.routePath}
        interestPoints={state.interestPoints}
        currentLocation={state.currentLocation}
        heading={state.heading}
      />

      {/* 2. Controls */}
      <SafeAreaView style={styles.controls}>
        {!state.isRecording ? (
          // --- START BUTTON ---
          <View style={styles.topControl}>
            <TouchableOpacity style={styles.startButton} onPress={onStart}>
              <Ionicons name="play" size={24} color="black" />
              <Text style={styles.startText}>Start Recording</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // --- RECORDING CONTROLS ---
          <View style={styles.activeControls}>
            <View style={styles.poiRow}>
              <TouchableOpacity
                style={[styles.poiBtn]}
                onPress={() => onAddPoint("hazard")}
              >
                <MaterialCommunityIcons
                  name="alert-circle"
                  size={24}
                  color="#FF5A5A"
                />
                <Text style={[styles.poiText, { color: "#FF5A5A" }]}>
                  Hazard
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.poiBtn]}
                onPress={() => onAddPoint("drop")}
              >
                <MaterialCommunityIcons
                  name="arrow-down-bold-circle"
                  size={24}
                  color="#FFA500"
                />
                <Text style={[styles.poiText, { color: "#FFA500" }]}>Drop</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.poiBtn]}
                onPress={() => onAddPoint("viewpoint")}
              >
                <MaterialCommunityIcons
                  name="camera"
                  size={24}
                  color="#04FF0C"
                />
                <Text style={[styles.poiText, { color: "#04FF0C" }]}>View</Text>
              </TouchableOpacity>
            </View>

            {/* --- FINISH BUTTON --- */}
            <TouchableOpacity style={styles.stopButton} onPress={onStop}>
              <Ionicons name="stop" size={24} color="white" />
              <Text style={styles.stopText}>Finish</Text>
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

  controls: {
    position: "absolute",
    bottom: 140, // <-- sits above TrackingStatsOverlay
    left: 0,
    right: 0,
    alignItems: "center",
    paddingBottom: 10,
    width: "100%",
  },
  topControl: {},
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
    width: "90%",
    display: "flex",
    flexDirection: "row",
    alignContent: "space-between",
    alignItems: "center",
  },
  poiRow: {
    flexDirection: "row",
    flex: 1, // <-- Instead of width: "50%"
    marginRight: 10,
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
    color: "#00160B",
    backgroundColor: "#00160B",
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
    width: "30%",
    elevation: 5,
  },
  stopText: {
    color: "white",
    fontFamily: "Lato-Bold",
    fontSize: 16,
  },
});
