import * as React from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Pressable,
  StyleProp,
  ViewStyle,
  Platform,
  Text, // Import Platform
} from "react-native";

// Define the props for the component
type InputBarProps = {
  /** The current value of the search input. */
  value: string;
  /** Callback that is called when the text input's text changes. */
  onClick: () => void;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
};

const InputBar = ({
  value,
  onClick,
  backgroundColor = "#FFFFFF",
  borderColor = "rgba(0, 0, 0, 0)",
  textColor = "#00160a",
}: InputBarProps) => {
  return (
    // This is the main "pill" container.
    // Note it does NOT have flex: 1, so it will fit into its parent.
    <Pressable
      style={[
        styles.pressable,
        { backgroundColor: backgroundColor, borderColor: borderColor },
      ]}
      onPress={onClick}
    >
      <View style={styles.frame}>
        <Text style={[styles.text, { color: textColor }]}>{value}</Text>
      </View>
    </Pressable>
  );
};

// --- Styles ---

const styles = StyleSheet.create({
  frame: {
    // This frame holds the search icon and the text input
    flex: 1, // <-- This is KEY. It expands to fill available space
    flexDirection: "row",
    alignItems: "center",
    gap: 8, // From your original Figma style
  },
  text: {
    // Based on your 'text' style
    fontSize: 17,
    letterSpacing: -0.08,
    lineHeight: 22,
    // Use 'SF Pro' on iOS, fallback to default system font on Android

    fontFamily: "SF Pro Rounded",
    textAlign: "center",

    // Make it functional
    flex: 1, // Fills the 'frame'
    // Remove default web/android padding
    padding: 0,
    margin: 0,

    fontWeight: "500",
  },
  pressable: {
    borderRadius: 1000,
    borderWidth: 2,
    paddingHorizontal: 11, // Use horizontal padding
    paddingVertical: 11, // Use vertical padding
    flexDirection: "row", // Lays out children (frame, mic) horizontally
    alignItems: "center", // Centers children vertically
    width: "auto",
    height: 50,
  },
});

export default InputBar;
