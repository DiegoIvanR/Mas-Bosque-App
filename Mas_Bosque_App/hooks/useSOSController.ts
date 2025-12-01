import {useState, useRef, useEffect} from "react";
import {SOSModel} from "@/models/SOSModel";
import Logger from "@/utils/Logger"; // Import Logger

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
        if (status !== "IDLE" && status !== "COOLDOWN") {
            Logger.warn("SOS activation ignored - process already active", {
                status,
            });
            return;
        }

        setStatus("SENDING_INITIAL");
        Logger.log("Starting SOS activation sequence");

        const trySending = async () => {
            Logger.log("Attempting to send SOS signal...");

            try {
                // Call your specific model which returns Promise<string | null>
                const returnedId = await SOSModel.createEmergencyAlert();

                // If we got an ID back, it was successful
                if (returnedId) {
                    Logger.log("SOS Sent Successfully!", {sosId: returnedId});
                    setSosId(returnedId);
                    setStatus("NEEDS_DETAILS");

                    // STOP THE LOOP
                    if (retryInterval.current) {
                        clearInterval(retryInterval.current);
                        retryInterval.current = null;
                    }
                } else {
                    Logger.warn("SOS Send failed (will retry in 3s)...");
                }
            } catch (error: any) {
                Logger.error("Exception during SOS transmission", error);
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
        if (!sosId) {
            Logger.error("Cannot confirm details: Missing SOS ID");
            return;
        }

        if (!type || type.trim() === "") {
            Logger.warn("Invalid emergency type provided");
            alert("Please select a valid emergency type.");
            return;
        }

        Logger.log("Sending emergency details...", {sosId, type});
        const success = await SOSModel.updateEmergencyType(sosId, type);

        if (success) {
            Logger.log("Emergency details confirmed successfully");
            startCooldown();
        } else {
            Logger.error("Failed to send emergency details", null, {sosId, type});
            alert("Failed to send details. Please try again.");
        }
    };

    // 3. Cooldown Logic (5 Minutes)
    const startCooldown = () => {
        Logger.log("Starting SOS Cooldown (5 minutes)");
        setStatus("COOLDOWN");
        setSosId(null);

        if (cooldownTimer.current) clearTimeout(cooldownTimer.current);

        // 5 minutes = 300,000 ms
        cooldownTimer.current = setTimeout(() => {
            Logger.log("SOS Cooldown finished, Status resetting to IDLE");
            setStatus("IDLE");
        }, 5 * 60 * 1000);
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (retryInterval.current) {
                clearInterval(retryInterval.current);
            }
            if (cooldownTimer.current) {
                clearTimeout(cooldownTimer.current);
            }
        };
    }, []);

    return {
        status,
        sosId,
        activateSOS,
        confirmEmergencyDetails,
    };
}
