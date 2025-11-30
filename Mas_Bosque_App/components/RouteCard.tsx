// index.tsx
import React from "react";
import { RoutePreview } from "@/models/routeCardModel";
import { useRouteCardController } from "@/hooks/routeCardController";
import { RouteCardView } from "@/views/routeCardViews";

export default function RouteCard({ route }: { route: RoutePreview }) {
  const { isSaved, onPressCard, onToggleSave } = useRouteCardController(route);

  return (
    <RouteCardView
      route={route}
      isSaved={isSaved}
      onPressCard={onPressCard}
      onToggleSave={onToggleSave}
    />
  );
}
