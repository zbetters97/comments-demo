import { createContext, useContext } from "react";

const AuthContext = createContext();

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvidor!");
  }

  return context;
}

export default AuthContext;
