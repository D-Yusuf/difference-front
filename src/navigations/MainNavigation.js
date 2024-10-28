import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Invention from "../screens/Invention";
import Home from "../screens/Home/Home";
import ProfileNavigation from "./ProfileNav/ProfileNavigation";
import NAVIGATION from "./index";
import InvestNavigation from "./InvestNav/InvestNavigation";
import HomeNavigation from "./HomeNav/HomeNavigation";
import InventionNavigation from "./InventionNav/InventionNavigation";
const tab = createBottomTabNavigator();
const MainNavigation = () => {
  return (
    <tab.Navigator screenOptions={{ headerShown: false }}>
      <tab.Screen name={NAVIGATION.HOME.INDEX} component={HomeNavigation} />
      <tab.Screen
        name={NAVIGATION.PROFILE.INDEX}
        component={ProfileNavigation}
      />
      {/* <tab.Screen name={NAVIGATION.INVEST.INDEX} component={InvestNavigation} /> */}
    </tab.Navigator>
  );
};
export default MainNavigation;
