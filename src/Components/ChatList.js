import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { colors } from "../../Colors";
import { BASE_URL } from "../api/index";
import { getAllMessageRooms } from "../api/chat";
import { useQuery } from "@tanstack/react-query";

const ChatList = ({ navigation }) => {
  const {
    data: chats,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["getAllMessageRooms"],
    queryFn: getAllMessageRooms,
  });

  console.log(chats);
  if (isLoading) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Error: {error.message}</Text>
      </View>
    );
  }

  const renderChatItem = ({ item }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => {
        navigation.navigate("ChatRoom", {
          recipientId: item?.participants[0]._id,
          userName: item?.participants[0].firstName,
          userImage: item?.participants[0].image,
          messageRoomId: item._id,
        });
      }}
    >
      <Image
        source={{ uri: BASE_URL + item?.participants[0].image }}
        style={styles.avatar}
      />
      <View style={styles.chatInfo}>
        <Text style={styles.name}>{item?.participants[0].firstName}</Text>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item?.messages[item?.messages.length - 1]?.content}
        </Text>
      </View>
      <Text style={styles.time}>
        {new Date(item?.updatedAt).toLocaleTimeString()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {chats.length > 0 ? (
        <FlatList
          scrollEnabled={false}
          data={chats}
          renderItem={(item) => renderChatItem(item)}
          keyExtractor={(item) => item.userId}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No messages yet</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.page,
  },
  chatItem: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.secondary,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  chatInfo: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: "#666",
  },
  time: {
    fontSize: 12,
    color: "#666",
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
});

export default ChatList;
