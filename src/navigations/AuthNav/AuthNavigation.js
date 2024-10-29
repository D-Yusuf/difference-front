import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../../screens/Auth/Login";
import Register from "../../screens/Auth/Register";
import NAVIGATION from "../index";

const Stack = createNativeStackNavigator();

const AuthNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={NAVIGATION.AUTH.LOGIN} component={Login} />
      <Stack.Screen name={NAVIGATION.AUTH.REGISTER} component={Register} />
    </Stack.Navigator>
  );
};

export default AuthNavigation;
