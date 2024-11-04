import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../../screens/Home/Home";
import InventionDetails from "../../components/InventionDetails";
import UserProfile from "../../screens/Profile/UserProfile";
import NAVIGATION from "../index";
import InvestDetails from "../../screens/Invest/InvestDetails";

const Stack = createNativeStackNavigator();

const HomeNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={NAVIGATION.HOME.HOME}
        component={Home}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NAVIGATION.HOME.INVENTION_DETAILS}
        component={InventionDetails}
        options={{ headerTitle: "Invention" }}
      />
      <Stack.Screen
        name={NAVIGATION.HOME.USER_PROFILE}
        component={UserProfile}
        options={{ headerTitle: "Profile" }}
      />
      <Stack.Screen
        name={NAVIGATION.HOME.INVEST_DETAILS}
        component={InvestDetails}
        options={{ headerTitle: "Invest" }}
      />
    </Stack.Navigator>
  );
};

export default HomeNavigation;
