/**
 * Controller: src/controllers/playerController.ts
 *
 * Manages all audio playback logic and error handling.
 * Now includes logging for all actions and native Alert for errors.
 */

import { Audio, AVPlaybackStatus } from "expo-av";
import { Alert } from "react-native"; // <-- Import Alert
import { Song } from "../models/songModel";
import Logger from "../utils/Logger"; // <-- Import Logger

export interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  positionMillis: number;
  durationMillis: number;
}

export const INITIAL_PLAYER_STATE: PlayerState = {
  currentSong: null,
  isPlaying: false,
  positionMillis: 0,
  durationMillis: 0,
};

type StateChangeCallback = (state: PlayerState) => void;

export class PlayerController {
  private sound: Audio.Sound | null = null;
  private songs: Song[];
  private currentSongIndex: number = -1;
  private onStateChange: StateChangeCallback;
  private internalState: PlayerState = INITIAL_PLAYER_STATE;

  constructor(songs: Song[], onStateChange: StateChangeCallback) {
    this.songs = songs;
    this.onStateChange = onStateChange;
    Logger.log("PlayerController constructed.");

    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
  }

  // --- Private Methods ---

  private updateState(newState: Partial<PlayerState>) {
    this.internalState = { ...this.internalState, ...newState };
    this.onStateChange(this.internalState);
  }

  private onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (!status.isLoaded) {
      if (this.internalState.isPlaying) {
        this.updateState({
          isPlaying: false,
          positionMillis: 0,
          durationMillis: 0,
        });
      }
      return;
    }

    this.updateState({
      positionMillis: status.positionMillis,
      durationMillis: status.durationMillis || 0,
      isPlaying: status.isPlaying,
    });

    if (status.didJustFinish && !status.isLooping) {
      Logger.log("Song finished, playing next.");
      this.skipToNext();
    }
  };

  private async loadSong(index: number) {
    if (this.sound) {
      await this.sound.unloadAsync();
    }

    const song = this.songs[index];
    if (!song) {
      Logger.error("loadSong: Invalid song index.", null, { index });
      return;
    }

    this.currentSongIndex = index;
    Logger.log(`Loading song: ${song.title}`, { id: song.id });

    try {
      const { sound } = await Audio.Sound.createAsync(
        song.file,
        { shouldPlay: true },
        this.onPlaybackStatusUpdate
      );

      this.sound = sound;
      this.updateState({
        currentSong: song,
        isPlaying: true,
      });
      Logger.log(`Successfully loaded and playing: ${song.title}`);
    } catch (e) {
      // --- NATIVE ERROR POP-UP ---
      const errorMessage = `Failed to load song: ${song.title}`;
      Logger.error(errorMessage, e, { songId: song.id });

      Alert.alert(
        "Playback Error",
        `${errorMessage}. The file may be missing or corrupt.`,
        [{ text: "OK" }]
      );
      // --- END NATIVE ERROR POP-UP ---

      this.updateState({ isPlaying: false, currentSong: song });
    }
  }

  // --- Public Control Methods ---

  public playSong = (song: Song) => {
    Logger.log("Executing: playSong", { title: song.title });
    const songIndex = this.songs.findIndex((s) => s.id === song.id);
    if (songIndex !== -1) {
      this.loadSong(songIndex);
    } else {
      Logger.warn("playSong: Song not found in list.", { id: song.id });
    }
  };

  public playPause = async () => {
    Logger.log("Executing: playPause");
    if (!this.sound) return;

    try {
      if (this.internalState.isPlaying) {
        await this.sound.pauseAsync();
      } else {
        await this.sound.playAsync();
      }
      // State update will be triggered by onPlaybackStatusUpdate
    } catch (e) {
      Logger.error("Error in playPause", e);
    }
  };

  public skipToNext = () => {
    Logger.log("Executing: skipToNext");
    if (this.songs.length === 0) return;
    const nextIndex = (this.currentSongIndex + 1) % this.songs.length;
    this.loadSong(nextIndex);
  };

  public skipToPrevious = () => {
    Logger.log("Executing: skipToPrevious");
    if (this.songs.length === 0) return;
    const prevIndex =
      (this.currentSongIndex - 1 + this.songs.length) % this.songs.length;
    this.loadSong(prevIndex);
  };

  public skipForward = async (amountMs: number = 10000) => {
    Logger.log("Executing: skipForward");
    if (!this.sound) return;
    const newPosition = this.internalState.positionMillis + amountMs;
    const duration = this.internalState.durationMillis;
    await this.sound.setPositionAsync(Math.min(newPosition, duration));
  };

  public skipBackward = async (amountMs: number = 10000) => {
    Logger.log("Executing: skipBackward");
    if (!this.sound) return;
    const newPosition = this.internalState.positionMillis - amountMs;
    await this.sound.setPositionAsync(Math.max(newPosition, 0));
  };

  public cleanup = () => {
    Logger.log("Cleaning up player controller.");
    this.sound?.unloadAsync();
  };
}
