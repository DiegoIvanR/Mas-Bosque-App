import { useState } from "react"
import { Text, View } from "react-native";
import SOSButton from '../(sos)/Button';
import SOSConfirmation from "../(sos)/SOSConfirmation";

export default function Explore() {
  const [sosTriggered, setSOSTriggered] = useState(false);

  const triggerSOS = async () => {
      // Example API call
      await Promise.resolve();
      console.log("SOS PRESSED!")
      setSOSTriggered(true);
    };

    const handleSelect = (emergency: string) => {
      console.log('Selected:', emergency);
    };

    const handleSend = (emergency: string) => {
      console.log('Sending:', emergency);
    };

  return (
    <View>
      <Text>Saved!</Text>
      {!sosTriggered && <SOSButton onSOSActivated={triggerSOS} />}
      {sosTriggered && <SOSConfirmation 
      onEmergencySelected={handleSelect} 
      onSend={handleSend}
      />}
    </View>
  );
}
