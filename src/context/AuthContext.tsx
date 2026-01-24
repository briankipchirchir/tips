import { createContext, useContext, useState} from "react";
import type { User, UserPlan } from "../types/User";
import type { ReactNode } from 'react';


interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  userPlan: UserPlan;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, _password: string) => {
    // MOCK LOGIN (backend later)
    const mockUser: User = {
      id: 1,
      name: "John Doe",
      email,
      plan: "GOLD", // 🔥 change to test access
      role: "USER",
      token: "mock-jwt-token",
    };

    setUser(mockUser);
    localStorage.setItem("user", JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        userPlan: user?.plan || "NONE",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
