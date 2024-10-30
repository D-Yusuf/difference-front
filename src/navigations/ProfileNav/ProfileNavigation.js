import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Profile from "../../screens/Profile/Profile";
import EditProfile from "../../screens/Profile/EditProfile";
import invention from "../../screens/Invention";
import NAVIGATION from "../index";
import UserProfile from "../../screens/Profile/UserProfile";

import InventionDetails from "../../components/InventionDetails";
import EditInvention from "../../screens/EditInvention";

const Stack = createNativeStackNavigator();

const ProfileNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={NAVIGATION.PROFILE.PROFILE} component={Profile} />
      <Stack.Screen
        name={NAVIGATION.PROFILE.EDIT_PROFILE}
        component={EditProfile}
      />
      <Stack.Screen
        name={NAVIGATION.PROFILE.USER_PROFILE}
        component={UserProfile}
      />
      <Stack.Screen name="AddInvention" component={invention} />
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

export default ProfileNavigation;