import * as React from "react";
import {
  StyleSheet,
  View,
  TextInput,
  StyleProp,
  ViewStyle,
  Platform, // Import Platform
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Define the props for the component
type InputBarProps = {
  /** The current value of the search input. */
  value: string;
  /** Callback that is called when the text input's text changes. */
  onChangeText: (text: string) => void;
  /** The string that will be rendered before text input has been entered. */
  placeholder?: string;
  /** Optional style to override the main container. */
  style?: StyleProp<ViewStyle>;
};

const InputBar = ({
  value,
  onChangeText,
  placeholder = "",
  style,
}: InputBarProps) => {
  return (
    // This is the main "pill" container.
    // Note it does NOT have flex: 1, so it will fit into its parent.
    <View style={[styles.searchField, style]}>
      {/* This frame holds the search icon and the text input.
          It has 'flex: 1' so it expands, pushing the mic to the right. */}
      <View style={styles.frame}>
        <TextInput
          style={styles.textInput}
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={value}
          onChangeText={onChangeText}
          // --- ADD THESE PROPS ---
          cursorColor="#04FF0C" // A bright green color
          selectionColor="rgba(52, 211, 153, 0.3)" // A semi-transparent green for highlighting
          // --- END OF ADDITIONS ---
        />
      </View>
    </View>
  );
};

// --- Styles ---

const styles = StyleSheet.create({
  searchField: {
    // These styles create the "pill" shape from your Figma
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    paddingHorizontal: 11, // Use horizontal padding
    paddingVertical: 11, // Use vertical padding
    flexDirection: "row", // Lays out children (frame, mic) horizontally
    alignItems: "center", // Centers children vertically
    width: "auto",
  },
  frame: {
    // This frame holds the search icon and the text input
    flex: 1, // <-- This is KEY. It expands to fill available space
    flexDirection: "row",
    alignItems: "center",
    gap: 8, // From your original Figma style
  },
  icon: {
    // A small tweak to align icons better with the text
    lineHeight: 22, // Matches the textInput's lineHeight
  },
  textInput: {
    // Based on your 'text' style
    fontSize: 17,
    letterSpacing: -0.08,
    lineHeight: 22,
    // Use 'SF Pro' on iOS, fallback to default system font on Android
    fontFamily: Platform.OS === "ios" ? "SF Pro" : undefined,
    color: "#FFF", // This is the color of the *typed* text
    textAlign: "left",

    // Make it functional
    flex: 1, // Fills the 'frame'
    // Remove default web/android padding
    padding: 0,
    margin: 0,
  },
});

export default InputBar;
