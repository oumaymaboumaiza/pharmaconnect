import React, { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");

    if (role && token) {
      setUser({ role, token });
      setIsAuthenticated(true);
    }

    setIsLoading(false);
  }, []);

  // Nouvelle fonction login
  const login = (role, token) => {
    localStorage.setItem("role", role);
    localStorage.setItem("token", token);
    setUser({ role, token });
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
