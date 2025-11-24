import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Pressable, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Route } from "@/lib/database";
import { router } from "expo-router";
import { savedRoutesModel } from "@/models/savedRoutesModel";

// Update type to include the saved boolean
type RoutePreview = Omit<Route, "route_data"> & { saved?: boolean };

// Helper function to sync with Supabase
export const updateRouteSaveStatus = async (
  routeId: string,
  targetStateIsSaved: boolean
) => {
  try {
    console.log(
      `Route ${routeId} updating to: ${
        targetStateIsSaved ? "Saved" : "Unsaved"
      }`
    );

    if (targetStateIsSaved) {
      // User wants to SAVE
      const { error } = await savedRoutesModel.saveRoute(routeId);
      if (error) throw error;
      return { success: true, saved: true };
    } else {
      // User wants to UNSAVE (Delete)
      const { error } = await savedRoutesModel.deleteRoute(routeId);
      if (error) throw error;
      return { success: true, saved: false };
    }
  } catch (e) {
    console.error("updateRouteSaveStatus Error:", e);
    return { success: false, saved: targetStateIsSaved, error: e };
  }
};

export default function RouteCard({ route }: { route: RoutePreview }) {
  // Initialize state based on the prop passed from the model
  const [isSaved, setIsSaved] = useState(route.saved || false);

  // CRITICAL: Sync state when the parent list refreshes
  // This ensures that if you pull-to-refresh, the icon updates correctly
  useEffect(() => {
    setIsSaved(route.saved || false);
  }, [route.saved]);

  const handlePress = () => {
    router.push(`/route/${route.id}`);
  };

  const handleToggleSave = (e: any) => {
    // Prevent the card press event from firing
    e.stopPropagation();

    // 1. Calculate new state (Optimistic)
    const newState = !isSaved;

    // 2. Update UI immediately
    setIsSaved(newState);

    // 3. Sync with DB
    updateRouteSaveStatus(route.id, newState);
  };

  return (
    <Pressable style={styles.card} onPress={handlePress}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: route.image_url || "https://via.placeholder.com/300" }}
          style={styles.cardImage}
        />
        {/* Bookmark Icon Overlay */}
        <Pressable
          style={styles.bookmarkButton}
          onPress={handleToggleSave}
          hitSlop={10}
        >
          <View style={styles.bookmarkBackground}>
            <MaterialIcons
              name={isSaved ? "bookmark" : "bookmark-border"}
              size={24}
              color="#FFFFFF"
            />
          </View>
        </Pressable>
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{route.name}</Text>
        <Text style={styles.cardSubtitle}>{route.location}</Text>
        <View style={styles.cardInfoRow}>
          <MaterialIcons name="star" size={14} color="#A0A0A0" />
          <Text style={styles.cardInfoText}>
            {route.rating} · {route.difficulty} · {route.distance_km} km
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    display: "flex",
    justifyContent: "center",
    width: 334,
    margin: "auto",
    marginBottom: 24,
  },
  imageContainer: {
    borderRadius: 16,
    marginBottom: 20,
    overflow: "hidden",
    position: "relative",
  },
  cardImage: {
    width: "100%",
    height: 250,
  },
  // Circular background for the bookmark icon
  bookmarkBackground: {
    backgroundColor: "rgba(0,0,0,0.6)", // Semi-transparent black
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backdropFilter: "blur(4px)", // Works on some versions of Expo/Web
  },
  bookmarkButton: {
    position: "absolute",
    top: 15,
    right: 15,
    zIndex: 10,
  },
  cardContent: {},
  cardTitle: {
    fontSize: 20,
    paddingBottom: 5,
    fontWeight: "500",
    fontFamily: "Lato-Light",
    color: "#fff",
    textAlign: "left",
  },
  cardSubtitle: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "Lato-Light",
    color: "#676767",
    textAlign: "left",
    marginBottom: 5,
  },
  cardInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  cardInfoText: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "Lato-Light",
    color: "#676767",
    textAlign: "left",
  },
});
