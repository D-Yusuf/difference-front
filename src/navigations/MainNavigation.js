import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import NAVIGATION from "./index";
import HomeNavigation from "./HomeNav/HomeNavigation";
import ProfileNavigation from "./ProfileNav/ProfileNavigation";
import ChatNavigation from "./ChatNav/ChatNavigation";
import LivePitchNavigation from "./LivePitchNav/LivePitchNavigation";
import { colors } from "../../Colors";

const Tab = createBottomTabNavigator();

const MainNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "white",
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: "#003863",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.secondary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tab.Screen
        name={NAVIGATION.HOME.INDEX}
        component={HomeNavigation}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="home-outline" size={24} color={color} />
          ),
          tabBarLabel: "Discover",
        }}
      />
      <Tab.Screen
        name={NAVIGATION.CHAT.INDEX}
        component={ChatNavigation}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="chatbubble-outline" size={24} color={color} />
          ),
          tabBarLabel: "Chat",
        }}
      />
      <Tab.Screen
        name={NAVIGATION.PROFILE.INDEX}
        component={ProfileNavigation}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="person-outline" size={24} color={color} />
          ),
          tabBarLabel: "Profile",
        }}
      />
      <Tab.Screen
        name="LivePitch"
        component={LivePitchNavigation}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="videocam" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigation;
