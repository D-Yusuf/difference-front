import { View, Text } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../../screens/Home/Home";
import InventionNavigation from "../InventionNav/InventionNavigation";

import NAVIGATION from "../index";
import InventionDetails from "../../components/InventionDetails";
const Stack = createNativeStackNavigator();
const HomeNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={NAVIGATION.HOME.HOME} component={Home} />
      <Stack.Screen
        name={NAVIGATION.INVENTION.INVENTION_DETAILS}
        component={InventionDetails}
      />
    </Stack.Navigator>
  );
};

export default HomeNavigation;
