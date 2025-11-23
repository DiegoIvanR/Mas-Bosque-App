/**
 * Model: src/models/songsModel.ts
 *
 * This file defines the data structure for a Song
 * and provides a mock list of songs for the application.
 *
 * In a real app, this data might come from an API,
 * local device storage, or a database.
 */

// TypeScript interface for a single song object.
export interface Song {
  id: string;
  title: string;
  artist: string;
  // `artwork` and `file` use `any` to accommodate the `require()` syntax.
  // `require` returns a number (resource ID) in React Native.
  artwork: any;
  file: any;
}

// Mock song data.
// Replace file and artwork paths with your actual assets.
//
// 1. Add your .mp3 files to /assets/songs/
// 2. Add your cover art .jpg files to /assets/images/
//
export const SONGS: Song[] = [
  {
    id: "1",
    title: "Don Quijote Marihuana",
    artist: "Brujería",
    artwork: require("@/assets/images/don_quijote_marihuana.jpg"),
    file: require("@/assets/songs/don_quijote_marihuana.mp3"),
  },
  {
    id: "2",
    title: "Digital Sunrise",
    artist: "SynthWave",
    artwork: null,
    file: null, // <-- THIS IS THE PROBLEM
  },
];
