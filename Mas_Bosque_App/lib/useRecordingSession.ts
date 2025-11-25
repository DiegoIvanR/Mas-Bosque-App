import { useState, useRef, useEffect } from "react";
import * as Location from "expo-location";
import { haversineDistance } from "@/lib/helpers";
import { InterestPoint } from "@/lib/database";

export interface RecordingState {
  isRecording: boolean;
  currentLocation: Location.LocationObject | null;
  heading: Location.HeadingData | null;
  elapsedTime: number;
  distanceTraveled: number;
  routePath: { latitude: number; longitude: number }[];
  interestPoints: InterestPoint[];
  startTime: string | null;
}

export function useRecordingSession() {
  const [state, setState] = useState<RecordingState>({
    isRecording: false,
    currentLocation: null,
    heading: null,
    elapsedTime: 0,
    distanceTraveled: 0,
    routePath: [],
    interestPoints: [],
    startTime: null,
  });

  const locationSubscription = useRef<Location.LocationSubscription | null>(
    null
  );
  const headingSubscription = useRef<Location.LocationSubscription | null>(
    null
  );
  const timerInterval = useRef<NodeJS.Timeout | null>(null);
  const lastLocation = useRef<Location.LocationObject | null>(null);

  const startRecording = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return;

    setState((prev) => ({
      ...prev,
      isRecording: true,
      startTime: new Date().toISOString(),
      routePath: [],
      interestPoints: [],
      elapsedTime: 0,
      distanceTraveled: 0,
    }));

    locationSubscription.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 1000,
        distanceInterval: 5,
      },
      (newLoc) => {
        let dist = 0;
        if (lastLocation.current) {
          dist = haversineDistance(lastLocation.current.coords, newLoc.coords);
        }

        const newPoint = {
          latitude: newLoc.coords.latitude,
          longitude: newLoc.coords.longitude,
        };

        setState((prev) => ({
          ...prev,
          currentLocation: newLoc,
          distanceTraveled: prev.distanceTraveled + dist,
          routePath: [...prev.routePath, newPoint],
        }));

        lastLocation.current = newLoc;
      }
    );

    headingSubscription.current = await Location.watchHeadingAsync(
      (newHeading) => {
        setState((prev) => ({ ...prev, heading: newHeading }));
      }
    );

    timerInterval.current = setInterval(() => {
      setState((prev) => ({ ...prev, elapsedTime: prev.elapsedTime + 1 }));
    }, 1000);
  };

  const stopRecording = () => {
    locationSubscription.current?.remove();
    headingSubscription.current?.remove();
    if (timerInterval.current) clearInterval(timerInterval.current);

    setState((prev) => ({ ...prev, isRecording: false }));
    lastLocation.current = null;
  };

  const addInterestPoint = (type: InterestPoint["type"], note?: string) => {
    if (!state.currentLocation) return;

    // No ID needed here yet. SQLite will assign one later,
    // and Supabase will assign a UUID eventually.
    const newPoint: InterestPoint = {
      // id: undefined,
      latitude: state.currentLocation.coords.latitude,
      longitude: state.currentLocation.coords.longitude,
      type: type,
      note: note,
      created_at: new Date().toISOString(),
    };

    setState((prev) => ({
      ...prev,
      interestPoints: [...prev.interestPoints, newPoint],
    }));
  };

  useEffect(() => {
    return () => stopRecording();
  }, []);

  return {
    ...state,
    startRecording,
    stopRecording,
    addInterestPoint,
  };
}
