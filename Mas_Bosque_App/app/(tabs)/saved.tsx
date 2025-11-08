import { useRoute } from "@react-navigation/native";
import { Text, View } from "react-native";
import SOSButton from '../(sos)/Button';

export default function Explore() {
  // Get triggerSOS from initialParams passed by TabLayout
  const route = useRoute();
  // @ts-ignore
  const triggerSOS = route.params?.triggerSOS;

  const handleSOS = async () => {
    if (typeof triggerSOS === 'function') {
      await triggerSOS();
    }

    console.log("SOS PRESSED!");
  };

  return (
    <View>
      <Text>Saved!</Text>
      <SOSButton onSOSActivated={handleSOS} />
    </View>
  );
}
