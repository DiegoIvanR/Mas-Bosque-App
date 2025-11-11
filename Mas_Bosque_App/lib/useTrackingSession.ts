import { useState, useEffect, useRef } from "react";
import * as Location from "expo-location";
import { haversineDistance } from "@/lib/helpers"; // We will create this helper

export interface TrackingState {
  location: Location.LocationObject | null;
  heading: Location.HeadingData | null;
  elapsedTime: number; // in seconds
  distanceTraveled: number; // in kilometers
}

export function useTrackingSession() {
  const [state, setState] = useState<TrackingState>({
    location: null,
    heading: null,
    elapsedTime: 0,
    distanceTraveled: 0,
  });

  // Refs to hold subscriptions and intervals
  const locationSubscription = useRef<Location.LocationSubscription | null>(
    null
  );
  const headingSubscription = useRef<Location.LocationSubscription | null>(
    null
  );
  const timerInterval = useRef<NodeJS.Timeout | null>(null);
  const lastLocation = useRef<Location.LocationObject | null>(null);

  // Function to start all tracking
  const startSession = async () => {
    // 1. Check permissions
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.error("Location permission denied");
      // Optionally set an error state
      return;
    }

    // 2. Start location tracking
    locationSubscription.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 1000,
        distanceInterval: 5, // Update every 5 meters
      },
      (newLocation) => {
        let newDistance = 0;
        if (lastLocation.current) {
          newDistance = haversineDistance(
            lastLocation.current.coords,
            newLocation.coords
          );
        }

        setState((prevState) => ({
          ...prevState,
          location: newLocation,
          distanceTraveled: prevState.distanceTraveled + newDistance,
        }));
        lastLocation.current = newLocation;
      }
    );

    // 3. Start heading tracking
    headingSubscription.current = await Location.watchHeadingAsync(
      (newHeading) => {
        setState((prevState) => ({ ...prevState, heading: newHeading }));
      }
    );

    // 4. Start timer
    timerInterval.current = setInterval(() => {
      setState((prevState) => ({
        ...prevState,
        elapsedTime: prevState.elapsedTime + 1,
      }));
    }, 1000);
  };

  // Function to stop all tracking
  const stopSession = () => {
    if (locationSubscription.current) {
      locationSubscription.current.remove();
    }
    if (headingSubscription.current) {
      headingSubscription.current.remove();
    }
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
    }
    lastLocation.current = null;
  };

  // Start session on mount, stop on unmount
  useEffect(() => {
    startSession();

    // Cleanup function
    return () => {
      stopSession();
    };
  }, []); // Empty array ensures this runs once on mount

  return { ...state, stopSession };
}
