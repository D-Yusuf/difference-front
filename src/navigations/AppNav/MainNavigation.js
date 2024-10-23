import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Invention from "../../screens/Invention";
import Home from "../../screens/Home";
const tab = createBottomTabNavigator();
const MainNavigation = () => {
  return (
    <tab.Navigator>
      <tab.Screen name="Home" component={Home} />
      <tab.Screen name="Invention" component={Invention} />
    </tab.Navigator>
  );
};
export default MainNavigation;
