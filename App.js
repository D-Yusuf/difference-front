import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NavigationContainer } from "@react-navigation/native";
import AuthNavigation from "./src/navigations/AuthNav/AuthNavigation";
import UserContext from "./src/context/UserContext";
import { getToken } from "./src/api/storage";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Text } from "react-native";
import { logout } from "./src/api/auth";
import Invention from "./src/screens/Invention";
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
          {/* <SafeAreaView style={{ flex: 1 }}>
            {user ? (
              <Button
                title="Logout"
                onPress={() => {
                  logout();
                  setUser(false);
                }}
              />
            ) : (
              <AuthNavigation />
            )}
          </SafeAreaView> */}
          <Invention />
        </UserContext.Provider>
      </QueryClientProvider>
    </NavigationContainer>
  );
}
//-----

/* <Login />
<InvestorRegister/> */

//------
