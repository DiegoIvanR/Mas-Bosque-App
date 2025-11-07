import { Text, View } from "react-native";
import SOSButton from '../(sos)/Button';

export default function Explore() {
  const triggerSOS = async () => {
      // Example API call
      await Promise.resolve();
      console.log("SOS PRESSED")
    };

  return (
    <View>
      <Text>Saved!</Text>
      <SOSButton onSOSActivated={triggerSOS} />
    </View>
  );
}
