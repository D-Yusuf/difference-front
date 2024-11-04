import { View, Text } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import InventionDetails from "../../components/InventionDetails";
import NAVIGATION from "../index";
import EditInvention from "../../screens/EditInvention";
import UserProfile from "../../screens/Profile/UserProfile";
const Stack = createNativeStackNavigator();
const InventionNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name={NAVIGATION.INVENTION.INVENTION_DETAILS}
        component={InventionDetails}
        options={{
          headerTitle: "Invention",
        }}
      />
      <Stack.Screen
        name={NAVIGATION.INVENTION.USER_PROFILE}
        component={UserProfile}
        options={{
          headerTitle: "Profile",
        }}
      />
      <Stack.Screen
        name={NAVIGATION.INVENTION.EDIT_INVENTION}
        component={EditInvention}
        options={{
          headerTitle: "Edit Invention",
        }}
      />
    </Stack.Navigator>
  );
};

export default InventionNavigation;
