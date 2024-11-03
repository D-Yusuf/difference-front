import React, { useState } from "react";
import UserContext from "./UserContext";

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: "1",
    firstName: "John",
    lastName: "Doe",
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
