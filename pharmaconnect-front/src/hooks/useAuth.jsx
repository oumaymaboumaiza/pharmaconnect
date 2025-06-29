import React, { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

 useEffect(() => {
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const nom = localStorage.getItem("nom");
  const prenom = localStorage.getItem("prenom");

  if (role && token && userId) {
    setUser({ role, token, id: parseInt(userId), nom, prenom });
    setIsAuthenticated(true);
  }

  setIsLoading(false);
}, []);

const login = (user) => {
  localStorage.setItem("role", user.role);
  localStorage.setItem("token", user.token);
  localStorage.setItem("userId", user.id);
  localStorage.setItem("nom", user.nom);
  localStorage.setItem("prenom", user.prenom);
  setUser(user);
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
