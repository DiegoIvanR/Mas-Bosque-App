import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import MapView from "react-native-maps";
import { router } from "expo-router";
import BottomSheet from "@gorhom/bottom-sheet";
import { ToastAndroid, Keyboard } from "react-native";
import {
  Route,
  getLocalRouteById,
  saveRouteLocally,
  checkIfRouteIsSaved,
  deleteLocalRouteById,
} from "@/lib/database";
import { fetchRouteSupabase } from "@/models/routesModel";
import { Comment, getComments, addComment } from "@/models/commentsModel";
import { previewRouteModel } from "@/models/previewRouteModel";

export function useRoutesController(id: string, isOffline?: string) {
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
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentsError, setCommentsError] = useState<string | null>(null);

  // 🔎 Debug state transitions (improvement from version 2)
  useEffect(() => {
    console.log(`[STATE UPDATE] Loading: ${loading}, Route Loaded: ${!!route}`);
  }, [loading, route]);

  // Permissions
  useEffect(() => {
    try {
      previewRouteModel.getLocationPermision();
      setHasLocationPermission(true);
    } catch (error: any) {
      setError(error.message);
    }
  }, []);

  // --- FETCH ROUTE LOGIC ---
  useEffect(() => {
    // 1. Guard Clause: If no ID, stop.
    if (!id) return;

    let isMounted = true;
    console.log("Fetching route with ID:", id);

    async function fetchRoute() {
      // 2. ONLY set loading true if we don't already have data for this ID
      // This prevents the screen flickering or getting stuck if the effect re-runs
      setLoading(true);
      setError(null);

      try {
        const isSaved = await checkIfRouteIsSaved(id!); // check db
        if (!isMounted) return;
        setIsDownloaded(isSaved);

        let data: Route | null = null;

        if (isOffline === "true") {
          data = await getLocalRouteById(id!);
          if (!data) throw new Error("Route not found in local storage.");
        } else {
          data = await fetchRouteSupabase(id!);
        }

        if (!isMounted) return;

        // 3. Batch Updates: Set data and loading together
        setRoute(data);
      } catch (e: any) {
        if (!isMounted) return;
        console.error("Error fetching route:", e.message);
        setError(e.message || "Failed to fetch route data.");
      } finally {
        if (isMounted) {
          // 4. Crucial: Ensure this runs to unblock the UI
          setLoading(false);
          console.log("[CONTROLLER] Fetch finished, Loading set to FALSE");
        }
      }
    }

    fetchRoute();

    return () => {
      isMounted = false;
    };
  }, [id, isOffline]); // Dependency array

  // --- COMMENTS LOGIC ---
  const fetchCommentSection = useCallback(() => {
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
  }, [id]);

  useEffect(fetchCommentSection, [id]);

  // Keyboard listeners
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
    if (route?.route_data && mapRef.current) {
      mapRef.current.fitToCoordinates(route.route_data, {
        edgePadding: { top: 100, right: 50, bottom: 300, left: 50 },
        animated: true,
      });
    }
  }, [route]);

  const handleToggleDownload = useCallback(async () => {
    if (!route) return;

    try {
      if (isDownloaded) {
        await deleteLocalRouteById(route.id);
        setIsDownloaded(false);
        ToastAndroid.show("Route removed from local saves", ToastAndroid.SHORT);
      } else {
        await saveRouteLocally(route);
        setIsDownloaded(true);
        ToastAndroid.show("Route saved for offline use!", ToastAndroid.SHORT);
      }
    } catch (e: any) {
      console.error("Failed to toggle download:", e.message);
      ToastAndroid.show("Action failed", ToastAndroid.SHORT);
    }
  }, [route, isDownloaded]);

  const handleStart = useCallback(() => {
    if (!route) return;
    router.push({
      pathname: "/route/tracking",
      params: { id: route.id },
    });
  }, [route]);

  const handleSend = async () => {
    if (!inputText.trim()) return;
    setIsPosting(true);

    try {
      await addComment(route!.id, inputText, replyingTo?.id || null);

      setInputText("");
      setReplyingTo(null);
      Keyboard.dismiss();
      setKeyboardVisible(false);

      fetchCommentSection();
    } catch (e) {
      alert("Failed to post comment");
    } finally {
      setIsPosting(false);
    }
  };

  const handleCancelReply = () => setReplyingTo(null);

  const handleReplyPress = (comment: Comment) => {
    setReplyingTo(comment);
    inputRef.current?.focus();
  };

  return {
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
  };
}
