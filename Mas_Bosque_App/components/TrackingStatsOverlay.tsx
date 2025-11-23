import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { formatTime } from "@/lib/helpers";
import SOSButton from "@/components/SOSButton";
import SOSConfirmation from "@/app/(sos)/SOSConfirmation";
import { useSOSController } from "@/hooks/useSOSController";

type TrackingStatsOverlayProps = {
  elapsedTime: number;
  distanceTraveled: number;
};

export function TrackingStatsOverlay({
  elapsedTime,
  distanceTraveled,
}: TrackingStatsOverlayProps) {
  const { status, activateSOS, confirmEmergencyDetails } = useSOSController();

  const isSOSProcessActive =
    status === "SENDING_INITIAL" || status === "NEEDS_DETAILS";
  const isCooldown = status === "COOLDOWN";

  return (
    <SafeAreaView
      style={[
        styles.overlayContainer,
        // Normal background when NOT in SOS
        { backgroundColor: isSOSProcessActive ? undefined : "#00160B" },
        { bottom: isSOSProcessActive ? -35 : 0 },
      ]}
      edges={["bottom"]}
    >
      {isSOSProcessActive ? (
        <LinearGradient
          colors={["#960002", "#300001"]} // red → black
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.fill}
        >
          <SOSConfirmation
            onEmergencySelected={(type) => console.log("Selected:", type)}
            onSend={confirmEmergencyDetails}
            isSendingInitialSignal={status === "SENDING_INITIAL"}
          />
        </LinearGradient>
      ) : (
        <View style={styles.fill}>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{formatTime(elapsedTime)}</Text>
              <Text style={styles.statLabel}>Time</Text>
            </View>

            <SOSButton
              onLongPressComplete={activateSOS}
              isDisabled={isSOSProcessActive}
              isCooldown={isCooldown}
            />

            <View style={styles.statBox}>
              <Text style={styles.statValue}>
                {distanceTraveled.toFixed(2)}
              </Text>
              <Text style={styles.statLabel}>Distance (km)</Text>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  overlayContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    minHeight: 120,
    overflow: "hidden", // needed for rounded corners
  },
  fill: {
    flex: 1,
    justifyContent: "center",
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
});
