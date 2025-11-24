import React, { useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";

interface ButtonProps {
  onLongPressComplete: () => void;
  isDisabled?: boolean;
  isCooldown?: boolean;
}

function SOSButton({
  onLongPressComplete,
  isDisabled,
  isCooldown,
}: ButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;
  const holdDuration = 1000; // 1 second hold
  const holdTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handlePressIn = () => {
    if (isDisabled || isCooldown) return;

    setIsPressed(true);

    Animated.timing(progress, {
      toValue: 1,
      duration: holdDuration,
      useNativeDriver: false,
    }).start();

    holdTimeout.current = setTimeout(() => {
      onLongPressComplete();
    }, holdDuration);
  };

  const handlePressOut = () => {
    setIsPressed(false);

    if (holdTimeout.current) {
      clearTimeout(holdTimeout.current);
      holdTimeout.current = null;
    }

    Animated.timing(progress, {
      toValue: 0,
      duration: 100,
      useNativeDriver: false,
    }).start();
  };

  const backgroundColor = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [isCooldown ? "#000" : "#1B251F", "#640000"],
  });

  const borderColor = isCooldown ? "#333" : "#640000";
  const label = isCooldown ? "SOS SENT" : "SOS";

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.wrapper}
      disabled={isDisabled || isCooldown}
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

export default SOSButton;
