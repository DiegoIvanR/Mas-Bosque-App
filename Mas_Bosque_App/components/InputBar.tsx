import * as React from "react";
import {
  StyleSheet,
  View,
  TextInput,
  StyleProp,
  ViewStyle,
  Platform,
  Pressable, // Import Pressable for the icon button
  ColorValue,
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

  // --- NEW PROPS ---
  /** If true, the input is not editable. */
  disabled?: boolean;
  /** If true, the text input obscures the text entered. */
  secureTextEntry?: boolean;
  /** A callback to toggle the secureTextEntry state. If provided, an eye icon is shown. */
  onToggleSecureEntry?: () => void;

  // --- Pass-through props for convenience ---
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  cursorColor?: ColorValue;
  selectionColor?: ColorValue;
};

const InputBar = ({
  value,
  onChangeText,
  placeholder = "",
  style,
  disabled = false,
  secureTextEntry = false,
  onToggleSecureEntry,
  autoCapitalize = "none",
  cursorColor = "#06D23C",
  selectionColor = "#06D23C",
}: InputBarProps) => {
  return (
    // This is the main container. It grays out when disabled.
    <View
      style={[
        styles.searchField,
        disabled && styles.disabled, // Apply disabled style
        style,
      ]}
    >
      {/* This frame holds the text input and the icon */}
      <View style={styles.frame}>
        <TextInput
          style={styles.textInput}
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={value}
          onChangeText={onChangeText}
          editable={!disabled} // Use the disabled prop
          secureTextEntry={secureTextEntry} // Use the secureTextEntry prop
          autoCapitalize={autoCapitalize} // Pass through
          cursorColor={cursorColor}
          selectionColor={selectionColor}
        />
      </View>

      {/* If onToggleSecureEntry is provided, show the eye icon */}
      {onToggleSecureEntry && (
        <Pressable onPress={onToggleSecureEntry} hitSlop={10}>
          <Ionicons
            name={secureTextEntry ? "eye-off-outline" : "eye-outline"}
            size={22}
            color="#999"
            style={styles.icon}
          />
        </Pressable>
      )}
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
  disabled: {
    backgroundColor: "#333", // Darker background when disabled
    borderColor: "#666", // Dimmer border
  },
  frame: {
    // This frame holds the text input
    flex: 1, // <-- This is KEY. It expands to fill available space
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    // A small tweak to align icons better with the text
    lineHeight: 22, // Matches the textInput's lineHeight
    marginLeft: 8, // Add space between text input and icon
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
