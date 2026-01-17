/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { type User } from "../types";
import { authApi } from "../api/authApi";
import { api } from "../api/axios";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  // UPDATED: login is now async and only needs the token
  login: (token: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  // Start true to prevent "flicker" of login screen on refresh
  const [isLoading, setIsLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem("aegis_token");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
    // Optional: redirect logic can be handled here or in the UI components
    window.location.href = "/login";
  };

  // Helper to fetch profile
  const fetchUserProfile = async () => {
    try {
      const userData = await authApi.getMe();
      setUser(userData);
    } catch (error) {
      console.error("Failed to fetch user profile", error);
      logout(); // Force logout if token is invalid
    }
  };

  // Check for token on app startup
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("aegis_token");
      if (token) {
        // Ensure axios sends the token
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        await fetchUserProfile();
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  // UPDATED LOGIN FUNCTION
  const login = async (token: string) => {
    // 1. Save Token
    localStorage.setItem("aegis_token", token);

    // 2. Set Axios Header immediately
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    // 3. Fetch full User Data (including DriverId/Avatar)
    // This ensures the UI has the complete "Real" user object
    await fetchUserProfile();
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
