import {MutableRefObject} from "react";
import {Animated} from "react-native";
import {
    HOLD_DURATION,
    startProgressAnimation,
    resetProgressAnimation,
} from "@/models/sosButtonModel";
import Logger from "@/utils/Logger"; // Import Logger

export function createSOSController(
    progress: Animated.Value,
    onLongPressComplete: () => void,
    isDisabled?: boolean,
    isCooldown?: boolean
) {
    const holdTimeout: MutableRefObject<ReturnType<typeof setTimeout> | null> = {
        current: null,
    };

    const handlePressIn = () => {
        if (isDisabled || isCooldown) {
            Logger.log("SOS Press ignored (Disabled or Cooldown)", {
                isDisabled,
                isCooldown,
            });
            return;
        }

        Logger.log("SOS Button Press initiated");
        startProgressAnimation(progress).start();

        holdTimeout.current = setTimeout(() => {
            Logger.warn("SOS Long Press Completed - Triggering Action");
            try {
                onLongPressComplete?.();
            } catch (err) {
                Logger.error("Error executing SOS action", err);
            }
        }, HOLD_DURATION);
    };

    const handlePressOut = () => {
        if (holdTimeout.current) {
            // If we are clearing the timeout, it means the user let go before the SOS triggered
            Logger.log("SOS Button released early - Action cancelled");
            clearTimeout(holdTimeout.current);
            holdTimeout.current = null;
        }

        resetProgressAnimation(progress).start();
    };

    return {handlePressIn, handlePressOut};
}
