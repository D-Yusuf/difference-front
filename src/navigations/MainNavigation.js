import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Invention from "../screens/Invention";
import Home from "../screens/Home";
import ProfileNavigation from "./ProfileNav/ProfileNavigation";
import NAVIGATION from "./index";
const tab = createBottomTabNavigator();
const MainNavigation = () => {
  return (
    <tab.Navigator screenOptions={{ headerShown: false }}>
      <tab.Screen name={NAVIGATION.HOME.INDEX} component={Home} />
      <tab.Screen
        name={NAVIGATION.PROFILE.INDEX}
        component={ProfileNavigation}
      />
    </tab.Navigator>
  );
};
export default MainNavigation;
