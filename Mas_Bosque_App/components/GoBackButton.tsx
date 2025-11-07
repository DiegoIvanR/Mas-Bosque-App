import React from "react";
import {
  StyleSheet,
  Pressable,
  ViewStyle,
  StyleProp,
  ColorValue,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type GoBackButtonProps = {
  /** The function to call when the button is pressed. */
  onClick: () => void;
  /** The background color of the circle. */
  backgroundColor?: ColorValue;
  /** The color of the arrow line. */
  lineColor?: ColorValue;
  /** Optional custom styles for the button's container. */
  style?: StyleProp<ViewStyle>;
};

const GoBackButton = ({
  onClick,
  backgroundColor = "rgba(120, 120, 128, 0.32)",
  lineColor = "#AEAEB2",
  style,
}: GoBackButtonProps) => {
  return (
    <Pressable
      onPress={onClick}
      style={({ pressed }) => [
        styles.container,
        { backgroundColor }, // Apply the background color here
        pressed && styles.pressed, // Add a pressed effect
        style,
      ]}
    >
      <Ionicons
        name="chevron-back"
        size={24}
        color={lineColor} // Apply the line color here
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 44, // Standard iOS touch target size
    height: 44, // Standard iOS touch target size
    borderRadius: 22, // Make it a perfect circle
    justifyContent: "center",
    alignItems: "center",
  },
  pressed: {
    opacity: 0.7, // Add visual feedback for press
  },
});

export default GoBackButton;
