import * as React from "react";
import {
  StyleSheet,
  View,
  Pressable,
  StyleProp,
  ViewStyle,
  Platform,
  Text,
} from "react-native";

// 1. Rename type
type ButtonProps = {
  /** The text to display inside the button. */
  value: string;
  /** Callback that is called when the button is pressed. */
  onClick: () => void;
  /** Optional custom background color. */
  backgroundColor?: string;
  /** Optional custom border color. */
  borderColor?: string;
  /** Optional custom text color. */
  textColor?: string;
  /** If true, the button will be grayed out and unpressable. */
  disabled?: boolean; // 2. Add disabled prop
};

// 3. Rename component
const Button = ({
  value,
  onClick,
  backgroundColor = "#FFFFFF",
  borderColor = "rgba(0, 0, 0, 0)",
  textColor = "#00160a",
  disabled = false, // 4. Use disabled prop
}: ButtonProps) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.pressable,
        { backgroundColor: backgroundColor, borderColor: borderColor },
        // 5. Add styles for pressed and disabled
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
      ]}
      onPress={onClick}
      disabled={disabled} // 6. Pass disabled to Pressable
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
    width: "100%", // <-- THIS WAS THE SQUISHED BUG!! (was "auto")
    height: 50,
  },
  // 7. Add new styles
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.5,
  },
});

// 8. Rename export
export default Button;
