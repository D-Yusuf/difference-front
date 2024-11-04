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
import { createMessageRoom, getMessageRoomById } from "../api/chat";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { socket } from "../api/index";

const ChatRoom = ({ route }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [user] = useContext(UserContext);
  const { recipientId, userName, messageRoomId } = route.params;
  const queryClient = useQueryClient();
  const scrollRef = useRef();
  const { data, refetch: refetchMessages } = useQuery({
    queryKey: ["messageRoom", messageRoomId],
    queryFn: () => getMessageRoomById(messageRoomId),
  });

  const { mutate } = useMutation({
    mutationFn: (message) => createMessageRoom(message),
    mutationKey: ["createMessageRoom"],
    onSuccess: () => {
      console.log("Message room created successfully");
      queryClient.invalidateQueries({ queryKey: ["messageRoom"] });
      setMessage("");
      socket.emit("message", message);
      socket.on("message", (data) => {
        console.log("Hi");
        refetchMessages();
      });
      // Scroll to bottom after new message
      if (scrollRef.current) {
        scrollRef.current.scrollToEnd({ animated: true });
      }
    },
    onError: (error) => {
      console.log("Error creating message room:", error);
    },
  });

  useEffect(() => {
    socket.on("message", (data) => {
      queryClient.refetchQueries({ queryKey: ["messageRoom"] });
    });
  }, []);

  //   console.log(data?.messages);
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
        // console.log(newMessage);
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
        <Text
          style={isOwnMessage ? styles.ownMessageText : styles.otherMessageText}
        >
          {item.content}
        </Text>
        <Text
          style={[
            styles.timestamp,
            {
              color: isOwnMessage ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.5)",
            },
          ]}
        >
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
        ref={(ref) => (scrollRef.current = ref)}
        onContentSizeChange={() => {
          if (scrollRef.current) {
            scrollRef.current.scrollToEnd({ animated: true });
          }
        }}
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
    flexGrow: 1,
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
    backgroundColor: "#E8E8E8",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4,
  },
  ownMessageText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  otherMessageText: {
    color: "#333333",
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
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E8E8E8",
  },
  input: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    fontSize: 16,
    color: "#000000",
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
