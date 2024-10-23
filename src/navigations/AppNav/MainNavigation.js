import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Invention from "../../screens/Invention";
import Home from "../../screens/Home";
import ProfileNavigation from "../ProfileNav/ProfileNavigation";
const tab = createBottomTabNavigator();
const MainNavigation = () => {
  return (
    <tab.Navigator>
      <tab.Screen name="Home" component={Home} />
      <tab.Screen name="Profile" component={ProfileNavigation} />
    </tab.Navigator>
  );
};
export default MainNavigation;
