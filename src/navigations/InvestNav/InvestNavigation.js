import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import NAVIGATION from "..";
import Invest from "../../screens/Invest/Invest";
import InvestDetails from "../../screens/Invest/InvestDetails";
import InventionDetails from "../../components/InventionDetails";

const Stack = createNativeStackNavigator();

const InvestNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name={NAVIGATION.INVEST.INVEST} component={Invest} />
      <Stack.Screen
        name={NAVIGATION.INVEST.INVENTION_DETAILS}
        component={InventionDetails}
      />
    </Stack.Navigator>
  );
};

export default InvestNavigation;
