import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [token, setToken] = useState(
    JSON.parse(localStorage.getItem("token")) || null
  );
  const login = async (inputs) => {
    const res = await axios.post("http://localhost:5000/user-management/user/login", inputs, {
      withCredentials: true,
    });
    setCurrentUser(res.data.data)
    setToken(res.data.token)
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("token", JSON.stringify(token));
  }, [token]);

  const setTokenAndUser = (newToken, newUser) => {
    setCurrentUser(newUser);
    setToken(newToken);
  };

  return (
    <AuthContext.Provider value={{ currentUser, token, login, setTokenAndUser }}>
      {children}
    </AuthContext.Provider>
  );
};
