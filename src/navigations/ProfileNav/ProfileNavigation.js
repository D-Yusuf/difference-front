import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Profile from "../../screens/Profile/Profile";
import EditProfile from "../../screens/Profile/EditProfile";
import invention from "../../screens/Invention";
import NAVIGATION from "../index";
import UserProfile from "../../screens/Profile/UserProfile";
import { View } from "react-native";
import InventionDetails from "../../components/InventionDetails";
import EditInvention from "../../screens/EditInvention";
import { colors } from "../../../Colors";
import OrderList from "../../components/OrderList";
import Orders from "../../screens/Profile/Orders";

const Stack = createNativeStackNavigator();

const ProfileNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={NAVIGATION.PROFILE.PROFILE}
        component={Profile}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={NAVIGATION.PROFILE.EDIT_PROFILE}
        component={EditProfile}
      />
      {/* <Stack.Screen
        name={NAVIGATION.PROFILE.USER_PROFILE}
        component={UserProfile}
      /> */}
      <Stack.Screen
        name="AddInvention"
        component={invention}
        options={{
          headerTitle: "Add Invention",
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: "white",
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name={NAVIGATION.INVENTION.INVENTION_DETAILS}
        options={{
          headerTitle: "Invention",
          headerShadowVisible: false,
        }}
        component={InventionDetails}
      />
      <Stack.Screen
        name={NAVIGATION.INVENTION.EDIT_INVENTION}
        options={{
          headerTitle: "Edit Invention",
          headerShadowVisible: false,
        }}
        component={EditInvention}
      />
      <Stack.Screen
        name={NAVIGATION.PROFILE.ORDERS}
        component={Orders}
        options={{
          headerTitle: "Orders",
          headerShadowVisible: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default ProfileNavigation;
