import { createClient } from '@supabase/supabase-js';
import * as Location from 'expo-location';
import React, { useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text
} from 'react-native';

interface ButtonProps {
  onSOSActivated: () => Promise<void>;
}

function Button({ onSOSActivated }: ButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [latitude, setLatitude] = useState(Number);
  const [longitude, setLongitude] = useState(Number);
  const progress = useRef(new Animated.Value(0)).current;
  const holdDuration = 1; // 5 seconds
  const holdTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // const supabase = createClient(process.env.EXPO_PUBLIC_SUPABASE_URL!, process.env.EXPO_PUBLIC_SUPABASE_KEY!)
  const supabase = createClient(process.env.EXPO_PUBLIC_SUPABASE_URL!, process.env.EXPO_PUBLIC_SUPABASE_KEY!)


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
        // Get the user location
        const location = await Location.getCurrentPositionAsync({});
        setLatitude(location.coords.latitude)
        setLongitude(location.coords.longitude);

        // Get the user id
        const { data: { user } } = await supabase.auth.getUser();
        const userId = user?.id;

        // Get the timestamp
        const timestamp: string = new Date().toISOString();

        // Make the api call
        const { data: todos, error } = await supabase
          .from('SOS')
          .insert({
            user_id: userId,
            latitud: latitude,
            longitud: longitude,
            timestamp_inicio: timestamp,
          });
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
