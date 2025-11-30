// view.tsx
import React from "react";
import { Animated, Pressable, Text, StyleSheet } from "react-native";

interface SOSButtonViewProps {
  progress: Animated.Value;
  onPressIn: () => void;
  onPressOut: () => void;
  isDisabled?: boolean;
  isCooldown?: boolean;
}

export function SOSButtonView({
  progress,
  onPressIn,
  onPressOut,
  isDisabled,
  isCooldown,
}: SOSButtonViewProps) {
  const backgroundColor = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [isCooldown ? "#000" : "#1B251F", "#640000"],
  });

  const borderColor = isCooldown ? "#333" : "#640000";
  const label = isCooldown ? "SOS SENT" : "SOS";

  return (
    <Pressable
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={isDisabled || isCooldown}
      style={styles.wrapper}
    >
      <Animated.View style={[styles.button, { backgroundColor, borderColor }]}>
        <Text style={[styles.text, isCooldown && styles.cooldownText]}>
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    width: 140,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  cooldownText: {
    color: "#8E8E93",
  },
});
