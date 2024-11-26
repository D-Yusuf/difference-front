import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getLivePitches } from "../../api/livePitch";
import { colors } from "../../../Colors";
import LoadingView from "../../components/LoadingView";
import { socket } from "../../api";

const LivePitchList = ({ navigation }) => {
  const { data: livePitches, isLoading } = useQuery({
    queryKey: ["livePitches"],
    queryFn: getLivePitches,
  });

  useEffect(() => {
    socket.on("newLivePitch", (pitch) => {
      queryClient.invalidateQueries(["livePitches"]);
    });

    socket.on("endLivePitch", (pitchId) => {
      queryClient.invalidateQueries(["livePitches"]);
    });

    return () => {
      socket.off("newLivePitch");
      socket.off("endLivePitch");
    };
  }, []);

  if (isLoading) return <LoadingView />;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.startButton}
        onPress={() => navigation.navigate("StartLivePitch")}
      >
        <Text style={styles.startButtonText}>Start a Live Pitch</Text>
      </TouchableOpacity>

      <FlatList
        data={livePitches}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.pitchCard}
            onPress={() =>
              navigation.navigate("LivePitchRoom", {
                channelName: item.channelName,
                hostId: item.hostId,
                inventionId: item.inventionId,
                pitchId: item._id,
              })
            }
          >
            <Text style={styles.pitchTitle}>{item.title}</Text>
            <Text style={styles.inventorName}>{item.inventor.firstName}</Text>
            <Text style={styles.viewerCount}>{item.viewerCount} watching</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.page,
  },
  startButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  startButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  pitchCard: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});

export default LivePitchList;
