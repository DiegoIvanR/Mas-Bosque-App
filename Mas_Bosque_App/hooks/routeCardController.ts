// controller.ts
import { useState, useEffect } from "react";
import { router } from "expo-router";
import { updateRouteSaveStatus, RoutePreview } from "@/models/routeCardModel";

export function useRouteCardController(route: RoutePreview) {
  const [isSaved, setIsSaved] = useState(route.saved || false);

  // Sync UI state when parent re-fetches data
  useEffect(() => {
    setIsSaved(route.saved || false);
  }, [route.saved]);

  const onPressCard = () => {
    if (!route.id) {
      console.error("Route ID is missing.");
      return;
    }
    router.push(`/route/${route.id}`);
  };

  const onToggleSave = (e: any) => {
    e.stopPropagation();

    const newState = !isSaved;
    setIsSaved(newState);

    updateRouteSaveStatus(route.id, newState);
  };

  return {
    isSaved,
    onPressCard,
    onToggleSave,
  };
}
