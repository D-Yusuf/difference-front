import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NavigationContainer } from "@react-navigation/native";
import AuthNavigation from "./src/navigations/AuthNav/AuthNavigation";
import { UserProvider } from "./Context/UserContext";
import { getToken } from "./src/api/storage";
import { useState, useEffect } from "react";
import Invention from "./src/screens/Invention";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <UserProvider>
          {/* <AuthNavigation /> */}
          <Invention />
        </UserProvider>
      </NavigationContainer>
    </QueryClientProvider>
  );
}
//-----

/* <Login />
<InvestorRegister/> */

//------
