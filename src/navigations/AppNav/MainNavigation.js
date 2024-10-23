import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Invention from "../../screens/Invention";
import Home from "../../screens/Home";
import Profile from "../../screens/Profile";
const tab = createBottomTabNavigator();
const MainNavigation = () => {
  return (
    <tab.Navigator>
      <tab.Screen name="Home" component={Home} />
      <tab.Screen name="Invention" component={Invention} />
      <tab.Screen name="Profile" component={Profile} />
    </tab.Navigator>
  );
};
export default MainNavigation;
