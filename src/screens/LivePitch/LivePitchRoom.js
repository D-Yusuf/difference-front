import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import RtcEngine from "react-native-agora";
import { useQuery } from "@tanstack/react-query";
import { getInvention } from "../../api/invention";
import { colors } from "../../../Colors";
import { socket } from "../../api";
import LoadingView from "../../components/LoadingView";

const LivePitchRoom = ({ route, navigation }) => {
  const { channelName, hostId, inventionId, pitchId } = route.params;
  const [engine, setEngine] = useState(null);
  const [joined, setJoined] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewerCount, setViewerCount] = useState(0);

  const { data: invention } = useQuery({
    queryKey: ["invention", inventionId],
    queryFn: () => getInvention(inventionId),
  });

  useEffect(() => {
    initializeAgora();

    socket.on("updateViewerCount", ({ pitchId: updatedPitchId, count }) => {
      if (pitchId === updatedPitchId) {
        setViewerCount(count);
      }
    });

    return () => {
      engine?.destroy();
      socket.off("updateViewerCount");
    };
  }, []);

  const initializeAgora = async () => {
    try {
      setIsLoading(true);
      const agoraEngine = await RtcEngine.create("YOUR_AGORA_APP_ID");

      agoraEngine.enableVideo();
      agoraEngine.enableAudio();

      agoraEngine.addListener("JoinChannelSuccess", () => {
        setJoined(true);
      });

      agoraEngine.addListener("UserJoined", (uid, elapsed) => {
        console.log("User joined:", uid);
      });

      agoraEngine.addListener("UserOffline", (uid, reason) => {
        console.log("User offline:", uid);
      });

      setEngine(agoraEngine);
      await agoraEngine.joinChannel(null, channelName, null, 0);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingView />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.videoContainer}>
        {/* Agora video views will be rendered here */}
      </View>

      <View style={styles.controls}>
        <Text style={styles.viewerCount}>{viewerCount} viewers</Text>
        <TouchableOpacity
          style={styles.endButton}
          onPress={async () => {
            await engine?.leaveChannel();
            navigation.goBack();
          }}
        >
          <Text style={styles.endButtonText}>End</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  videoContainer: {
    flex: 1,
  },
  controls: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  endButton: {
    backgroundColor: "red",
    padding: 16,
    borderRadius: 8,
  },
  endButtonText: {
    color: "white",
  },
  viewerCount: {
    color: "white",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  errorText: {
    color: "red",
    marginBottom: 16,
  },
  backButton: {
    color: colors.primary,
  },
});

export default LivePitchRoom;
