import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import { useLocalSearchParams, router } from "expo-router";
import BottomSheet from "@gorhom/bottom-sheet";
import { ToastAndroid, Keyboard } from "react-native";

import { supabase } from "@/lib/SupabaseClient";
import {
  Route,
  getLocalRouteById,
  saveRouteLocally,
  checkIfRouteIsSaved,
  deleteLocalRouteById,
} from "@/lib/database";
import { RouteDetailView } from "@/components/RouteDetailView";
import { Comment, getComments, addComment } from "@/models/commentsModel";

export default function RouteDetailScreen() {
  const { id, isOffline } = useLocalSearchParams<{
    id: string;
    isOffline?: string;
  }>();

  const [route, setRoute] = useState<Route | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const mapRef = useRef<MapView>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["25%", "60%"], []);

  const [inputText, setInputText] = useState("");
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const inputRef = useRef<any>(null);

  // 1. Keyboard State
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentsError, setCommentsError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Permission to access location was denied");
        return;
      }
      setHasLocationPermission(true);
    })();
  }, []);

  useEffect(() => {
    if (!id) return;
    async function fetchRoute() {
      setLoading(true);
      setError(null);
      try {
        const isSaved = await checkIfRouteIsSaved(id);
        setIsDownloaded(isSaved);
        let data: Route | null = null;
        if (isOffline === "true") {
          data = await getLocalRouteById(id);
          if (!data) throw new Error("Route not found in local storage.");
        } else {
          const { data: supabaseData, error } = await supabase
            .from("routes")
            .select("*")
            .eq("id", id)
            .single();
          if (error) throw error;
          data = supabaseData as Route;
        }
        setRoute(data);
      } catch (e: any) {
        setError(e.message || "Failed to fetch route data.");
      } finally {
        setLoading(false);
      }
    }
    fetchRoute();
  }, [id, isOffline]);

  const fetchCommentSection = () => {
    if (!id) return;

    async function fetchComments() {
      setCommentsLoading(true);
      setCommentsError(null);

      try {
        const result = await getComments(id);
        setComments(result);
      } catch (e: any) {
        setCommentsError(e.message || "Failed to fetch comments.");
      } finally {
        setCommentsLoading(false);
      }
    }

    fetchComments();
  };

  useEffect(fetchCommentSection, [id]);

  // --- FIX: Standard useEffect for Keyboard Listeners ---
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const onMapReady = useCallback(() => {
    if (route && route.route_data && mapRef.current) {
      mapRef.current.fitToCoordinates(route.route_data, {
        edgePadding: { top: 100, right: 50, bottom: 300, left: 50 },
        animated: true,
      });
    }
  }, [route]);

  const handleToggleDownload = useCallback(async () => {
    if (!route) return;
    if (isDownloaded) {
      try {
        await deleteLocalRouteById(route.id);
        setIsDownloaded(false);
        ToastAndroid.show("Route removed from local saves", ToastAndroid.SHORT);
      } catch (e: any) {
        console.error("Failed to delete route:", e.message);
        ToastAndroid.show("Failed to remove route", ToastAndroid.SHORT);
      }
    } else {
      try {
        await saveRouteLocally(route);
        setIsDownloaded(true);
        ToastAndroid.show("Route saved for offline use!", ToastAndroid.SHORT);
      } catch (e: any) {
        console.error("Failed to save route:", e.message);
        ToastAndroid.show("Failed to save route", ToastAndroid.SHORT);
      }
    }
  }, [route, isDownloaded]);

  const handleStart = useCallback(() => {
    if (!route) return;
    router.push({
      pathname: "/route/tracking",
      params: { id: route.id },
    });
  }, [route]);

  // --- FIX: Updated handleSend logic ---
  const handleSend = async () => {
    if (!inputText.trim()) return;
    setIsPosting(true);
    try {
      await addComment(route!.id, inputText, replyingTo?.id || null);
      setInputText("");
      setReplyingTo(null);

      // 1. Dismiss Keyboard
      Keyboard.dismiss();
      // 2. Force state update immediately (don't wait for listener)
      setKeyboardVisible(false);

      fetchCommentSection();
    } catch (e) {
      console.error(e);
      alert("Failed to post comment");
    } finally {
      setIsPosting(false);
      // REMOVED: keyboardBehaviour() call here. It was causing duplicated listeners.
    }
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    // Optional: Dismiss keyboard here too if you want to cancel typing completely
    // Keyboard.dismiss();
    // setKeyboardVisible(false);
  };

  const handleReplyPress = (comment: Comment) => {
    setReplyingTo(comment);
    inputRef.current?.focus();
  };

  return (
    <RouteDetailView
      loading={loading}
      error={error}
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
