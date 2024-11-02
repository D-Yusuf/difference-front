import { View, Text } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../../screens/Home/Home";
import InventionNavigation from "../InventionNav/InventionNavigation";

import NAVIGATION from "../index";
import InventionDetails from "../../components/InventionDetails";
import InvestDetails from "../../screens/Invest/InvestDetails";
const Stack = createNativeStackNavigator();
const HomeNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={NAVIGATION.HOME.HOME}
        component={Home}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={NAVIGATION.INVENTION.INVENTION_DETAILS}
        options={{
          headerTitle: "Invention",
        }}
        component={InventionDetails}
      />
      <Stack.Screen
        name={NAVIGATION.HOME.INVEST_DETAILS}
        options={{
          headerTitle: "Invest",
        }}
        component={InvestDetails}
      />
    </Stack.Navigator>
  );
};

export default HomeNavigation;
