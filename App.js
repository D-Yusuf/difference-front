import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NavigationContainer } from "@react-navigation/native";
import AuthNavigation from "./src/navigations/AuthNav/AuthNavigation";
import UserContext from "./src/context/UserContext";
import { getToken } from "./src/api/storage";
import MainNavigation from "./src/navigations/MainNavigation";
import { useState, useEffect } from "react";
import { SafeAreaView, Text, ScrollView, RefreshControl } from "react-native";
import { logout } from "./src/api/auth";
import { getProfile } from "./src/api/profile";
import { ThemeContext } from "./src/context/ThemeContext";
import { UserProvider } from "./src/context/UserProvider";
import { LogBox } from "react-native";
import { socket } from "./src/api";
LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notification by message
LogBox.ignoreAllLogs();

export default function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 0,
        cacheTime: 0,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
      },
    },
  });
  const [backgroundColor, setBackgroundColor] = useState("#88B3D4");
  const [user, setUser] = useState({
    loggedIn: false,
    _id: null,
    role: null,
    firstName: null,
  });
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const checkToken = async () => {
    setLoading(true);
    const token = await getToken();
    // console.log(token)
    if (token) {
      setUser({
        ...user,
        loggedIn: true,
        _id: token?._id,
        role: token?.role,
        firstName: token?.firstName,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    checkToken();
    socket.connect();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await checkToken();
    setRefreshing(false);
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }
  return (
    <UserProvider>
      <NavigationContainer>
        <QueryClientProvider client={queryClient}>
          <ThemeContext.Provider
            value={{ backgroundColor, setBackgroundColor }}
          >
            <UserContext.Provider value={[user, setUser]}>
              <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
              >
                {user.loggedIn ? <MainNavigation /> : <AuthNavigation />}
              </ScrollView>
            </UserContext.Provider>
          </ThemeContext.Provider>
        </QueryClientProvider>
      </NavigationContainer>
    </UserProvider>
  );
}
