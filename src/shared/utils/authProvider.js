import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("authToken");
    if (token) {
      setIsLoggedIn(true);
    }
    setIsLoading(false);
  }, []);

  const initSession = (token) => {
    Cookies.set("authToken", token);
    setIsLoggedIn(true);
  };

  const endSession = () => {
    console.log("removing authToken....");
    router.push(`/login`);
    Cookies.remove("authToken");
    setIsLoggedIn(false);
    // Redirect to login page
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, isLoading, initSession, endSession }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
