import React, { useCallback, useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Keyboard,
  Platform,
} from "react-native";
import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Route } from "@/lib/database";
import Button from "@/components/Button";
import { Comment, timeAgo, addComment } from "@/models/commentsModel";

// Mock User ID for now (Replace with your auth logic)

type RouteBottomSheetProps = {
  route: Route;
  bottomSheetRef: React.RefObject<BottomSheet>;
  snapPoints: string[];
  isDownloaded: boolean;
  onToggleDownload: () => void;
  onStart: () => void;
  comments: Comment[] | null;
  commentsLoading: boolean;
  commentsError: string | null;
  onRefreshComments: () => void; // <--- Made optional to prevent crash

  handleSend: () => Promise<void>;
  handleCancelReply: () => void;
  handleReplyPress: (comment: Comment) => void;
  inputText: string;
  replyingTo: Comment | null;
  isPosting: boolean;
  inputRef: any;
  setInputText: React.Dispatch<React.SetStateAction<string>>;
  isKeyboardVisible: boolean;
};

export function RouteBottomSheet({
  route,
  bottomSheetRef,
  snapPoints,
  isDownloaded,
  onToggleDownload,
  onStart,
  comments,
  commentsLoading,
  onRefreshComments,

  handleSend,
  handleCancelReply,
  handleReplyPress,
  inputText,
  replyingTo,
  isPosting,
  inputRef,
  setInputText,
  isKeyboardVisible,
}: RouteBottomSheetProps) {
  const downloadButtonProps = isDownloaded
    ? {
        value: "Saved",
        icon: <Ionicons name="checkmark" size={20} color="white" />,
        backgroundColor: "rgba(120, 120, 128, 0.32)",
        textColor: "white",
      }
    : {
        value: "Download",
        icon: <Ionicons name="download-outline" size={20} color="#00160a" />,
        backgroundColor: "#04FF0C",
        textColor: "#00160a",
      };

  const renderHeader = useCallback(
    () => (
      <View style={styles.headerContainer}>
        <Text style={styles.routeTitle}>{route.name}</Text>
        <Text style={styles.routeLocation}>{route.location}</Text>

        <View style={styles.cardInfoRow}>
          <MaterialIcons name="star" size={14} color="#A0A0A0" />
          <Text style={styles.cardInfoText}>
            {route.rating} · {route.difficulty} · {route.distance_km} km
          </Text>
        </View>

        <View style={styles.buttonRow}>
          <View style={styles.buttonWrapper}>
            <Button
              value={downloadButtonProps.value}
              onClick={onToggleDownload}
              icon={downloadButtonProps.icon}
              backgroundColor={downloadButtonProps.backgroundColor}
              textColor={downloadButtonProps.textColor}
            />
          </View>
          <View style={styles.buttonWrapper}>
            <Button
              value="Start"
              onClick={onStart}
              icon={
                <Ionicons name="paper-plane-outline" size={20} color="white" />
              }
              backgroundColor="rgba(120, 120, 128, 0.32)"
              textColor="white"
            />
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {comments ? `${comments.length} Comments` : "Comments"}
          </Text>
        </View>
      </View>
    ),
    [route, downloadButtonProps, comments]
  );

  const renderComment = useCallback(({ item }: { item: Comment }) => {
    const indent = Math.min(item.level, 4) * 20;
    const initials = (item.firstName?.[0] || "") + (item.lastName?.[0] || "");
    const displayName =
      item.firstName && item.lastName
        ? `${item.firstName} ${item.lastName}`
        : "Unknown User";

    return (
      <View style={[styles.commentRow, { marginLeft: indent }]}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials.toUpperCase() || "?"}</Text>
        </View>

        <View style={styles.commentContent}>
          <View style={styles.commentHeader}>
            <Text style={styles.userName}>{displayName}</Text>
            <Text style={styles.timestamp}>{timeAgo(item.createdAt)}</Text>
          </View>

          <Text style={styles.commentText}>{item.text}</Text>

          <TouchableOpacity
            style={styles.replyButton}
            onPress={() => handleReplyPress(item)}
          >
            <Text style={styles.replyButtonText}>Reply</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }, []);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      handleIndicatorStyle={styles.handleIndicator}
      backgroundStyle={styles.bottomSheetBackground}
      keyboardBehavior="interactive"
      android_keyboardInputMode="adjustResize"
    >
      <BottomSheetFlatList
        data={comments}
        keyExtractor={(item) => item.id}
        renderItem={renderComment}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.contentContainer}
        ListEmptyComponent={
          !commentsLoading ? (
            <Text style={styles.emptyText}>Be the first to comment!</Text>
          ) : null
        }
      />

      {/* 3. Apply Conditional Styling here */}
      <View
        style={[
          styles.inputContainer,
          isKeyboardVisible && styles.inputContainerKeyboardOpen,
        ]}
      >
        {replyingTo && (
          <View style={styles.replyingBar}>
            <Text style={styles.replyingText} numberOfLines={1}>
              Replying to{" "}
              <Text style={{ fontWeight: "bold" }}>{replyingTo.firstName}</Text>
              : "{replyingTo.text}"
            </Text>
            <TouchableOpacity onPress={handleCancelReply}>
              <Ionicons name="close-circle" size={20} color="#8E8E93" />
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.inputRow}>
          <BottomSheetTextInput
            ref={inputRef}
            style={styles.textInput}
            placeholder={replyingTo ? "Write a reply..." : "Add a comment..."}
            placeholderTextColor="#8E8E93"
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              !inputText.trim() && styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={!inputText.trim() || isPosting}
          >
            {isPosting ? (
              <MaterialIcons name="hourglass-empty" size={24} color="#04FF0C" />
            ) : (
              <Ionicons
                name="arrow-up-circle"
                size={32}
                color={inputText.trim() ? "#04FF0C" : "#444"}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: "#002A12",
  },
  handleIndicator: {
    backgroundColor: "#8E8E93",
    width: 40,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingBottom: 120,
  },
  headerContainer: {
    paddingTop: 8,
  },
  routeTitle: {
    color: "white",
    fontSize: 24,
    fontFamily: "Lato-Bold",
    marginBottom: 4,
  },
  routeLocation: {
    color: "#BDBDBD",
    fontSize: 16,
    fontFamily: "Lato-Regular",
    marginBottom: 12,
  },
  cardInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 5,
  },
  cardInfoText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#676767",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    marginBottom: 24,
  },
  buttonWrapper: {
    width: "47%",
  },
  sectionHeader: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
    paddingBottom: 8,
  },
  sectionTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  commentRow: {
    flexDirection: "row",
    marginBottom: 20,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#04FF0C",
    fontWeight: "bold",
    fontSize: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  userName: {
    color: "#E0E0E0",
    fontWeight: "bold",
    fontSize: 13,
  },
  timestamp: {
    color: "#666",
    fontSize: 12,
  },
  commentText: {
    color: "#D0D0D0",
    fontSize: 14,
    lineHeight: 20,
  },
  replyButton: {
    marginTop: 6,
    alignSelf: "flex-start",
  },
  replyButtonText: {
    color: "#8E8E93",
    fontSize: 12,
    fontWeight: "600",
  },
  emptyText: {
    color: "#8E8E93",
    textAlign: "center",
    marginTop: 20,
    fontStyle: "italic",
  },

  // --- Input Styles (Default - Keyboard Closed) ---
  inputContainer: {
    backgroundColor: "#002210",
    padding: 12,
    paddingBottom: Platform.OS === "ios" ? 24 : 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
  },

  // --- Input Styles (Adjusted - Keyboard Open) ---
  inputContainerKeyboardOpen: {
    paddingBottom: 65, // Reduce padding since keyboard adds its own spacing
    // You can also try adding 'marginBottom: 0' or adjusting 'bottom' here if needed
  },

  replyingBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    backgroundColor: "rgba(255,255,255,0.08)",
    padding: 8,
    borderRadius: 8,
  },
  replyingText: {
    color: "#BDBDBD",
    fontSize: 12,
    flex: 1,
    marginRight: 8,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  textInput: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    color: "white",
    fontSize: 16,
    maxHeight: 100,
    minHeight: 40,
  },
  sendButton: {
    marginLeft: 12,
    marginBottom: 4,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
