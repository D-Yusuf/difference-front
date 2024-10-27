import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Profile from "../../screens/Profile/Profile";
import EditProfile from "../../screens/Profile/EditProfile";
import invention from "../../screens/Invention";
import NAVIGATION from "../index";
import InventionDetails from "../../components/InventionDetails";

const Stack = createNativeStackNavigator();

const ProfileNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name={NAVIGATION.PROFILE.PROFILE} component={Profile} />
      <Stack.Screen
        name={NAVIGATION.PROFILE.EDIT_PROFILE}
        component={EditProfile}
      />
      <Stack.Screen name="AddInvention" component={invention} />
      <Stack.Screen
        name={NAVIGATION.PROFILE.INVENTION_DETAILS}
        component={InventionDetails}
      />
    </Stack.Navigator>
  );
};

export default ProfileNavigation;
