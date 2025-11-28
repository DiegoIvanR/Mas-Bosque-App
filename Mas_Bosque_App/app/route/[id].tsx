import { useLocalSearchParams } from "expo-router";
import LoadingScreen from "@/components/LoadingScreen";
import ErrorScreen from "@/components/ErrorScreen";
import { RouteDetailView } from "@/components/RouteViews/RouteDetailView";
import { useRoutesController } from "@/hooks/routesController";
import { useEffect } from "react";
export default function RouteDetailScreen() {
  // 1. Destructure params
  const params = useLocalSearchParams();

  // 2. Normalize params to ensure they are stable strings (Fixes the loop)
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const isOffline = Array.isArray(params.isOffline)
    ? params.isOffline[0]
    : params.isOffline;

  const {
    loading,
    error,
    route,
    hasLocationPermission,
    isDownloaded,
    mapRef,
    onMapReady,
    bottomSheetRef,
    snapPoints,
    handleToggleDownload,
    handleStart,
    fetchCommentSection,
    comments,
    commentsLoading,
    commentsError,
    handleSend,
    handleCancelReply,
    handleReplyPress,
    inputText,
    replyingTo,
    isPosting,
    inputRef,
    setInputText,
    isKeyboardVisible,
  } = useRoutesController(id, isOffline);

  // 4. Render Logic
  if (loading) {
    console.log("Loading False, rendering  loading screen");
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorScreen error={error} />;
  }

  // Safety check: If not loading and no error, route MUST be present.
  // If route is null here, we render nothing or a fallback to prevent crashes.
  if (!route) return null;

  return (
    <RouteDetailView
      route={route}
      hasLocationPermission={hasLocationPermission}
      isDownloaded={isDownloaded}
      mapRef={mapRef}
      onMapReady={onMapReady}
      bottomSheetRef={bottomSheetRef}
      snapPoints={snapPoints}
      onToggleDownload={handleToggleDownload}
      onStart={handleStart}
      onRefreshComments={fetchCommentSection}
      comments={comments}
      commentsLoading={commentsLoading}
      commentsError={commentsError}
      handleSend={handleSend}
      handleCancelReply={handleCancelReply}
      handleReplyPress={handleReplyPress}
      inputText={inputText}
      replyingTo={replyingTo}
      isPosting={isPosting}
      inputRef={inputRef}
      setInputText={setInputText}
      isKeyboardVisible={isKeyboardVisible}
    />
  );
}
