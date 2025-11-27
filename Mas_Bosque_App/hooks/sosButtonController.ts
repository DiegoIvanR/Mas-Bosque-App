import { MutableRefObject } from "react";
import { Animated } from "react-native";
import {
  HOLD_DURATION,
  startProgressAnimation,
  resetProgressAnimation,
} from "@/models/sosButtonModel";

export function createSOSController(
  progress: Animated.Value,
  onLongPressComplete: () => void,
  isDisabled?: boolean,
  isCooldown?: boolean
) {
  // Use `number | null` for compatibility with React Native's `setTimeout`
  const holdTimeout: MutableRefObject<ReturnType<typeof setTimeout> | null> = {
    current: null,
  };

  const handlePressIn = () => {
    if (isDisabled || isCooldown) return;

    // Start the progress animation
    startProgressAnimation(progress).start();

    // Set a timeout to trigger the long press action
    holdTimeout.current = setTimeout(() => {
      onLongPressComplete();
    }, HOLD_DURATION);
  };

  const handlePressOut = () => {
    // Clear the timeout if the press is released early
    if (holdTimeout.current) {
      clearTimeout(holdTimeout.current);
      holdTimeout.current = null;
    }

    // Reset the progress animation
    resetProgressAnimation(progress).start();
  };

  return { handlePressIn, handlePressOut };
}
