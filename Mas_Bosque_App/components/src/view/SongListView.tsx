/**
 * View: src/views/SongListView.tsx
 *
 * Renders the song list.
 * Now logs when a song is pressed.
 */

import React, { useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  ListRenderItem,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Song } from "../models/songModel"; // Corrected path
import Logger from "../utils/Logger"; // <-- Import Logger

// ... Prop interfaces (no changes) ...
interface SongListViewProps {
  songs: Song[];
  currentSongId: string | null;
  onSongPress: (song: Song) => void;
}

interface SongItemProps {
  song: Song;
  isPlaying: boolean;
  onSongPress: (song: Song) => void;
}

// --- List Item Component ---

const SongItem: React.FC<SongItemProps> = ({
  song,
  isPlaying,
  onSongPress,
}) => {
  // Stable handler inside the component
  const handlePress = () => {
    // --- NEW LOGGING ---
    Logger.log(`Button Press: Select Song`, {
      title: song.title,
      id: song.id,
    });
    // --- END LOGGING ---
    onSongPress(song);
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.itemContainer}>
      <Image source={song.artwork} style={styles.itemArtwork} />
      <View style={styles.itemInfo}>
        <Text
          style={[styles.itemTitle, isPlaying && styles.playingText]}
          numberOfLines={1}
        >
          {song.title}
        </Text>
        <Text
          style={[styles.itemArtist, isPlaying && styles.playingText]}
          numberOfLines={1}
        >
          {song.artist}
        </Text>
      </View>
      {isPlaying && (
        <Ionicons
          name="volume-medium"
          size={20}
          color="#007AFF"
          style={styles.playingIcon}
        />
      )}
    </TouchableOpacity>
  );
};

// ... MemoizedSongItem (no changes) ...
const MemoizedSongItem = React.memo(SongItem);

// ... Main Component (no changes) ...
export const SongListView: React.FC<SongListViewProps> = ({
  songs,
  currentSongId,
  onSongPress,
}) => {
  // Replaced FlatList with a standard div and .map()
  // This is more suitable for a web environment.
  return (
    <View>
      {songs.map((item) => (
        <MemoizedSongItem
          key={item.id} // Key is placed on the mapped component
          song={item}
          isPlaying={item.id === currentSongId}
          onSongPress={onSongPress}
        />
      ))}
    </View>
  );
};
// ... Styles (no changes) ...
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  itemArtwork: {
    width: 50,
    height: 50,
    borderRadius: 4,
    marginRight: 15,
  },
  itemInfo: {
    flex: 1,
    marginRight: 10,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  itemArtist: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  playingText: {
    color: "#007AFF",
  },
  playingIcon: {
    marginLeft: 10,
  },
});
