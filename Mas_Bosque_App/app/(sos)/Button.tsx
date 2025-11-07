import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  Pressable, 
  StyleSheet, 
  Animated 
} from 'react-native';

interface ButtonProps {
  onSOSActivated: () => Promise<void>;
}

function Button({ onSOSActivated }: ButtonProps) {
    const [isPressed, setIsPressed] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;
  const holdDuration = 5000; // 5 seconds
  const holdTimeout = useRef<NodeJS.Timeout | null>(null);

  const handlePressIn = () => {
    setIsPressed(true);

    // Animate progress fill
    Animated.timing(progress, {
      toValue: 1,
      duration: holdDuration,
      useNativeDriver: false,
    }).start();

    // After 5 seconds, trigger SOS
    holdTimeout.current = setTimeout(async () => {
      try {
        await onSOSActivated();
      } catch (e) {
        console.error('SOS activation failed:', e);
      }
    }, holdDuration);
  };

  const handlePressOut = () => {
    setIsPressed(false);

    // Stop everything if released early
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

  // Interpolate fill color intensity
  const backgroundColor = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['#1B251F', '#640000'],
  });

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.wrapper}
    >
      <Animated.View style={[styles.button, { backgroundColor }]}>
        <Text style={styles.text}>SOS</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: 140,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#640000',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1B251F',
  },
  text: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Button;
