import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NavigationContainer } from "@react-navigation/native";
import AuthNavigation from "./src/navigations/AuthNav/AuthNavigation";
import UserContext from "./src/context/UserContext";
import { getToken } from "./src/api/storage";
import MainNavigation from "./src/navigations/AppNav/MainNavigation";
import { useState, useEffect } from "react";
import Invest from "./src/screens/Invest";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Text } from "react-native";
import { logout } from "./src/api/auth";
import Home from "./src/screens/Home";
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
        <UserContext.Provider value={[user, setUser]}>
          {user ? <MainNavigation /> : <AuthNavigation />}

          {/* here i want to check if the user is logged in or not and if not then show the AuthNavigation */}
        </UserContext.Provider>
      </QueryClientProvider>
    </NavigationContainer>
  );
}
//-----

/* <Login />
<InvestorRegister/> */

//------
