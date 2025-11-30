// index.tsx
import React, { useRef } from "react";
import { createAnimationValue } from "@/models/sosButtonModel";
import { createSOSController } from "@/hooks/sosButtonController";
import { SOSButtonView } from "@/views/sosView";

interface ButtonProps {
  onLongPressComplete: () => void;
  isDisabled?: boolean;
  isCooldown?: boolean;
}

export default function SOSButton(props: ButtonProps) {
  const progress = useRef(createAnimationValue()).current;

  const { handlePressIn, handlePressOut } = createSOSController(
    progress,
    props.onLongPressComplete,
    props.isDisabled,
    props.isCooldown
  );

  return (
    <SOSButtonView
      progress={progress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      isDisabled={props.isDisabled}
      isCooldown={props.isCooldown}
    />
  );
}
