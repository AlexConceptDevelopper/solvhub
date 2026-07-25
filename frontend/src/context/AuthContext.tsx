import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import type { User } from "../types/user";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAdmin: boolean; // Ajouté ici
  setAuth: (data: { token: string; user: User }) => void;
  updateUser: (updatedUser: Partial<User>) => void;
  logout: () => void;
  loading: boolean;
  apiCall: (url: string, options?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const isAdmin = useMemo(() => user?.role === 'ADMIN', [user]);

  const updateUser = (updatedUser: Partial<User>) => {
    setUser((prevUser) => {
      if (!prevUser) return null;
      const newValues = { ...prevUser, ...updatedUser };
      localStorage.setItem("user", JSON.stringify(newValues));
      return newValues;
    });
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const apiCall = async (url: string, options: RequestInit = {}) => {
    const currentToken = localStorage.getItem("token");

    const headers = {
      "Content-Type": "application/json",
      ...(currentToken ? { Authorization: `Bearer ${currentToken}` } : {}),
      ...options.headers,
    };

    const response = await fetch(`http://localhost:8080/api${url}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      logout();
      throw new Error("Session expirée");
    }

    return response;
  };

  const setAuth = (data: { token: string; user: User }) => {
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
  };

  return (
    <AuthContext.Provider
      // On passe bien isAdmin ici pour qu'il soit accessible partout
      value={{ user, token, isAdmin, setAuth, updateUser, logout, loading, apiCall }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  return context;
};