import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NavigationContainer } from "@react-navigation/native";
import AuthNavigation from "./src/navigations/AuthNav/AuthNavigation";
import UserContext from "./src/context/UserContext";
import { getToken } from "./src/api/storage";
import MainNavigation from "./src/navigations/MainNavigation";
import { useState, useEffect } from "react";
import Invest from "./src/screens/Invest/Invest";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Button, Text } from "react-native";
import { logout } from "./src/api/auth";
import Home from "./src/screens/Home/Home";
export default function App() {
  const queryClient = new QueryClient();

  const [user, setUser] = useState(false);

  const checkToken = async () => {
    const token = await getToken();
    if (token) {
      setUser(true);
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  return (
    <NavigationContainer>
      <QueryClientProvider client={queryClient}>
        <SafeAreaView style={{ flex: 1 }}>
          <UserContext.Provider value={[user, setUser]}>
            {/* {user ? <Invest /> : <AuthNavigation />} */}
            {user ? <MainNavigation /> : <AuthNavigation />}
          </UserContext.Provider>
      </SafeAreaView>
    </QueryClientProvider>
    </NavigationContainer>
  );
}
//-----

/* <Login />
<InvestorRegister/> */

//------
