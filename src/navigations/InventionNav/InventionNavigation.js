import { View, Text } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import InventionDetails from "../../Components/InventionDetails";
import NAVIGATION from "../index";
import EditInvention from "../../screens/EditInvention";
const Stack = createNativeStackNavigator();
const InventionNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={NAVIGATION.INVENTION.INVENTION_DETAILS}
        component={InventionDetails}
      />
      <Stack.Screen
        name={NAVIGATION.INVENTION.EDIT_INVENTION}
        component={EditInvention}
      />
    </Stack.Navigator>
  );
};

export default InventionNavigation;
