import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NavigationContainer } from "@react-navigation/native";
import AuthNavigation from "./src/navigations/AuthNav/AuthNavigation";
import UserContext from "./src/context/UserContext";
import { getToken } from "./src/api/storage";
import MainNavigation from "./src/navigations/MainNavigation";
import { useState, useEffect } from "react";
import Invest from "./src/screens/Invest";
import { logout } from "./src/api/auth";
export default function App() {
  const queryClient = new QueryClient();
  const [user, setUser] = useState(false);
  useEffect(() => {
    const checkToken = async () => {
      const token = await getToken();
      console.log(token)
      setUser(token ? true : false);
    };
    checkToken();
  }, []);

  return (
    <NavigationContainer>
      <QueryClientProvider client={queryClient}>
        <UserContext.Provider value={[user, setUser]}>
          {user ? <MainNavigation /> : <AuthNavigation />}
          {/* {user ? <Invest /> : <AuthNavigation />} */}
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
