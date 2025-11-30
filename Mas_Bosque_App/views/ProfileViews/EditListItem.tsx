import {
  Pressable,
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
type EditListItemProps = {
  label: string;
  value: string;
  onPress: () => void;
  isLast?: boolean;
};

// --- Reusable EditListItem Component ---
const EditListItem: React.FC<EditListItemProps> = ({
  label,
  value,
  onPress,
  isLast = false,
}) => (
  <Pressable style={styles.listItem} onPress={onPress}>
    <View style={styles.listItemContent}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.arrow}>&gt;</Text>
    </View>
    {!isLast && <View style={styles.separator} />}
  </Pressable>
);

const styles = StyleSheet.create({
  listItem: {} as ViewStyle,
  listItemContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
  } as ViewStyle,
  label: {
    color: "white",
    fontSize: 14,
    fontFamily: "Lato-Bold",
    fontWeight: "700",
    flex: 1,
  } as TextStyle,
  value: {
    color: "#999999",
    fontSize: 14,
    fontFamily: "Lato-Bold",
    fontWeight: "700",
    textAlign: "right",
    marginRight: 10,
    maxWidth: "50%",
  } as TextStyle,
  arrow: { color: "#404040", fontSize: 12, fontWeight: "700" } as TextStyle,
  separator: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    width: "100%",
  } as ViewStyle,
});

export default EditListItem;
