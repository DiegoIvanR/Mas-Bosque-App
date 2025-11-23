/**
 * View: src/views/PlayerView.tsx
 *
 * Renders the player UI.
 * Now logs all button presses to the console.
 */

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PlayerState } from "../controllers/playerController";
import Logger from "../utils/Logger"; // <-- Import Logger

// ... formatTime helper function (no changes) ...
const formatTime = (millis: number): string => {
  if (!millis) return "0:00";
  const totalSeconds = Math.floor(millis / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

// ... Prop interfaces (no changes) ...
interface PlayerHandlers {
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSkipForward: () => void;
  onSkipBackward: () => void;
}

interface PlayerViewProps {
  playerState: PlayerState;
  handlers: PlayerHandlers;
}

// --- Main Component ---

export const PlayerView: React.FC<PlayerViewProps> = ({
  playerState,
  handlers,
}) => {
  const { currentSong, isPlaying, positionMillis, durationMillis } =
    playerState;

  const progress = durationMillis > 0 ? positionMillis / durationMillis : 0;

  // --- NEW LOGGING HANDLERS ---
  const handlePlayPause = () => {
    Logger.log("Button Press: Play/Pause");
    handlers.onPlayPause();
  };

  const handleNext = () => {
    Logger.log("Button Press: Next");
    handlers.onNext();
  };

  const handlePrevious = () => {
    Logger.log("Button Press: Previous");
    handlers.onPrevious();
  };

  const handleSkipForward = () => {
    Logger.log("Button Press: Skip Forward +10s");
    handlers.onSkipForward();
  };

  const handleSkipBackward = () => {
    Logger.log("Button Press: Skip Backward -10s");
    handlers.onSkipBackward();
  };
  // --- END NEW LOGGING HANDLERS ---

  // ... ArtworkDisplay component (no changes) ...
  const ArtworkDisplay = () => {
    if (currentSong?.artwork) {
      return <Image source={currentSong.artwork} style={styles.artwork} />;
    }
    return (
      <View style={[styles.artwork, styles.artworkPlaceholder]}>
        <Ionicons
          name="musical-note"
          size={artworkSize * 0.5}
          color="#c0c0c0"
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ArtworkDisplay />

      <View style={styles.songInfo}>
        <Text style={styles.title} numberOfLines={1}>
          {currentSong?.title || "No song selected"}
        </Text>
        <Text style={styles.artist} numberOfLines={1}>
          {currentSong?.artist || "---"}
        </Text>
      </View>

      {/* ... Progress Bar (no changes) ... */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarForeground,
              { width: `${progress * 100}%` },
            ]}
          />
        </View>
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{formatTime(positionMillis)}</Text>
          <Text style={styles.timeText}>{formatTime(durationMillis)}</Text>
        </View>
      </View>

      {/* Controls (now use logging handlers) */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          onPress={handleSkipBackward} // <-- Use new handler
          style={styles.controlButton}
        >
          <Ionicons name="play-back" size={24} color="#555" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handlePrevious} // <-- Use new handler
          style={styles.controlButton}
        >
          <Ionicons name="play-skip-back" size={32} color="#333" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handlePlayPause} // <-- Use new handler
          style={styles.playButton}
        >
          <Ionicons
            name={isPlaying ? "pause" : "play"}
            size={36}
            color="white"
            style={{ marginLeft: isPlaying ? 0 : 3 }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleNext} // <-- Use new handler
          style={styles.controlButton}
        >
          <Ionicons name="play-skip-forward" size={32} color="#333" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSkipForward} // <-- Use new handler
          style={styles.controlButton}
        >
          <Ionicons name="play-forward" size={24} color="#555" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ... Styles (no changes) ...
const { width } = Dimensions.get("window");
const artworkSize = width * 0.8;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  artwork: {
    width: artworkSize,
    height: artworkSize,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  artworkPlaceholder: {
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
  },
  songInfo: {
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  artist: {
    fontSize: 18,
    color: "#666",
    marginTop: 4,
  },
  progressContainer: {
    width: "100%",
    marginBottom: 20,
  },
  progressBarBackground: {
    width: "100%",
    height: 6,
    backgroundColor: "#eee",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarForeground: {
    height: "100%",
    backgroundColor: "#007AFF",
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  timeText: {
    fontSize: 12,
    color: "#888",
  },
  controlsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  controlButton: {
    padding: 10,
    marginHorizontal: 10,
  },
  playButton: {
    backgroundColor: "#007AFF",
    borderRadius: 35,
    width: 70,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
  },
});
