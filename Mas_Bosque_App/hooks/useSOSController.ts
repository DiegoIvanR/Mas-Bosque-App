import { useState, useRef, useEffect } from "react";
import { SOSModel } from "@/models/SOSModel";

export type SOSStatus =
  | "IDLE"
  | "SENDING_INITIAL"
  | "NEEDS_DETAILS"
  | "COOLDOWN";

export function useSOSController() {
  const [status, setStatus] = useState<SOSStatus>("IDLE");
  const [sosId, setSosId] = useState<string | null>(null);

  const retryInterval = useRef<NodeJS.Timeout | null>(null);
  const cooldownTimer = useRef<NodeJS.Timeout | null>(null);

  // 1. Start the SOS Process (Retry Loop)
  const activateSOS = () => {
    // Prevent double activation
    if (status !== "IDLE" && status !== "COOLDOWN") return;

    setStatus("SENDING_INITIAL");

    const trySending = async () => {
      console.log("Attempting to send SOS...");

      // Call your specific model which returns Promise<string | null>
      const returnedId = await SOSModel.createEmergencyAlert();

      // If we got an ID back, it was successful
      if (returnedId) {
        console.log("SOS Sent Successfully! ID:", returnedId);
        setSosId(returnedId);
        setStatus("NEEDS_DETAILS");

        // STOP THE LOOP
        if (retryInterval.current) {
          clearInterval(retryInterval.current);
          retryInterval.current = null;
        }
      } else {
        console.log("SOS Send failed (will retry in 3s)...");
      }
    };

    // Try immediately
    trySending();

    // Then set interval for retries
    if (retryInterval.current) clearInterval(retryInterval.current);
    retryInterval.current = setInterval(trySending, 3000);
  };

  // 2. Send Details and Start Cooldown
  const confirmEmergencyDetails = async (type: string) => {
    if (!sosId) return;

    const success = await SOSModel.updateEmergencyType(sosId, type);

    if (success) {
      startCooldown();
    } else {
      alert("Failed to send details. Please try again.");
    }
  };

  // 3. Cooldown Logic (5 Minutes)
  const startCooldown = () => {
    setStatus("COOLDOWN");
    setSosId(null);

    if (cooldownTimer.current) clearTimeout(cooldownTimer.current);

    // 5 minutes = 300,000 ms
    cooldownTimer.current = setTimeout(() => {
      setStatus("IDLE");
    }, 5 * 60 * 1000);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (retryInterval.current) clearInterval(retryInterval.current);
      if (cooldownTimer.current) clearTimeout(cooldownTimer.current);
    };
  }, []);

  return {
    status,
    sosId,
    activateSOS,
    confirmEmergencyDetails,
  };
}
