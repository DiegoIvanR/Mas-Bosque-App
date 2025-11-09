import React from "react";
import { StyleSheet, View, Text } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Route } from "@/lib/database";
import Button from "@/components/Button";

type RouteBottomSheetProps = {
  route: Route;
  bottomSheetRef: React.RefObject<BottomSheet>;
  snapPoints: string[];
  isDownloaded: boolean; // <-- Add new prop
  onToggleDownload: () => void; // <-- Update prop name
  onStart: () => void;
};

export function RouteBottomSheet({
  route,
  bottomSheetRef,
  snapPoints,
  isDownloaded, // <-- Get new prop
  onToggleDownload, // <-- Get new handler
  onStart,
}: RouteBottomSheetProps) {
  // --- Conditionally set button props ---
  const downloadButtonProps = isDownloaded
    ? {
        value: "Saved",
        icon: <Ionicons name="checkmark" size={20} color="white" />,
        backgroundColor: "rgba(120, 120, 128, 0.32)", // Grayed out
        textColor: "white",
      }
    : {
        value: "Download",
        icon: <Ionicons name="download-outline" size={20} color="#00160a" />,
        backgroundColor: "#04FF0C", // Bright green
        textColor: "#00160a",
      };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      handleIndicatorStyle={styles.handleIndicator}
      backgroundStyle={styles.bottomSheetBackground}
    >
      <BottomSheetView style={styles.bottomSheetContent}>
        <Text style={styles.routeTitle}>{route.name}</Text>
        <Text style={styles.routeLocation}>{route.location}</Text>
        <View style={styles.cardInfoRow}>
          <MaterialIcons name="star" size={14} color="#A0A0A0" />
          <Text style={styles.cardInfoText}>
            {route.rating} · {route.difficulty} · {route.distance_km} km
          </Text>
        </View>

        {/* Action Buttons using new Button.tsx */}
        <View style={styles.buttonRow}>
          <View style={styles.buttonWrapper}>
            <Button
              value={downloadButtonProps.value}
              onClick={onToggleDownload}
              icon={downloadButtonProps.icon}
              backgroundColor={downloadButtonProps.backgroundColor}
              textColor={downloadButtonProps.textColor}
            />
          </View>
          <View style={styles.buttonWrapper}>
            <Button
              value="Start"
              onClick={onStart}
              icon={
                <Ionicons name="paper-plane-outline" size={20} color="white" />
              }
              backgroundColor="rgba(120, 120, 128, 0.32)"
              textColor="white"
            />
          </View>
        </View>

        <View style={styles.expandedContent}>
          <Text style={styles.routeLocation}>
            More content appears when pulled up...
          </Text>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: "#002A12",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  handleIndicator: {
    backgroundColor: "#8E8E93",
    width: 40,
  },
  bottomSheetContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  routeTitle: {
    color: "white",
    fontSize: 24,
    fontFamily: "Lato-Bold",
    marginBottom: 4,
  },
  routeLocation: {
    color: "#BDBDBD",
    fontSize: 16,
    fontFamily: "Lato-Regular",
    marginBottom: 12,
  },
  cardInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 5, // Add gap
  },
  cardInfoText: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "Lato-Light",
    color: "#676767",
    textAlign: "left",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    margin: "auto",
  },
  buttonWrapper: {
    width: "47%",
  },
  expandedContent: {
    flex: 1,
    paddingTop: 20,
  },
});
