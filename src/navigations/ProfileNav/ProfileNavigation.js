import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Profile from "../../screens/Profile";
import EditProfile from "../../screens/EditProfile";
import invention from "../../screens/Invention";

const Stack = createNativeStackNavigator();

const ProfileNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="AddInvention" component={invention} />
    </Stack.Navigator>
  );
};

export default ProfileNavigation;
