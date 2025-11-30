import { useState, useEffect } from "react";
import { router } from "expo-router";
import { updateRouteSaveStatus, RoutePreview } from "@/models/routeCardModel";
import Logger from "@/utils/Logger"; // Import Logger

export function useRouteCardController(route: RoutePreview) {
  const [isSaved, setIsSaved] = useState(route.saved || false);

  // Sync UI state when parent re-fetches data
  useEffect(() => {
    setIsSaved(route.saved || false);
  }, [route.saved]);

  const onPressCard = () => {
    if (!route.id) {
      Logger.error("Route ID is missing on card press", null, {
        routeName: route.name,
      });
      return;
    }
    Logger.log("Navigating to route details", { routeId: route.id });
    router.push(`/route/${route.id}`);
  };

  const onToggleSave = (e: any) => {
    e.stopPropagation();

    const newState = !isSaved;
    setIsSaved(newState);

    Logger.log(`Toggling save status`, { routeId: route.id, newState });
    updateRouteSaveStatus(route.id, newState);
  };

  return {
    isSaved,
    onPressCard,
    onToggleSave,
  };
}
