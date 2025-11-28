import { useRouteSubmission } from "@/hooks/routeSubmissionController";
import RouteSubmissionFormView from "./RouteSubmissionView";

type Props = {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (data: {
    name: string;
    difficulty: "Easy" | "Medium" | "Hard";
    imageUri: string | null;
  }) => void;
};

export default function RouteSubmissionForm({
  visible,
  onCancel,
  onSubmit,
}: Props) {
  const {
    name,
    setName,
    difficulty,
    setDifficulty,
    pickImage,
    imageUri,
    handleSubmit,
  } = useRouteSubmission(onSubmit);
  return (
    <RouteSubmissionFormView
      visible={visible}
      onCancel={onCancel}
      name={name}
      setName={setName}
      difficulty={difficulty}
      setDifficulty={setDifficulty}
      pickImage={pickImage}
      imageUri={imageUri}
      handleSubmit={handleSubmit}
    />
  );
}
