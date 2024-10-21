import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Login from "./src/screens/Login";
import { NavigationContainer } from "@react-navigation/native";
import AuthNavigation from "./src/navigations/AuthNav/AuthNavigation";
const queryClient = new QueryClient();

export default function App() {
  return (
    <NavigationContainer>
      <QueryClientProvider client={queryClient}>
        <AuthNavigation />
      </QueryClientProvider>
    </NavigationContainer>
  );
}
//-----

/* <Login />
<InvestorRegister/> */

//------
