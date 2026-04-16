import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import api from "@/services/api";

interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  savedArticles?: string[];
  savedLabels?: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  updateSavedArticles: (articles: string[]) => void;
  updateSavedLabels: (labels: string[]) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  updateSavedArticles: () => {},
  updateSavedLabels: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.get("/auth/me").then(res => setUser(res.data.data)).catch(() => {
        localStorage.removeItem("token");
        setUser(null);
      });
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    api.get("/auth/me").then(res => setUser(res.data.data)).catch(() => {});
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const updateSavedArticles = (articles: string[]) => {
    if (user) setUser({ ...user, savedArticles: articles });
  };

  const updateSavedLabels = (labels: string[]) => {
    if (user) setUser({ ...user, savedLabels: labels });
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, updateSavedArticles, updateSavedLabels }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
