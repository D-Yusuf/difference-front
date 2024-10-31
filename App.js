import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NavigationContainer } from "@react-navigation/native";
import AuthNavigation from "./src/navigations/AuthNav/AuthNavigation";
import UserContext from "./src/context/UserContext";
import { getToken } from "./src/api/storage";
import MainNavigation from "./src/navigations/MainNavigation";
import { useState, useEffect } from "react";
import { SafeAreaView, Text } from "react-native";
import { logout } from "./src/api/auth";
import { getProfile } from "./src/api/profile";
import { ThemeContext } from "./src/context/ThemeContext";

export default function App() {
  const queryClient = new QueryClient();
  const [backgroundColor, setBackgroundColor] = useState("#88B3D4");
  const [user, setUser] = useState({
    loggedIn: false,
    _id: null,
    role: null,
  });
  const [loading, setLoading] = useState(false);
  const checkToken = async () => {
    setLoading(true);
    const token = await getToken();
    // console.log(token)
    if (token) {
      setUser({ ...user, loggedIn: true, _id: token?._id, role: token?.role });
    }
    setLoading(false);
  };

  useEffect(() => {
    checkToken();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }
  return (
    <NavigationContainer>
      <QueryClientProvider client={queryClient}>
        <ThemeContext.Provider value={{ backgroundColor, setBackgroundColor }}>
          <UserContext.Provider value={[user, setUser]}>
            {user.loggedIn ? (
              // <SafeAreaView style={{ flex: 1, backgroundColor }}>
              <MainNavigation />
            ) : (
              // </SafeAreaView>
              <AuthNavigation />
            )}
          </UserContext.Provider>
        </ThemeContext.Provider>
      </QueryClientProvider>
    </NavigationContainer>
  );
}
