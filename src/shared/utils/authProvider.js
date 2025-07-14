import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("authToken");
    const userData = Cookies.get("user");
    if (token && userData) {
      setUser(JSON.parse(userData));
      setIsLoggedIn(true);
    }
    setIsLoading(false);
  }, []);

  const initSession = (token, user) => {
    Cookies.set("authToken", token);
    Cookies.set("user", JSON.stringify(user));
    setUser(user);
    setIsLoggedIn(true);
  };

  const endSession = () => {
    console.log("removing authToken and user data....");
    Cookies.remove("authToken");
    Cookies.remove("user");
    setUser(null);
    setIsLoggedIn(false);
    router.push(`/login`);
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn, isLoading, initSession, endSession }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
