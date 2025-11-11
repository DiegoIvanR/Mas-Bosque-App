import React, { useState } from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { formatTime } from "@/lib/helpers";

type TrackingStatsOverlayProps = {
  elapsedTime: number;
  distanceTraveled: number;
  onSOS: () => void;
};

export function TrackingStatsOverlay({
  elapsedTime,
  distanceTraveled,
  onSOS,
}: TrackingStatsOverlayProps) {
  const [sosActive, setSosActive] = useState(false);

  const handleSOS = () => {
    setSosActive(!sosActive);
    onSOS();
  };

  return (
    <SafeAreaView style={styles.overlayContainer} edges={["bottom"]}>
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{formatTime(elapsedTime)}</Text>
          <Text style={styles.statLabel}>Time</Text>
        </View>

        <Pressable
          style={[
            styles.sosButton,
            sosActive ? styles.sosButtonActive : styles.sosButtonInactive,
          ]}
          onPress={handleSOS}
        >
          <Text
            style={[
              styles.sosText,
              sosActive ? styles.sosTextActive : styles.sosTextInactive,
            ]}
          >
            SOS
          </Text>
        </Pressable>

        <View style={styles.statBox}>
          <Text style={styles.statValue}>{distanceTraveled.toFixed(2)}</Text>
          <Text style={styles.statLabel}>Distance (km)</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  overlayContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#00160B",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  statBox: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    color: "white",
    fontSize: 24,
    fontFamily: "Lato-Bold",
  },
  statLabel: {
    color: "#8E8E93",
    fontSize: 14,
    fontFamily: "Lato-Regular",
  },
  sosButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
    bottom: 15,
  },
  sosButtonInactive: {
    borderColor: "#FF5A5A",
    backgroundColor: "rgba(255, 90, 90, 0.1)",
  },
  sosButtonActive: {
    borderColor: "black",
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  sosText: {
    fontSize: 20,
    fontFamily: "Lato-Bold",
  },
  sosTextInactive: {
    color: "#FF5A5A",
  },
  sosTextActive: {
    color: "black",
  },
});
