import {useState, useEffect, useRef, useMemo, useCallback} from "react";
import MapView from "react-native-maps";
import {router} from "expo-router";
import BottomSheet from "@gorhom/bottom-sheet";
import {ToastAndroid, Keyboard} from "react-native";
import {
    Route,
    getLocalRouteById,
    saveRouteLocally,
    checkIfRouteIsSaved,
    deleteLocalRouteById,
} from "@/lib/database";
import {fetchRouteSupabase} from "@/models/routesModel";
import {Comment, getComments, addComment} from "@/models/commentsModel";
import {previewRouteModel} from "@/models/previewRouteModel";
import Logger from "@/utils/Logger";

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


    useEffect(() => {
        if (!id || !/^[a-zA-Z0-9_-]+$/.test(id)) {
            Logger.error("Invalid route ID", {id});
            setError("Invalid route ID");
            return;
        }

        Logger.log(
            `[RouteController State] Loading: ${loading}, Route Loaded: ${!!route}`,
            {routeId: id}
        );
    }, [loading, route]);

    useEffect(() => {
        try {
            previewRouteModel.getLocationPermision();
            setHasLocationPermission(true);
        } catch (error: any) {
            Logger.error("Failed to get location permission", error);
            setError(error.message);
        }
    }, []);

    // --- FETCH ROUTE LOGIC ---
    useEffect(() => {
        if (!id) return;

        let isMounted = true;
        Logger.log("Fetching route", {id, isOffline});

        async function fetchRoute() {
            setLoading(true);
            setError(null);

            try {
                const isSaved = await checkIfRouteIsSaved(id!);
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
                setRoute(data);
            } catch (e: any) {
                if (!isMounted) return;
                Logger.error("Error fetching route data", e, {id, isOffline});
                setError(e.message || "Failed to fetch route data.");
            } finally {
                if (isMounted) {
                    setLoading(false);
                    Logger.log("Route fetch finished");
                }
            }
        }

        fetchRoute();
        return () => {
            isMounted = false;
        };
    }, [id, isOffline]);

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
                Logger.error("Failed to fetch comments", e, {routeId: id});
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
            Logger.log("Map ready, fitting coordinates");
            mapRef.current.fitToCoordinates(route.route_data, {
                edgePadding: {top: 100, right: 50, bottom: 300, left: 50},
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
                Logger.log("Route removed from local saves", {routeId: route.id});
                ToastAndroid.show("Route removed from local saves", ToastAndroid.SHORT);
            } else {
                await saveRouteLocally(route);
                setIsDownloaded(true);
                Logger.log("Route saved locally", {routeId: route.id});
                ToastAndroid.show("Route saved for offline use!", ToastAndroid.SHORT);
            }
        } catch (e: any) {
            Logger.error("Failed to toggle download status", e, {
                routeId: route.id,
            });
            ToastAndroid.show("Action failed", ToastAndroid.SHORT);
        }
    }, [route, isDownloaded]);

    const handleStart = useCallback(() => {
        if (!route) return;
        Logger.log("Starting route tracking", {routeId: route.id});
        router.push({
            pathname: "/route/tracking",
            params: {id: route.id},
        });
    }, [route]);

    const handleSend = async () => {
        if (!inputText.trim()) return;
        setIsPosting(true);

        try {
            Logger.log("Posting comment", {
                routeId: route!.id,
                isReply: !!replyingTo,
            });
            await addComment(route!.id, inputText.slice(0, 500), replyingTo?.id || null);

            setInputText("");
            setReplyingTo(null);
            Keyboard.dismiss();
            setKeyboardVisible(false);

            fetchCommentSection();
        } catch (e) {
            Logger.error("Failed to post comment", e, {routeId: route?.id});
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
