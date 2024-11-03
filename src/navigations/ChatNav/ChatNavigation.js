import { StyleSheet, Text, View } from "react-native";
import React from "react";
import ChatList from "../../components/ChatList";
import NAVIGATION from "../index";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChatRoom from "../../components/ChatRoom";
const Stack = createNativeStackNavigator();

const ChatNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={NAVIGATION.CHAT.CHAT_LIST}
        component={ChatList}
        options={{
          headerTitle: "Messages",
        }}
      />
      <Stack.Screen
        name={NAVIGATION.CHAT.CHAT_ROOM}
        component={ChatRoom}
        options={({ route }) => ({
          headerTitle: route.params?.userName || "Chat",
        })}
      />
    </Stack.Navigator>
  );
};

export default ChatNavigation;
