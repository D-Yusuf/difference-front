import React, { useState, useEffect, useContext, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { colors } from "../../Colors";
import Icon from "react-native-vector-icons/Ionicons";
import UserContext from "../context/UserContext";
import io from "socket.io-client";
import { BASE_URL } from "../api";
import { createMessageRoom, getMessageRoomById } from "../api/chat";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const ChatRoom = ({ route }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [user] = useContext(UserContext);
  const socket = useRef(null);
  const { recipientId, userName, messageRoomId } = route.params;
  const queryClient = useQueryClient();

  //   useEffect(() => {
  //     // Connect to Socket.IO
  //     socket.current = io(BASE_URL);

  //     // Login to socket
  //     socket.current.emit("login", user._id);

  //     // Listen for new messages
  //     socket.current.on("newMessage", (newMessage) => {
  //       setMessages((prev) => [...prev, newMessage]);
  //     });

  //     // Load existing messages
  //     loadMessages();

  //     return () => {
  //       if (socket.current) {
  //         socket.current.disconnect();
  //       }
  //     };
  //   }, []);

  //   const loadMessages = async () => {
  //     try {
  //       const chatMessages = await getChatMessages(recipientId);
  //       setMessages(chatMessages);
  //     } catch (error) {
  //       console.error("Error loading messages:", error);
  //     }
  //   };

  const { mutate } = useMutation({
    mutationFn: (message) => createMessageRoom(message),
    mutationKey: ["createMessageRoom"],
    onSuccess: () => {
      console.log("Message room created successfully");
      queryClient.invalidateQueries({ queryKey: ["messageRoom"] });
      setMessage("");
    },
    onError: (error) => {
      console.log("Error creating message room:", error);
    },
  });

  const { data } = useQuery({
    queryKey: ["messageRoom", messageRoomId],
    queryFn: () => getMessageRoomById(messageRoomId),
  });
  console.log(data?.messages);
  const handleSendMessage = async () => {
    if (message.trim()) {
      try {
        const newMessage = {
          content: message,
          sender: user._id,
          recipient: recipientId,
          timestamp: new Date(),
        };
        mutate(newMessage);

        // Send to backend
        console.log(newMessage);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const renderMessage = ({ item }) => {
    const isOwnMessage = item.sender === user._id;
    return (
      <View
        style={[
          styles.messageContainer,
          isOwnMessage ? styles.ownMessage : styles.otherMessage,
        ]}
      >
        <Text style={styles.messageText}>{item.content}</Text>
        <Text style={styles.timestamp}>
          {new Date(item.createdAt).toLocaleTimeString()}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={90}
    >
      <FlatList
        data={data?.messages}
        renderItem={(item) => renderMessage(item)}
        keyExtractor={(item) => item._id.toString()}
        contentContainerStyle={styles.messagesList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
          placeholderTextColor="#666"
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Icon name="send" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.page,
  },
  messagesList: {
    padding: 16,
  },
  messageContainer: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  ownMessage: {
    backgroundColor: colors.primary,
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
  },
  otherMessage: {
    backgroundColor: colors.secondary,
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4,
  },
  messageText: {
    color: "#fff",
    fontSize: 16,
  },
  timestamp: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: colors.secondary,
  },
  input: {
    flex: 1,
    backgroundColor: colors.secondary,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    fontSize: 16,
    color: colors.primary,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.secondary,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ChatRoom;
