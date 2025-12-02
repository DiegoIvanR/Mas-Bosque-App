import { useSOSConfirmation } from "@/hooks/useSOSController";
import SOSConfirmationView from "@/views/SOSConfirmationView";
interface SOSConfirmationProps {
  onEmergencySelected: (type: string) => void;
  onSend: (type: string) => void;
  isSendingInitialSignal: boolean; // Controls title "Sending..." vs "Sent"
}

export default function SOSConfirmation({
  onEmergencySelected,
  onSend,
  isSendingInitialSignal,
}: SOSConfirmationProps) {
  const {
    titleText,
    isFormDisabled,
    pickerVisible,
    setPickerVisible,
    selectedEmergency,
    options,
    dropdownHeight,
    dropdownAnim,
    handleSend,
    setSelectedEmergency,
  } = useSOSConfirmation({ onSend, isSendingInitialSignal });

  return (
    <SOSConfirmationView
      titleText={titleText}
      isSendingInitialSignal={isSendingInitialSignal}
      isFormDisabled={isFormDisabled}
      pickerVisible={pickerVisible}
      setPickerVisible={setPickerVisible}
      selectedEmergency={selectedEmergency}
      setSelectedEmergency={setSelectedEmergency}
      options={options}
      dropdownHeight={dropdownHeight}
      dropdownAnim={dropdownAnim}
      handleSend={handleSend}
      onEmergencySelected={onEmergencySelected}
    />
  );
}
