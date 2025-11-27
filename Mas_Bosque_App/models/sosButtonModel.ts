// model.ts
import { Animated } from "react-native";

export const HOLD_DURATION = 1000;

export function createAnimationValue() {
  return new Animated.Value(0);
}

export function startProgressAnimation(progress: Animated.Value) {
  return Animated.timing(progress, {
    toValue: 1,
    duration: HOLD_DURATION,
    useNativeDriver: false,
  });
}

export function resetProgressAnimation(progress: Animated.Value) {
  return Animated.timing(progress, {
    toValue: 0,
    duration: 100,
    useNativeDriver: false,
  });
}
