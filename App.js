import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NavigationContainer } from "@react-navigation/native";
import AuthNavigation from "./src/navigations/AuthNav/AuthNavigation";
import { UserProvider } from "./Context/UserContext";
import { getToken } from "./src/api/storage";
import { useState, useEffect } from "react";

const queryClient = new QueryClient();

export default function App() {
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
        <UserProvider value={{ user, setUser }}>
          <AuthNavigation />
        </UserProvider>
      </QueryClientProvider>
    </NavigationContainer>
  );
}
//-----

/* <Login />
<InvestorRegister/> */

//------
