import React, { useState, useEffect } from "react";
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  Pressable,
  Animated,
  Easing,
  ActivityIndicator,
} from "react-native";
import Button from "@/components/Helpers/Button";
interface SOSConfirmationProps {
  onEmergencySelected: (type: string) => void;
  onSend: (type: string) => void;
  isSendingInitialSignal: boolean; // Controls title "Sending..." vs "Sent"
}

const GAP = 25;

export default function SOSConfirmation({
  onEmergencySelected,
  onSend,
  isSendingInitialSignal,
}: SOSConfirmationProps) {
  const [selectedEmergency, setSelectedEmergency] = useState<string>("");
  const [pickerVisible, setPickerVisible] = useState(false);

  const options = [
    { label: "Medical emergency", value: "medical" },
    { label: "Lost user", value: "lost" },
    { label: "Mechanical failure", value: "mechanical" },
  ];

  const OPTION_ROW_HEIGHT = 48;
  const DROPDOWN_BOX_PADDING = 16;
  const dropdownHeight =
    options.length * OPTION_ROW_HEIGHT + DROPDOWN_BOX_PADDING;

  const dropdownAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(dropdownAnim, {
      toValue: pickerVisible ? 1 : 0,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [pickerVisible]);

  const handleSend = () => {
    if (selectedEmergency) {
      onSend(selectedEmergency);
    }
  };

  // Determine Title based on status
  const titleText = isSendingInitialSignal
    ? "SOS Call Sending..."
    : "SOS Call Sent";
  // Disable form if we are still waiting for initial signal to send
  const isFormDisabled = isSendingInitialSignal;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{titleText}</Text>
        {isSendingInitialSignal && (
          <ActivityIndicator color="white" style={{ marginLeft: 10 }} />
        )}
      </View>

      <Text style={styles.subtitle}>
        {isFormDisabled ? "Please wait..." : "What is your emergency?"}
      </Text>

      {/* Picker */}
      <Pressable
        onPress={() => !isFormDisabled && setPickerVisible((v) => !v)}
        style={[styles.pickerWrapper, isFormDisabled && styles.disabledOpacity]}
        disabled={isFormDisabled}
      >
        <View pointerEvents="none" style={styles.pickerInner}>
          <Text
            style={[
              styles.pickerText,
              !selectedEmergency && { color: "#9b9b9b" },
            ]}
          >
            {selectedEmergency
              ? options.find((o) => o.value === selectedEmergency)?.label
              : "Select emergency"}
          </Text>
          <Text style={styles.caret}>{pickerVisible ? "▴" : "▾"}</Text>
        </View>
      </Pressable>

      <View style={[styles.dropdownSpacer, { height: dropdownHeight }]}>
        <Animated.View
          style={[
            styles.dropdownBox,
            { height: dropdownHeight },
            {
              opacity: dropdownAnim,
              transform: [
                {
                  translateY: dropdownAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-dropdownHeight, 0],
                  }),
                },
              ],
            },
          ]}
        >
          {options.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              style={styles.dropdownOption}
              onPress={() => {
                setSelectedEmergency(opt.value);
                onEmergencySelected(opt.value);
                setPickerVisible(false);
              }}
            >
              <Text style={styles.dropdownOptionText}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </Animated.View>
      </View>

      <TouchableOpacity
        style={[
          styles.sendButton,
          (!selectedEmergency || isFormDisabled) && styles.disabledButton,
        ]}
        disabled={!selectedEmergency || isFormDisabled}
        onPress={handleSend}
      >
        <Text style={styles.sendButtonText}>Send emergency type</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: "center",
    width: "100%",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "600",
  },
  subtitle: {
    color: "#FFFFFF",
    fontSize: 16,
    marginBottom: 20,
  },
  pickerWrapper: {
    backgroundColor: "#FFFFFF",
    borderRadius: 25,
    width: "90%",
    marginBottom: GAP,
  },
  pickerInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  pickerText: {
    color: "#000000",
    fontSize: 16,
  },
  caret: {
    color: "#000000",
    fontSize: 20,
    marginLeft: 8,
  },
  dropdownBox: {
    backgroundColor: "#fff",
    borderRadius: 14,
    width: "100%",
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },
  dropdownOption: {
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  dropdownOptionText: {
    fontSize: 16,
    color: "#111",
  },
  dropdownSpacer: {
    width: "90%",
    marginBottom: GAP,
    alignItems: "center",
    justifyContent: "flex-start",
    overflow: "hidden",
  },
  sendButton: {
    backgroundColor: "#200101",
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 30,
    marginTop: 0,
    alignItems: "center",

    width: "90%",
    height: 60,
    justifyContent: "center",
  },
  sendButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: "#4a2a2a",
  },
  disabledOpacity: {
    opacity: 0.6,
  },
});
