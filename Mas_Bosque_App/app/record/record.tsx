import { View, StyleSheet } from "react-native";
import { RecordingView } from "@/components/Record/RecordingView";
import GoBackButton from "@/components/Helpers/GoBackButton";
import RouteSubmissionForm from "@/components/Record/RouteSubmissionForm";
import LoadingScreen from "@/views/LoadingScreen";
import useRecordController from "@/hooks/recordController";

export default function RecordScreen() {
  const {
    session,
    isProcessing,
    handleStart,
    handleStop,
    handleAddPoint,
    showForm,
    handleCancelForm,
    handleFormSubmit,
  } = useRecordController();

  if (isProcessing) return <LoadingScreen />;

  return (
    <View style={styles.container}>
      <GoBackButton
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          zIndex: 100,
          transform: [{ rotate: "270deg" }], // Fixed invalid syntax here
        }}
        backgroundColor={"rgba(30, 30, 30, 0.85)"}
      />

      <RecordingView
        state={session}
        onStart={handleStart}
        onStop={handleStop}
        onAddPoint={handleAddPoint}
      />

      <RouteSubmissionForm
        visible={showForm}
        onCancel={handleCancelForm}
        onSubmit={handleFormSubmit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00160B",
  },
  // Removed unused goBackButton style to avoid confusion
});
